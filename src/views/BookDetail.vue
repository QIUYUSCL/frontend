<template>
  <div class="book-detail-container" v-if="book">
    <el-card class="detail-card">
      <!-- 图书基本信息 -->
      <div class="book-basic-info">
        <el-row :gutter="20">
          <el-col :span="8">
            <img
                :src="book.cover ? `/static/covers/${book.cover}` : ''"
                class="book-cover-large"
                alt="图书封面"
                />
          </el-col>
          <el-col :span="16">
            <h1 class="book-title">{{ book.title }}</h1>
            <div class="book-meta">
              <p><strong>作者：</strong>{{ book.author }}</p>
              <p><strong>出版社：</strong>{{ book.publisher }}</p>
              <p><strong>ISBN：</strong>{{ book.isbn }}</p>
              <p><strong>品相：</strong>{{ book.condition }}</p>
              <p><strong>售价：</strong><span class="price-tag">¥{{ book.price }}</span></p>
              <p><strong>原价：</strong><span class="original-price">¥{{ book.originalPrice }}</span></p>
              <p><strong>卖家：</strong>{{ sellerInfo.realName || '匿名用户' }}</p>
              <p><strong>信用分：</strong><el-tag :type="getCreditScoreType(sellerInfo.creditScore)">{{ sellerInfo.creditScore }}</el-tag></p>
              <p><strong>发布于：</strong>{{ formatDate(book.createTime) }}</p>
            </div>
            <div class="action-buttons">
              <el-button v-if="!isOwnBook" type="primary" size="large" :icon="ShoppingCart" @click="handleBuy" :disabled="book.status !== '在售'" >
                {{ book.status === '在售' ? '立即购买' : '已售出' }}
              </el-button>
              <el-button v-if="!isOwnBook" type="default" size="large" :icon="Star" @click="handleFavorite" > 收藏 </el-button>
              <template v-if="isOwnBook">
                <el-button type="warning" size="large" @click="handleEdit"> 编辑 </el-button>
                <el-button type="danger" size="large" @click="handleDelete"> 下架 </el-button>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 图书描述 -->
      <el-descriptions title="📖 图书描述" :column="1" border style="margin-top: 30px;">
        <el-descriptions-item>{{ book.description || '暂无描述' }}</el-descriptions-item>
      </el-descriptions>
      <!-- 相关推荐 -->
      <div class="related-recommendation" v-if="!isOwnBook">
        <h3>🎯 相关推荐</h3>
        <div class="book-grid">
          <BookCard v-for="relatedBook in relatedBooks" :key="relatedBook.bookId" :book="relatedBook" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Star } from '@element-plus/icons-vue'
import BookCard from '../components/BookCard.vue'
import { bookApi } from '../api/book'
import { recommendationApi } from '../api/recommendation'


const route = useRoute()
const router = useRouter()

const book = ref(null)
const sellerInfo = ref({})
const relatedBooks = ref([])
const loading = ref(false)

// 判断是否为自己的图书
const currentUserId = localStorage.getItem('userId')
const isOwnBook = computed(() => {
  return book.value && book.value.sellerId && String(book.value.sellerId) === String(currentUserId)
})

// 加载图书详情
const loadBookDetail = async () => {
  const bookId = route.params.id
  if (!bookId) {
    ElMessage.error('图书ID不存在')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const res = await bookApi.getBookDetail(bookId)
    if (res.code === 200) {
      book.value = res.data

      console.log('book.cover 的值:', book.value.cover)

      // 加载卖家信息（简化处理）
      sellerInfo.value = { realName: '测试卖家', creditScore: 95 }

      // 加载相关推荐
      loadRelatedBooks(bookId)
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    ElMessage.error('加载图书详情失败')
    router.push('/')
  } finally {
    loading.value = false
  }
}

// 加载相关推荐
const loadRelatedBooks = async (bookId) => {
  try {
    const res = await recommendationApi.getRelatedRecommendation(bookId, 6)
    if (res.code === 200) {
      relatedBooks.value = res.data
    }
  } catch (error) {
    console.error('加载相关推荐失败:', error)
  }
}

// 购买处理
const handleBuy = async () => {
  try {
    await ElMessageBox.confirm(
        `确认购买《${book.value.title}》？价格：¥${book.value.price}`,
        '购买确认',
        {
          confirmButtonText: '确认购买',
          cancelButtonText: '取消',
          type: 'info'
        }
    )

    // 使用统一的API调用方式
    const res = await bookApi.purchaseBook({
      bookId: book.value.bookId,
      buyerId: currentUserId
    })

    if (res.code === 200) {
      ElMessage.success('下单成功！请查看订单详情')
      router.push('/orders')
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '购买失败')
    }
  }
}

// 删除处理 - 修改为使用bookApi
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

    // 使用封装的API方法
    const res = await bookApi.deleteBook(book.value.bookId)

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

// 收藏处理
const handleFavorite = async () => {
  try {
    // 调用收藏API（简化）
    ElMessage.success('收藏成功！')
  } catch (error) {
    ElMessage.error('收藏失败')
  }
}

// 编辑处理
const handleEdit = () => {
  router.push(`/book/edit/${book.value.bookId}`)
}



// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 信用分样式
const getCreditScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

onMounted(() => {
  loadBookDetail()
})
</script>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}
.book-basic-info {
  margin-bottom: 30px;
}
.book-cover-large {
  width: 100%;
  max-width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.book-title {
  font-size: 28px;
  margin: 0 0 20px 0;
  color: #303133;
}
.book-meta p {
  margin: 10px 0;
  font-size: 16px;
}
.price-tag {
  font-size: 32px;
  color: #f56c6c;
  font-weight: bold;
}
.original-price {
  text-decoration: line-through;
  color: #909399;
}
.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}
.related-recommendation {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}
.related-recommendation h3 {
  margin-bottom: 20px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>