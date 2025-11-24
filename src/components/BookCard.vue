<template>
  <el-card class="book-card" shadow="hover" @click="goToDetail">
    <img :src="book.cover || defaultCover" class="book-cover" />
    <div class="book-info">
      <div class="book-title">{{ book.title }}</div>
      <div class="book-author">{{ book.author }}</div>
      <div class="book-price">¥{{ book.price }}</div>
      <div class="book-meta">
        <el-tag size="small">{{ book.condition }}</el-tag>
        <span class="location">{{ book.location || '校内' }}</span>
      </div>
      <div class="book-reasons" v-if="book.reasons">
        <el-tag
            v-for="reason in book.reasons"
            :key="reason"
            size="small"
            type="info"
            effect="plain"
            class="reason-tag"
        >
          {{ reason }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const defaultCover = 'https://via.placeholder.com/200x250?text=暂无图片'

const goToDetail = () => {
  router.push(`/book/detail/${props.book.bookId || props.book.id}`)
}
</script>

<style scoped>
.book-card {
  width: 200px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.book-info {
  padding: 10px 0;
}

.book-title {
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.book-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 8px;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.location {
  font-size: 12px;
  color: #999;
}

.book-reasons {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.reason-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>