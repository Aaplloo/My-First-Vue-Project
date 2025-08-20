<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>欢迎回来，请登录您的账户</p>
      </div>
      
      <a-form
        :model="formState"
        name="login"
        @finish="onFinish"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
            prefix-icon="UserOutlined"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
            prefix-icon="LockOutlined"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.remember">
            记住我
          </a-checkbox>
          <a class="login-form-forgot" href="">
            忘记密码?
          </a>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            class="login-form-button"
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="login-footer">
          <span>还没有账户? </span>
          <a @click="goToRegister">立即注册</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userService } from '../../services/userService'

const emit = defineEmits(['login-success', 'go-to-register'])

const loading = ref(false)
const formState = reactive({
  username: '',
  password: '',
  remember: false
})

const onFinish = async (values) => {
  loading.value = true
  try {
    const result = await userService.login(values.username, values.password)
    
    if (result.success) {
      message.success('登录成功！')
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', result.user.username)
      localStorage.setItem('token', result.token)
      emit('login-success', result.user.username)
    }
  } catch (error) {
    message.error(error.message || '登录失败，请重试！')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  emit('go-to-register')
}
</script>

<style scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  width: 100%;
}

.login-form-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.login-form-forgot {
  float: right;
  color: #1890ff;
  text-decoration: none;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.login-footer a {
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
