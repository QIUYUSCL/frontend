<template>
  <div class="home-container">
    <!-- 推荐区域 -->
    <section class="recommendation-section">
      <div class="section-header">
        <h2>🎯 为您推荐</h2>
        <el-link type="primary" :underline="false">查看更多 →</el-link>
      </div>
      <div class="book-grid" v-loading="loading">
        <BookCard
            v-for="book in recommendations"
            :key="book.bookId"
            :book="book"
        />
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="popular-section">
      <div class="section-header">
        <h2>🔥 热门图书</h2>
        <el-link type="primary" :underline="false">查看更多 →</el-link>
      </div>
      <div class="book-grid">
        <BookCard
            v-for="book in popularBooks"
            :key="book.bookId"
            :book="book"
        />
      </div>
    </section>

    <!-- 知识图谱入口 -->
    <section class="kg-entrance">
      <el-card class="kg-card">
        <div class="kg-content">
          <div>
            <h3>📊 探索学科知识地图</h3>
            <p>基于知识图谱的智能推荐，发现专业课程关联</p>
          </div>
          <el-button type="primary" @click="$router.push('/knowledge-map')">
            立即探索
          </el-button>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'
import { recommendationApi } from '../api/recommendation';

const recommendations = ref([])
const popularBooks = ref([])
const loading = ref(false)

const loadRecommendations = async () => {
  loading.value = true;
  try {
    const userId = localStorage.getItem('userId') || 1;
    const res = await recommendationApi.getPersonalRecommendation(userId, 8);
    recommendations.value = res.data.map(book => ({
      ...book,
      reasons: book.reasons || ['基于您的专业推荐']
    }));
  } catch (error) {
    console.error('加载推荐失败:', error);
  } finally {
    loading.value = false;
  }
};

const loadPopularBooks = async () => {
  try {
    const res = await recommendationApi.getPopularRecommendation('软件工程', 8)
    popularBooks.value = res.data
  } catch (error) {
    console.error('加载热门图书失败:', error)
  }
}

onMounted(() => {
  loadRecommendations()
  loadPopularBooks()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 24px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.kg-entrance {
  margin-top: 40px;
}

.kg-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kg-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kg-content h3 {
  margin: 0 0 10px 0;
}

.kg-content p {
  margin: 0;
  opacity: 0.9;
}
</style>