<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>🔐 用户登录</h2>
      </template>

      <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          label-width="80px"
          class="login-form"
          @keyup.enter="handleLogin"
      >
        <el-form-item label="学工号" prop="studentId">
          <el-input
              v-model="loginForm.studentId"
              placeholder="请输入学工号"
              clearable
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary" :underline="false" style="margin-left: auto;">
            忘记密码？
          </el-link>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="handleLogin"
              :loading="loading"
              style="width: 100%;"
              size="large"
          >
            登录
          </el-button>
        </el-form-item>

        <el-divider>还没有账号？</el-divider>

        <el-button
            type="default"
            @click="$router.push('/register')"
            style="width: 100%;"
            size="large"
        >
          立即注册
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import { User, Lock } from '@element-plus/icons-vue'


const router = useRouter()

const loginFormRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  studentId: '',
  password: ''
})

const loginRules = {
  studentId: [
    { required: true, message: '请输入学工号', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: '学工号应为10位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 处理登录
// 处理登录 - 修改为使用authApi
const handleLogin = async () => {
  await loginFormRef.value.validate();

  loading.value = true;
  try {
    // 使用封装的登录API
    const result = await authApi.login(loginForm)

    if (result.code === 200) {
      // 保存登录状态
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('userId', result.data.userId)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      throw new Error(result.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请检查账号密码')
  } finally {
    loading.value = false;
  }
}

// 页面加载时检查是否记住登录
onMounted(() => {
  const remembered = localStorage.getItem('rememberMe')
  if (remembered) {
    const savedStudentId = localStorage.getItem('studentId')
    if (savedStudentId) {
      loginForm.studentId = savedStudentId
      rememberMe.value = true
    }
  }
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-card h2 {
  text-align: center;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.el-divider {
  margin: 20px 0;
}

.el-divider__text {
  color: #909399;
}
</style>