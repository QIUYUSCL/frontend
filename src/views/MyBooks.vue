<template>
  <div class="my-books-container">
    <el-card>
      <template #header>
        <div class="header">
          <h2>📚 我的书架</h2>
          <el-radio-group v-model="bookType" @change="handleTypeChange">
            <el-radio-button label="favorite">收藏的图书</el-radio-button>
            <el-radio-button label="selling">在售图书</el-radio-button>
            <el-radio-button label="sold">已售图书</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div v-loading="loading">
        <el-empty v-if="!books.length" :description="emptyText">
          <el-button
              v-if="bookType === 'favorite'"
              type="primary"
              @click="$router.push('/')"
          >
            去收藏图书
          </el-button>
          <el-button
              v-else
              type="primary"
              @click="$router.push('/publish')"
          >
            去发布图书
          </el-button>
        </el-empty>

        <div v-else class="book-grid">
          <BookCard
              v-for="book in books"
              :key="book.bookId"
              :book="book"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BookCard from '../components/BookCard.vue'
import { bookApi } from '../api/book'

const books = ref([])
const loading = ref(false)
const bookType = ref('favorite')

const emptyText = computed(() => {
  const texts = {
    favorite: '暂无收藏的图书',
    selling: '暂无在售图书',
    sold: '暂无已售图书'
  }
  return texts[bookType.value]
})

const loadBooks = async () => {
  loading.value = true
  try {
    let res

    if (bookType.value === 'favorite') {
      res = await bookApi.getFavoriteBooks()
    } else {
      const status = bookType.value === 'selling' ? '在售' : '已售出'
      res = await bookApi.getMyBooksByStatus(status)
    }

    if (res.code === 200) {
      books.value = res.data.map(item => {
        if (bookType.value === 'favorite') {
          return item.book
        }
        return item
      })
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleTypeChange = () => {
  loadBooks()
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.my-books-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>