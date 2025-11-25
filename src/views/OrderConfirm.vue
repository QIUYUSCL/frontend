<template>
  <div class="order-confirm-container">
    <el-card class="confirm-card">
      <template #header>
        <h2>🛒 确认订单</h2>
      </template>

      <div class="order-content" v-if="book">
        <!-- 图书信息 -->
        <el-card class="book-info-card" shadow="never">
          <el-row :gutter="20">
            <el-col :span="6">
              <img :src="book.cover ? book.cover.replace('public/', '/') : ''" class="book-cover" alt="图书封面" />
            </el-col>
            <el-col :span="18">
              <h3>{{ book.title }}</h3>
              <p class="book-author">作者：{{ book.author }}</p>
              <p class="book-publisher">出版社：{{ book.publisher }}</p>
              <p class="book-condition">
                品相：<el-tag>{{ book.condition }}</el-tag>
              </p>
              <p class="book-price">售价：¥{{ book.price }}</p>
              <p class="seller-info">
                卖家：{{ sellerInfo.realName }}（信用分：{{ sellerInfo.creditScore }}）
              </p>
            </el-col>
          </el-row>
        </el-card>

        <!-- 收货地址确认 -->
        <el-divider>📍 确认收货地址</el-divider>
        <div class="address-section">
          <div class="address-confirm" v-if="defaultAddress">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="收货人">{{ defaultAddress.receiverName }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ defaultAddress.phone }}</el-descriptions-item>
              <el-descriptions-item label="收货地址">
                {{ defaultAddress.campus }} {{ defaultAddress.building }} {{ defaultAddress.room }}
              </el-descriptions-item>
            </el-descriptions>
            <div style="margin-top: 15px;">
              <el-button link type="primary" @click="$router.push('/personal')">
                修改收货地址
              </el-button>
            </div>
          </div>
          <div class="address-warning" v-else>
            <el-alert
                title="请先设置收货地址，否则无法完成支付"
                type="warning"
                show-icon
                :closable="false"
            >
              <template #default>
                <el-button
                    type="primary"
                    size="small"
                    @click="$router.push('/personal')"
                    style="margin-left: 20px;"
                >
                  去设置
                </el-button>
              </template>
            </el-alert>
          </div>
        </div>

        <el-divider>💳 选择支付方式</el-divider>

        <!-- 支付方式选择 -->
        <div class="payment-methods">
          <el-radio-group v-model="selectedPaymentMethod" size="large">
            <el-radio label="wechat" border>
              <div class="payment-option">
                <el-icon :size="24" color="#07c160"><ChatDotRound /></el-icon>
                <span>微信支付</span>
              </div>
            </el-radio>
            <el-radio label="alipay" border>
              <div class="payment-option">
                <el-icon :size="24" color="#1677ff"><Wallet /></el-icon>
                <span>支付宝</span>
              </div>
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 价格明细 -->
        <div class="price-breakdown">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="图书价格">¥{{ book.price }}</el-descriptions-item>
            <el-descriptions-item label="平台服务费">¥0.00</el-descriptions-item>
            <el-descriptions-item label="运费">¥0.00</el-descriptions-item>
            <el-descriptions-item label="实付款">
              <span class="total-price">¥{{ book.price }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 确认支付按钮 -->
        <div class="confirm-action">
          <el-button
              type="primary"
              size="large"
              style="width: 200px;"
              @click="handleConfirmPayment"
              :loading="confirming"
              :disabled="!defaultAddress"
          >
            确认支付
          </el-button>
          <el-button size="large" @click="$router.back()">返回</el-button>
        </div>
      </div>
    </el-card>


    <!-- 二维码弹窗 -->
    <el-dialog
        v-model="qrDialogVisible"
        title="请扫码支付"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        center
    >
      <div class="qr-container" v-loading="paying">
        <!-- 本地生成二维码 -->
        <qrcode-vue
            :value="paymentQrData"
            :size="250"
            class="qr-code"
        />
        <p class="qr-tip">请使用{{ paymentMethodName }}扫码支付</p>
        <p class="qr-amount">金额：¥{{ book?.price }}</p>

        <el-alert title="支付后点击下方按钮完成" type="info" :closable="false" center />
      </div>

      <template #footer>
        <el-button @click="cancelPayment">取消支付</el-button>
        <el-button type="success" @click="simulatePaymentSuccess">支付成功</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatDotRound, Wallet } from '@element-plus/icons-vue'
import QrcodeVue from 'qrcode.vue' // 引入二维码组件
import { bookApi } from '../api/book'
import { orderApi } from '../api/order'
import { userApi } from '../api/user'
import { mockData } from '../mock/data'

const route = useRoute()
const router = useRouter()

