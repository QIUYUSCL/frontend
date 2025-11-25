<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>📝 用户注册</h2>
      </template>

      <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          label-width="80px"
          class="register-form"
          @keyup.enter="handleRegister"
      >
        <el-form-item label="学工号" prop="studentId">
          <el-input
              v-model="registerForm.studentId"
              placeholder="请输入10位学工号"
              clearable
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input
              v-model="registerForm.realName"
              placeholder="请输入真实姓名"
              clearable
              :prefix-icon="Avatar"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码（至少6位）"
              clearable
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              clearable
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item label="所在学院" prop="college">
          <el-input
              v-model="registerForm.college"
              placeholder="如：信息工程学院"
              clearable
          />
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input
              v-model="registerForm.major"
              placeholder="如：软件工程"
              clearable
          />
        </el-form-item>

        <el-form-item label="年级" prop="grade">
          <el-input-number
              v-model="registerForm.grade"
              :min="2018"
              :max="2025"
              placeholder="如：2021"
              style="width: 100%;"
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="handleRegister"
              :loading="loading"
              style="width: 100%;"
              size="large"
          >
            立即注册
          </el-button>
        </el-form-item>

        <el-divider>已有账号？</el-divider>

        <el-button
            type="default"
            @click="$router.push('/login')"
            style="width: 100%;"
            size="large"
        >
          返回登录
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
import { User, Lock, Avatar } from '@element-plus/icons-vue'

const router = useRouter()

const registerFormRef = ref()
const loading = ref(false)

const registerForm = reactive({
  studentId: '',
  realName: '',
  password: '',
  confirmPassword: '',
  college: '',
  major: '',
  grade: 2021
})

// 自定义验证：确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    callback()
  }
}

const registerRules = {
  studentId: [
    { required: true, message: '请输入学工号', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: '学工号应为10位数字', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  college: [{ required: true, message: '请输入所在学院', trigger: 'blur' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' },
    { type: 'number', min: 2018, max: 2025, message: '请输入有效的年级', trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = async () => {
  await registerFormRef.value.validate()

  loading.value = true
  try {
    const result = await authApi.register(registerForm)

    if (result.code === 200) {
      ElMessage.success('注册成功！请登录')
      router.push('/login')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    ElMessage.error(error.message || '注册失败，请检查信息')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 450px;
  padding: 20px;
}

.register-card h2 {
  text-align: center;
  margin: 0;
}

.register-form {
  margin-top: 20px;
}

.el-divider {
  margin: 20px 0;
}

.el-divider__text {
  color: #909399;
}
</style>