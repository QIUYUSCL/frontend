<template>
  <div class="edit-container">
    <el-card class="edit-card">
      <template #header>
        <h2>✏️ 编辑图书信息</h2>
      </template>

      <div v-loading="loading">
        <el-form
            :model="bookForm"
            :rules="rules"
            ref="bookFormRef"
            label-width="100px"
            class="edit-form"
        >
          <!-- 图书信息展示（只读） -->
          <el-descriptions title="图书基本信息" :column="2" border style="margin-bottom: 20px;">
            <el-descriptions-item label="书名">{{ bookForm.title }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{ bookForm.author }}</el-descriptions-item>
            <el-descriptions-item label="出版社">{{ bookForm.publisher }}</el-descriptions-item>
            <el-descriptions-item label="ISBN">{{ bookForm.isbn }}</el-descriptions-item>
          </el-descriptions>

          <!-- 可编辑字段 -->
          <el-form-item label="品相" prop="condition">
            <el-select v-model="bookForm.condition" style="width: 200px;">
              <el-option label="全新" value="全新" />
              <el-option label="九成新" value="九成新" />
              <el-option label="八成新" value="八成新" />
              <el-option label="七成新" value="七成新" />
            </el-select>
          </el-form-item>

          <el-form-item label="售价" prop="price">
            <el-input-number
                v-model="bookForm.price"
                :min="0"
                :precision="2"
                :step="0.1"
                style="width: 200px;"
            />
            <el-button
                type="text"
                @click="getPriceSuggestion"
                :loading="priceLoading"
                style="margin-left: 10px;"
            >
              💡 获取价格建议
            </el-button>
            <div v-if="priceSuggestion" class="price-suggestion">
              建议价格区间: ¥{{ priceSuggestion.min }} - ¥{{ priceSuggestion.max }}
            </div>
          </el-form-item>

          <el-form-item label="详细描述" prop="description">
            <el-input
                v-model="bookForm.description"
                type="textarea"
                :rows="4"
                placeholder="请描述图书的使用情况、笔记情况等"
            />
          </el-form-item>

          <!-- 现有图片展示 -->
          <el-form-item label="当前图片">
            <div class="current-images">
              <img
                  v-for="(img, index) in existingImages"
                  :key="index"
                  :src="img"
                  class="image-preview"
                  alt="图书图片"
              />
            </div>
          </el-form-item>

          <!-- 更新图片 -->
          <el-form-item label="更新图片">
            <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleImageChange"
                :on-remove="handleImageRemove"
                :file-list="fileList"
                :limit="5"
                accept="image/*"
            >
              <el-icon><Plus /></el-icon>
              <template #tip>
                <div class="upload-tip">最多上传5张照片，支持jpg/png格式</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="submitting" size="large">
              保存修改
            </el-button>
            <el-button @click="$router.back()">取消</el-button>
            <el-button type="danger" @click="handleDelete">下架图书</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { bookApi } from '../api/book'

const route = useRoute()
const router = useRouter()

const bookFormRef = ref()
const loading = ref(false)
const submitting = ref(false)
const priceLoading = ref(false)
const fileList = ref([])
const existingImages = ref([])
const priceSuggestion = ref(null)

const bookForm = reactive({
  bookId: '',
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  condition: '九成新',
  price: 0,
  description: '',
  images: []
})

const rules = {
  condition: [{ required: true, message: '请选择品相', trigger: 'change' }],
  price: [{ required: true, message: '请设置价格', trigger: 'blur' }]
}

// 加载图书信息
const loadBookInfo = async () => {
  const bookId = route.params.id
  if (!bookId) {
    ElMessage.error('图书ID不存在')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const res = await bookApi.getBookDetail(bookId)
    if (res.code === 200 && res.data) {
      const book = res.data
      Object.assign(bookForm, {
        bookId: book.bookId,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        condition: book.condition,
        price: book.price,
        description: book.description
      })

      // 加载现有图片（如果有）
      existingImages.value = book.images || []
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    ElMessage.error('加载图书信息失败')
    router.push('/')
  } finally {
    loading.value = false
  }
}

// 获取价格建议
const getPriceSuggestion = async () => {
  if (!bookForm.isbn) return

  priceLoading.value = true
  try {
    const res = await bookApi.getPriceSuggestion(bookForm.isbn, bookForm.condition)
    if (res.code === 200) {
      priceSuggestion.value = res.data
      ElMessage.success('价格建议获取成功')
    }
  } catch (error) {
    ElMessage.error('获取价格建议失败')
  } finally {
    priceLoading.value = false
  }
}

// 图片处理
const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = (e) => {
    file.url = e.target.result
  }
}

const handleImageRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 提交表单
const submitForm = async () => {
  await bookFormRef.value.validate()

  submitting.value = true
  try {
    // 合并新旧图片
    const newImages = fileList.value.map(file => file.url)
    const allImages = [...existingImages.value, ...newImages]

    const updateData = {
      ...bookForm,
      images: allImages
    }

    const res = await bookApi.updateBook(updateData)
    if (res.code === 200) {
      ElMessage.success('图书信息更新成功！')
      router.push(`/book/detail/${bookForm.bookId}`)
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 删除处理
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
        '确认下架该图书？下架后不可恢复',
        '下架确认',
        {
          confirmButtonText: '确认下架',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const res = await bookApi.deleteBook(bookForm.bookId)
    if (res.code === 200) {
      ElMessage.success('下架成功！')
      router.push('/my-books')
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '下架失败')
    }
  }
}

onMounted(() => {
  loadBookInfo()
})
</script>

<style scoped>
.edit-container {
  max-width: 800px;
  margin: 0 auto;
}

.edit-form {
  max-width: 600px;
}

.current-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.image-preview {
  width: 100px;
  height: 130px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.price-suggestion {
  margin-top: 10px;
  padding: 10px;
  background-color: #f4f4f5;
  border-radius: 4px;
  color: #409eff;
  font-weight: bold;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}
</style>