// 状态管理
const book = ref(null)
const sellerInfo = ref({})
const defaultAddress = ref(null)
const selectedPaymentMethod = ref('wechat')
const qrDialogVisible = ref(false)
const confirming = ref(false)
const paying = ref(false)
const currentOrderId = ref(null) // 存储当前订单ID

// 生成二维码内容（包含订单关键信息）
const paymentQrData = computed(() => {
  if (!currentOrderId.value) return ''
  return JSON.stringify({
    orderId: currentOrderId.value,
    amount: book.value?.price,
    method: selectedPaymentMethod.value,
    timestamp: new Date().getTime()
  })
})

// 支付方式名称
const paymentMethodName = computed(() => {
  return selectedPaymentMethod.value === 'wechat' ? '微信' : '支付宝'
})

// 加载图书信息
const loadBookInfo = async () => {
  const bookId = route.params.bookId
  if (!bookId) {
    ElMessage.error('图书ID不存在')
    router.push('/')
    return
  }

  try {
    const res = await bookApi.getBookDetail(bookId)
    if (res.code === 200) {
      book.value = res.data

      // 获取卖家信息
      const sellerUser = mockData.users.find(u => u.userId === book.value.sellerId)
      if (sellerUser) {
        sellerInfo.value = {
          realName: sellerUser.realName,
          creditScore: sellerUser.creditScore
        }
      }

      // 加载收货地址
      await loadUserAddress()
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    ElMessage.error('加载图书信息失败')
    router.push('/')
  }
}

// 加载用户默认地址
const loadUserAddress = async () => {
  try {
    const res = await userApi.getAddresses()
    if (res.code === 200 && res.data.length > 0) {
      // 优先选择默认地址
      defaultAddress.value = res.data.find(addr => addr.isDefault) || res.data[0]
    }
  } catch (error) {
    console.error('加载地址失败:', error)
    ElMessage.error('加载收货地址失败')
  }
}

// 确认支付
const handleConfirmPayment = async () => {
  if (!defaultAddress.value) {
    ElMessage.warning('请先设置收货地址')
    return
  }

  confirming.value = true

  try {
    // 创建订单
    const res = await orderApi.createOrder({
      bookId: book.value.bookId,
      buyerId: localStorage.getItem('userId'),
      paymentMethod: selectedPaymentMethod.value,
      shippingAddress: defaultAddress.value
    })

    if (res.code === 200) {
      currentOrderId.value = res.data.orderId // 保存订单ID用于生成二维码
      qrDialogVisible.value = true
      confirming.value = false
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    ElMessage.error(error.message || '创建订单失败')
    confirming.value = false
  }
}

// 模拟支付成功
const simulatePaymentSuccess = async () => {
  if (!currentOrderId.value) return

  paying.value = true

  // 模拟支付处理时间
  setTimeout(async () => {
    try {
      // 更新订单状态为已支付
      const res = await orderApi.payOrder(currentOrderId.value)

      if (res.code === 200) {
        ElMessage.success('支付成功！')
        qrDialogVisible.value = false
        paying.value = false
        router.push('/my-orders')
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      ElMessage.error('支付失败：' + (error.message || '未知错误'))
      paying.value = false
    }
  }, 1500)
}

// 取消支付
const cancelPayment = () => {
  ElMessageBox.confirm('确认取消支付吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    qrDialogVisible.value = false
    ElMessage.info('支付已取消')
  }).catch(() => {})
}

// 页面挂载时加载数据
onMounted(() => {
  loadBookInfo()
})
</script>

<style scoped>
.order-confirm-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.book-info-card {
  margin-bottom: 30px;
  background-color: #f5f7fa;
}

.book-cover {
  width: 100%;
  max-width: 180px;
  height: 240px;
  object-fit: cover;
  border-radius: 4px;
}

.book-author, .book-publisher, .book-condition, .book-price, .seller-info {
  margin: 10px 0;
  color: #606266;
}

.book-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.address-section {
  margin: 25px 0;
}

.address-confirm {
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #d1e9ff;
}

.address-warning {
  padding: 20px;
  background-color: #fff9f0;
  border-radius: 4px;
  border: 1px solid #ffdc9c;
}

.payment-methods {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

.price-breakdown {
  margin: 30px auto;
  max-width: 500px;
}

.total-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.confirm-action {
  text-align: center;
  margin-top: 40px;
}

.qr-container {
  text-align: center;
  padding: 20px;
}

.qr-code {
  width: 250px;
  height: 250px;
  margin: 20px auto;
  display: block;
}

.qr-tip {
  font-size: 16px;
  color: #303133;
  margin: 10px 0;
}

.qr-amount {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}
</style>