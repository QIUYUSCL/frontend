<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-header style="background-color: #409eff; color: white; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <h1 style="margin: 0; font-size: 24px;">📚 书脉圈</h1>
        </div>
        <div style="display: flex; align-items: center; gap: 20px;">
          <el-input
              v-model="searchKeyword"
              placeholder="搜索图书、课程"
              style="width: 300px;"
              @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <el-button type="text" style="color: white;">消息</el-button>
          <el-dropdown>
            <el-avatar :icon="UserFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/personal')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/my-orders')">我的订单</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/credit')">信用积分</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" style="background-color: #f5f7fa; border-right: 1px solid #dcdfe6;">
          <el-menu
              :default-active="$route.path"
              router
              style="border-right: none;"
          >
            <el-menu-item index="/">
              <el-icon><House /></el-icon>
              <span>首页推荐</span>
            </el-menu-item>
            <el-menu-item index="/publish">
              <el-icon><Upload /></el-icon>
              <span>发布图书</span>
            </el-menu-item>
            <el-menu-item index="/knowledge-map">
              <el-icon><OfficeBuilding /></el-icon>
              <span>知识地图</span>
            </el-menu-item>
            <el-menu-item index="/my-books">
              <el-icon><Collection /></el-icon>
              <span>我的书架</span>
            </el-menu-item>
            <el-menu-item index="/my-orders">
              <el-icon><List /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main style="padding: 20px; overflow-y: auto;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, UserFilled, House, Upload, OfficeBuilding, Collection, List } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  router.push('/login')
}

</script>

<style>
#app {
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.el-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.el-aside {
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
}
</style>