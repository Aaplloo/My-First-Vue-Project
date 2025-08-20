<template>
  <div class="auth-manager">
    <!-- 登录组件 -->
    <Login
      v-if="currentView === 'login'"
      @login-success="handleLoginSuccess"
      @go-to-register="currentView = 'register'"
    />
    
    <!-- 注册组件 -->
    <Register
      v-else-if="currentView === 'register'"
      @register-success="handleRegisterSuccess"
      @go-to-login="currentView = 'login'"
    />
    
            <!-- 主应用内容 -->
        <div v-else class="main-app">
          <div class="top-bar">
            <div class="user-info">
              <a-avatar :size="32" icon="UserOutlined" />
              <span class="username">{{ username }}</span>
            </div>
            <div class="top-bar-actions">
              <a-button type="text" @click="showUserManagement = true" title="用户管理">
                <UserOutlined />
                用户管理
              </a-button>
              <a-button type="text" @click="handleLogout">
                <LogoutOutlined />
                退出登录
              </a-button>
            </div>
          </div>
          
          <div class="app-content">
            <!-- 用户管理页面 -->
            <UserManagement
              v-if="showUserManagement"
              @go-back="showUserManagement = false"
            />
            <!-- 主应用内容 -->
            <slot v-else></slot>
          </div>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import Login from './Login.vue'
import Register from './Register.vue'
import UserManagement from './UserManagement.vue'
import { userService } from '../../services/userService'

const currentView = ref('login')
const username = ref('')
const showUserManagement = ref(false)

onMounted(() => {
  // 检查是否已经登录
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const savedUsername = localStorage.getItem('username')
  
  if (isLoggedIn === 'true' && savedUsername) {
    username.value = savedUsername
    currentView.value = 'main'
  }
})

const handleLoginSuccess = (user) => {
  username.value = user
  currentView.value = 'main'
  message.success(`欢迎回来，${user}！`)
}

const handleRegisterSuccess = () => {
  currentView.value = 'login'
  message.info('注册成功，请使用新账户登录')
}

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await userService.logout(token)
    }
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    currentView.value = 'login'
    message.success('已退出登录')
  } catch (error) {
    message.error('退出登录失败')
  }
}
</script>

<style scoped>
.auth-manager {
  width: 100vw;
  height: 100wh;
}

.main-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.top-bar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.app-content {
  flex: 1;
  overflow: hidden;
}
</style>
