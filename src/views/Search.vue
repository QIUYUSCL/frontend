<template>
  <div class="search-container">
    <el-card class="search-card">
      <template #header>
        <div class="search-header">
          <h2>🔍 搜索结果</h2>
          <el-input
              v-model="searchKeyword"
              placeholder="输入关键词搜索图书"
              style="width: 400px;"
              @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </template>

      <div class="search-filters">
        <el-form :inline="true" class="filters-form">
          <el-form-item label="品相">
            <el-select v-model="filters.condition" clearable style="width: 120px;">
              <el-option label="全新" value="全新" />
              <el-option label="九成新" value="九成新" />
              <el-option label="八成新" value="八成新" />
              <el-option label="七成新" value="七成新" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-input-number
                v-model="filters.minPrice"
                placeholder="最低价"
                :min="0"
                style="width: 100px;"
            />
            <span style="margin: 0 10px;">-</span>
            <el-input-number
                v-model="filters.maxPrice"
                placeholder="最高价"
                :min="0"
                style="width: 100px;"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="applyFilters">筛选</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="search-results" v-loading="loading">
        <div v-if="total === 0 && !loading" class="empty-results">
          <el-empty description="未找到相关图书">
            <el-button type="primary" @click="$router.push('/publish')">
              去发布图书
            </el-button>
          </el-empty>
        </div>

        <div v-else>
          <div class="results-info">
            共找到 <strong>{{ total }}</strong> 本图书
          </div>
          <div class="book-grid">
            <BookCard
                v-for="book in searchResults"
                :key="book.bookId"
                :book="book"
            />
          </div>

          <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[12, 24, 48]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import BookCard from '../components/BookCard.vue'
import { bookApi } from '../api/book'

const route = useRoute()
const router = useRouter()

const searchKeyword = ref('')
const searchResults = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)

const filters = ref({
  condition: '',
  minPrice: undefined,
  maxPrice: undefined
})

// 从URL参数初始化搜索关键词
onMounted(() => {
  const keyword = route.query.keyword
  if (keyword) {
    searchKeyword.value = decodeURIComponent(keyword)
    handleSearch()
  }
})

// 搜索处理
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      page: currentPage.value,
      size: pageSize.value,
      ...filters.value
    }

    const res = await bookApi.searchBooks(params)
    if (res.code === 200) {
      searchResults.value = res.data.list || res.data
      total.value = res.data.total || res.data.length || 0
    }
  } catch (error) {
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 筛选处理
const applyFilters = () => {
  currentPage.value = 1
  handleSearch()
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    condition: '',
    minPrice: undefined,
    maxPrice: undefined
  }
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 监听路由参数变化
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword) {
    searchKeyword.value = decodeURIComponent(newKeyword)
    handleSearch()
  }
})
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-header h2 {
  margin: 0;
}

.search-filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filters-form {
  display: flex;
  align-items: center;
}

.search-results {
  min-height: 400px;
}

.empty-results {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.results-info {
  margin-bottom: 20px;
  color: #606266;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>