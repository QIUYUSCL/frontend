<template>
  <div class="credit-container">
    <!-- 信用概览 -->
    <el-card class="credit-overview">
      <div class="score-display">
        <el-progress
            type="dashboard"
            :percentage="creditScore"
            :color="scoreColor"
            :width="200"
        >
          <template #default>
            <div class="score-text">
              <div class="score-value">{{ creditScore }}</div>
              <div class="score-level">{{ creditLevel }}</div>
            </div>
          </template>
        </el-progress>
        <div class="score-info">
          <h2>信用等级: {{ creditLevel }}</h2>
          <p>{{ creditDescription }}</p>
          <el-button type="primary" @click="loadCreditInfo">刷新积分</el-button>
        </div>
      </div>
    </el-card>

    <!-- 积分明细 -->
    <el-card class="credit-records">
      <template #header>
        <h3>📊 积分明细</h3>
      </template>

      <div v-loading="loading">
        <el-timeline>
          <el-timeline-item
              v-for="record in creditRecords"
              :key="record.id"
              :timestamp="formatDate(record.createTime)"
              :type="record.score > 0 ? 'success' : 'danger'"
              :icon="record.score > 0 ? Plus : Minus"
          >
            <el-card shadow="hover">
              <div class="record-content">
                <div>
                  <span class="record-reason">{{ record.reason }}</span>
                  <el-tag size="small" :type="record.score > 0 ? 'success' : 'danger'">
                    {{ record.score > 0 ? '获得' : '扣除' }}
                  </el-tag>
                </div>
                <span class="record-score" :class="{ 'positive': record.score > 0, 'negative': record.score < 0 }">
                  {{ record.score > 0 ? '+' : '' }}{{ record.score }}
                </span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-empty v-if="!creditRecords.length" description="暂无积分记录" />
      </div>
    </el-card>

    <!-- 积分规则 -->
    <el-card class="credit-rules">
      <template #header>
        <h3>📋 积分规则说明</h3>
      </template>

      <el-collapse>
        <el-collapse-item title="如何获得积分" name="1">
          <ul>
            <li>✅ 成功完成交易: +5分</li>
            <li>✅ 发布优质图书: +2分</li>
            <li>✅ 实名认证: +10分</li>
            <li>✅ 每日签到: +1分</li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="什么情况下会扣分" name="2">
          <ul>
            <li>❌ 订单超时未处理: -3分</li>
            <li>❌ 恶意发布虚假信息: -10分</li>
            <li>❌ 交易纠纷败诉: -5分</li>
            <li>❌ 取消已支付订单: -2分</li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="信用等级说明" name="3">
          <el-table :data="levelRules" style="width: 100%" border>
            <el-table-column prop="level" label="等级" />
            <el-table-column prop="minScore" label="最低分数" />
            <el-table-column prop="privilege" label="享有特权" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Minus } from '@element-plus/icons-vue'
import { creditApi } from '../api/credit'

const creditScore = ref(0)
const creditRecords = ref([])
const loading = ref(false)

const creditLevel = computed(() => {
  if (creditScore.value >= 90) return '优秀'
  if (creditScore.value >= 70) return '良好'
  if (creditScore.value >= 50) return '一般'
  return '较差'
})

const scoreColor = computed(() => {
  if (creditScore.value >= 90) return '#67c23a'
  if (creditScore.value >= 70) return '#409eff'
  if (creditScore.value >= 50) return '#e6a23c'
  return '#f56c6c'
})

const creditDescription = computed(() => {
  if (creditScore.value >= 90) return '您的信用极佳，享有最高交易权限'
  if (creditScore.value >= 70) return '您的信用良好，可以正常交易'
  if (creditScore.value >= 50) return '您的信用一般，请保持良好记录'
  return '您的信用较低，部分功能可能受限'
})

const levelRules = [
  { level: '优秀', minScore: 90, privilege: '交易手续费减免、优先推荐' },
  { level: '良好', minScore: 70, privilege: '正常交易权限' },
  { level: '一般', minScore: 50, privilege: '限制每日发布数量' },
  { level: '较差', minScore: 0, privilege: '限制部分功能使用' }
]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

const loadCreditInfo = async () => {
  loading.value = true
  try {
    const userId = localStorage.getItem('userId')
    console.log('当前用户ID:', userId) // 调试日志
    const res = await creditApi.getCreditInfo(userId)
    console.log('信用信息响应:', res) // 调试日志


    if (res.code === 200) {
      creditScore.value = res.data.score
      creditRecords.value = res.data.records.sort((a, b) =>
          new Date(b.createTime) - new Date(a.createTime)
      )
    }
  } catch (error) {
    ElMessage.error('加载信用信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCreditInfo()
})
</script>

<style scoped>
.credit-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.credit-overview {
  padding: 40px;
}

.score-display {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.score-text {
  text-align: center;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  color: #303133;
}

.score-level {
  font-size: 16px;
  color: #909399;
}

.score-info h2 {
  margin: 10px 0;
}

.score-info p {
  margin: 10px 0 20px 0;
  color: #606266;
}

.credit-records {
  padding: 20px;
}

.record-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-reason {
  margin-right: 10px;
  font-weight: 500;
}

.record-score {
  font-size: 18px;
  font-weight: bold;
}

.record-score.positive {
  color: #67c23a;
}

.record-score.negative {
  color: #f56c6c;
}

.credit-rules ul {
  margin: 10px 0;
  padding-left: 20px;
}

.credit-rules li {
  margin-bottom: 8px;
  color: #606266;
}
</style>