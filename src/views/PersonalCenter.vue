<template>
  <div class="personal-center-container">
    <el-card class="profile-card">
      <template #header>
        <h2>👤 个人中心</h2>
      </template>

      <div class="profile-content" v-if="userInfo">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="avatar-section">
              <el-avatar :size="100" :icon="UserFilled" />
              <h3>{{ userInfo.realName }}</h3>
              <p>{{ userInfo.studentId }}</p>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="info-section">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="学工号">{{ userInfo.studentId }}</el-descriptions-item>
                <el-descriptions-item label="所在学院">{{ userInfo.college }}</el-descriptions-item>
                <el-descriptions-item label="专业">{{ userInfo.major }}</el-descriptions-item>
                <el-descriptions-item label="年级">{{ userInfo.grade }}级</el-descriptions-item>
                <el-descriptions-item label="信用等级">
                  <el-tag :type="getCreditLevelType(userInfo.creditScore)">
                    {{ getCreditLevel(userInfo.creditScore) }} ({{ userInfo.creditScore }}分)
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="注册时间">2021-09-01</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>
        </el-row>

        <el-divider>📍 收货地址管理</el-divider>
        <div class="address-section">
          <el-descriptions :column="1" border v-if="defaultAddress">
            <el-descriptions-item label="默认地址">
              <div style="display: flex; align-items: center; justify-content: space-between">
                <span>
                  {{ defaultAddress.receiverName }}
                  {{ defaultAddress.phone }}
                  {{ defaultAddress.campus }}
                  {{ defaultAddress.building }}
                  {{ defaultAddress.room }}
                </span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-alert v-else title="未设置默认地址" type="warning" :closable="false" style="margin-bottom: 15px;" />
          <el-button type="primary" @click="openAddressDialog" style="margin-top: 15px;">
            修改收货地址
          </el-button>
        </div>

        <el-divider>📊 我的统计</el-divider>
        <div class="stats-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-statistic title="在售图书" :value="stats.selling" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="已售图书" :value="stats.sold" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="信用积分" :value="userInfo.creditScore" />
            </el-col>
          </el-row>
        </div>

        <el-divider>📚 最近发布的图书</el-divider>
        <div class="recent-books" v-loading="loadingBooks">
          <el-empty v-if="!recentBooks.length" description="暂无发布的图书">
            <el-button type="primary" @click="$router.push('/publish')">去发布图书</el-button>
          </el-empty>
          <div class="book-grid" v-else>
            <BookCard v-for="book in recentBooks" :key="book.bookId" :book="book" />
          </div>
        </div>
      </div>

      <!-- 地址编辑对话框 -->
      <el-dialog
          v-model="showAddressDialog"
          title="编辑收货地址"
          width="500px"
          @close="resetAddressForm"
      >
        <el-form
            :model="addressForm"
            :rules="addressRules"
            ref="addressFormRef"
            label-width="80px"
        >
          <el-form-item label="收货人" prop="receiverName">
            <el-input v-model="addressForm.receiverName" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="addressForm.phone" placeholder="11位手机号" />
          </el-form-item>
          <el-form-item label="校区" prop="campus">
            <el-select v-model="addressForm.campus" placeholder="请选择校区" style="width: 100%">
              <el-option label="主校区" value="主校区" />
              <el-option label="南校区" value="南校区" />
              <el-option label="北校区" value="北校区" />
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋" prop="building">
            <el-input v-model="addressForm.building" placeholder="如：3号楼" />
          </el-form-item>
          <el-form-item label="房间号" prop="room">
            <el-input v-model="addressForm.room" placeholder="如：501室" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddressDialog = false">取消</el-button>
          <el-button type="primary" @click="saveAddress" :loading="savingAddress">
            保存
          </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import BookCard from '../components/BookCard.vue'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'
import { bookApi } from '../api/book'

const userInfo = ref(null)
const recentBooks = ref([])
const loading = ref(true)
const loadingBooks = ref(true)
const showAddressDialog = ref(false)
const savingAddress = ref(false)
const addressFormRef = ref()

// 地址表单
const addressForm = ref({
  receiverName: '',
  phone: '',
  campus: '',
  building: '',
  room: ''
})

// 地址验证规则
const addressRules = {
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  campus: [{ required: true, message: '请选择校区', trigger: 'change' }],
  building: [{ required: true, message: '请输入楼栋', trigger: 'blur' }],
  room: [{ required: true, message: '请输入房间号', trigger: 'blur' }]
}

// 默认地址
const defaultAddress = computed(() => userInfo.value?.defaultAddress || null)

// 统计信息
const stats = computed(() => {
  return {
    selling: recentBooks.value.filter(b => b.status === '在售').length,
    sold: recentBooks.value.filter(b => b.status === '已售出').length
  }
})

const getCreditLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 70) return '良好'
  return '一般'
}

const getCreditLevelType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await authApi.getCurrentUser()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

// 加载我的图书
const loadMyBooks = async () => {
  try {
    const res = await bookApi.getMyBooks()
    if (res.code === 200) {
      recentBooks.value = res.data.slice(0, 6)
    }
  } catch (error) {
    ElMessage.error('加载图书列表失败')
  } finally {
    loadingBooks.value = false
  }
}

// 打开地址对话框
const openAddressDialog = () => {
  showAddressDialog.value = true
  nextTick(() => {
    if (defaultAddress.value) {
      addressForm.value = { ...defaultAddress.value }
    }
  })
}

// 保存地址
const saveAddress = async () => {
  await addressFormRef.value.validate(async (valid) => {
    if (!valid) return

    savingAddress.value = true
    try {
      const res = await userApi.updateDefaultAddress(addressForm.value)
      if (res.code === 200) {
        if (userInfo.value) {
          userInfo.value.defaultAddress = res.data
        }
        showAddressDialog.value = false
        ElMessage.success('地址保存成功')
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      ElMessage.error(error.message || '保存失败')
    } finally {
      savingAddress.value = false
    }
  })
}

// 重置表单
const resetAddressForm = () => {
  if (addressFormRef.value) {
    addressFormRef.value.resetFields()
  }
  if (defaultAddress.value) {
    addressForm.value = { ...defaultAddress.value }
  }
}

onMounted(() => {
  loadUserInfo()
  loadMyBooks()
})
</script>

<style scoped>
.personal-center-container {
  max-width: 1200px;
  margin: 0 auto;
}

.avatar-section {
  text-align: center;
  padding: 20px;
}

.avatar-section h3 {
  margin: 10px 0 5px 0;
}

.avatar-section p {
  margin: 0;
  color: #909399;
}

.info-section {
  padding: 20px;
}

.address-section {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stats-section {
  padding: 20px 0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>