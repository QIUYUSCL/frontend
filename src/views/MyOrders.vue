<template>
  <div class="orders-container">
    <el-card>
      <template #header>
        <div class="order-header">
          <h2>📋 我的订单</h2>
          <el-radio-group v-model="statusFilter" @change="handleStatusChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="待支付">待支付</el-radio-button>
            <el-radio-button label="已发货">已发货</el-radio-button>
            <el-radio-button label="已完成">已完成</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div v-loading="loading">
        <el-empty v-if="!orders.length" description="暂无订单记录" />

        <div v-else class="order-list">
          <el-card v-for="order in orders" :key="order.orderId" class="order-item" shadow="hover">
            <div class="order-header-info">
              <div>
                <span class="order-id">订单号: {{ order.orderId }}</span>
                <el-tag :type="getStatusType(order.status)" size="small" style="margin-left: 10px;">
                  {{ order.status }}
                </el-tag>
              </div>
              <span class="order-date">{{ formatDate(order.createTime) }}</span>
            </div>

            <el-divider style="margin: 15px 0;" />

            <div class="order-content">
              <img :src="order.bookCover ? order.bookCover.replace('public/', '/') : ''" class="book-cover-mini" />
              <div class="order-details">
                <h4>{{ order.bookTitle }}</h4>
                <p>价格: ¥{{ order.price }}</p>
                <p v-if="order.finishTime">完成时间: {{ formatDate(order.finishTime) }}</p>
              </div>
              <div class="order-actions">
                <el-button
                    v-if="order.status === '待支付'"
                    type="primary"
                    size="small"
                    @click="handlePay(order)"
                >
                  立即支付
                </el-button>
                <el-button
                    v-if="order.status === '待支付'"
                    type="default"
                    size="small"
                    @click="handleCancel(order)"
                >
                  取消订单
                </el-button>
                <el-button
                    v-if="order.status === '已发货'"
                    type="success"
                    size="small"
                    @click="handleConfirm(order)"
                >
                  确认收货
                </el-button>
                <el-link
                    v-if="order.status === '已完成'"
                    type="primary"
                    :underline="false"
                >
                  查看详情
                </el-link>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '../api/order'

const orders = ref([])
const loading = ref(false)
const statusFilter = ref('')

const getStatusType = (status) => {
  const types = {
    '待支付': 'danger',
    '已发货': 'warning',
    '已完成': 'success'
  }
  return types[status] || 'info'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await orderApi.getMyOrders(statusFilter.value)
    if (res.code === 200) {
      orders.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  loadOrders()
}

const handlePay = async (order) => {
  try {
    await ElMessageBox.confirm(`确认支付 ¥${order.price} 吗？`, '支付确认')
    const res = await orderApi.payOrder(order.orderId)
    if (res.code === 200) {
      ElMessage.success('支付成功！')
      loadOrders()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('支付失败')
    }
  }
}

const handleCancel = async (order) => {
  try {
    await ElMessageBox.confirm('确认取消该订单吗？', '取消确认')
    const res = await orderApi.cancelOrder(order.orderId)
    if (res.code === 200) {
      ElMessage.success('取消成功！')
      loadOrders()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败')
    }
  }
}

const handleConfirm = async (order) => {
  try {
    await ElMessageBox.confirm('确认已收到图书吗？', '确认收货')
    // 模拟确认收货
    ElMessage.success('确认成功！')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  padding: 15px;
}

.order-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-weight: bold;
  color: #303133;
}

.order-date {
  color: #909399;
  font-size: 14px;
}

.order-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.book-cover-mini {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.order-details {
  flex: 1;
}

.order-details h4 {
  margin: 0 0 10px 0;
}

.order-details p {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>