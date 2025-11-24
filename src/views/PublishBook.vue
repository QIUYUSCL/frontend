<template>
  <div class="publish-container">
    <el-card class="publish-card">
      <template #header>
        <h2>📤 发布二手图书</h2>
      </template>

      <el-form
          :model="bookForm"
          :rules="rules"
          ref="bookFormRef"
          label-width="100px"
          class="publish-form"
      >
        <el-form-item label="ISBN" prop="isbn">
          <el-input
              v-model="bookForm.isbn"
              placeholder="扫描或输入ISBN码"
              @blur="onISBNBlur"
          >
            <template #append>
              <el-button :icon="Camera" @click="scanISBN">扫码</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="书名" prop="title">
          <el-input v-model="bookForm.title" placeholder="请输入书名" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author" placeholder="请输入作者" />
        </el-form-item>

        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="bookForm.publisher" placeholder="请输入出版社" />
        </el-form-item>

        <el-form-item label="图书照片" prop="images">
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

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting" size="large">
            发布图书
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, Plus } from '@element-plus/icons-vue'
import { bookApi } from '../api/book'

const bookFormRef = ref()
const submitting = ref(false)
const priceLoading = ref(false)
const fileList = ref([])
const priceSuggestion = ref(null)

const bookForm = reactive({
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
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' },
    { pattern: /^(\d{10}|\d{13})$/, message: 'ISBN格式不正确', trigger: 'blur' }
  ],
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  condition: [{ required: true, message: '请选择品相', trigger: 'change' }],
  price: [{ required: true, message: '请设置价格', trigger: 'blur' }]
}

// ISBN失焦自动填充图书信息
const onISBNBlur = async () => {
  if (!bookForm.isbn || bookForm.title) return

  try {
    const res = await bookApi.fetchBookInfo(bookForm.isbn)
    if (res.code === 200 && res.data) {
      bookForm.title = res.data.title || ''
      bookForm.author = res.data.author || ''
      bookForm.publisher = res.data.publisher || ''
      ElMessage.success('图书信息自动填充成功')
    }
  } catch (error) {
    ElMessage.warning('未找到该ISBN对应的图书信息，请手动填写')
  }
}

// 扫码功能（模拟）
const scanISBN = () => {
  ElMessage.info('请调用摄像头扫描ISBN码（此处为演示，自动填充示例数据）')
  bookForm.isbn = '9787111128069'
  onISBNBlur()
}

// 图片处理
const handleImageChange = (file) => {
  // 前端预览
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

// 获取价格建议
const getPriceSuggestion = async () => {
  if (!bookForm.isbn) {
    ElMessage.warning('请先输入ISBN')
    return
  }

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

// 提交表单
const submitForm = async () => {
  await bookFormRef.value.validate()

  submitting.value = true
  try {
    // 上传图片
    const imageUrls = []
    for (const file of fileList.value) {
      // 实际项目中这里调用OSS上传
      imageUrls.push(file.url)
    }
    bookForm.images = imageUrls

    const res = await bookApi.publishBook(bookForm)
    if (res.code === 200) {
      ElMessage.success('图书发布成功！')
      resetForm()
    }
  } catch (error) {
    ElMessage.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  bookFormRef.value.resetFields()
  fileList.value = []
  priceSuggestion.value = null
}
</script>

<style scoped>
.publish-container {
  max-width: 800px;
  margin: 0 auto;
}

.publish-card {
  margin-top: 20px;
}

.publish-form {
  max-width: 600px;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.price-suggestion {
  margin-top: 10px;
  padding: 10px;
  background-color: #f4f4f5;
  border-radius: 4px;
  color: #409eff;
  font-weight: bold;
}
</style>