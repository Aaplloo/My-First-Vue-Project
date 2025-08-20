<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>创建您的账户，开始使用我们的服务</p>
      </div>
      
      <a-form
        :model="formState"
        name="register"
        @finish="onFinish"
        class="register-form"
      >
        <a-form-item
          name="username"
          :rules="[
            { required: true, message: '请输入用户名!' },
            { min: 3, message: '用户名至少3个字符!' }
          ]"
        >
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
            prefix-icon="UserOutlined"
          />
        </a-form-item>

        <a-form-item
          name="email"
          :rules="[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]"
        >
          <a-input
            v-model:value="formState.email"
            size="large"
            placeholder="邮箱"
            prefix-icon="MailOutlined"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6个字符!' }
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
            prefix-icon="LockOutlined"
          />
        </a-form-item>

        <a-form-item
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码!' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            placeholder="确认密码"
            prefix-icon="LockOutlined"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.agree">
            我已阅读并同意
            <a href="">服务条款</a>
            和
            <a href="">隐私政策</a>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            class="register-form-button"
            :loading="loading"
            :disabled="!formState.agree"
          >
            注册
          </a-button>
        </a-form-item>

        <div class="register-footer">
          <span>已有账户? </span>
          <a @click="goToLogin">立即登录</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { userService } from '../../services/userService'

const emit = defineEmits(['register-success', 'go-to-login'])

const loading = ref(false)
const formState = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const validateConfirmPassword = async (rule, value) => {
  if (value === '') {
    throw new Error('请确认密码!')
  } else if (value !== formState.password) {
    throw new Error('两次输入的密码不一致!')
  }
}

const onFinish = async (values) => {
  loading.value = true
  try {
    const result = await userService.register({
      username: values.username,
      email: values.email,
      password: values.password
    })
    
    if (result.success) {
      message.success(`${result.message}！用户名：${values.username}，请使用新账户登录`)
      emit('register-success')
    }
  } catch (error) {
    message.error(error.message || '注册失败，请重试！')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  emit('go-to-login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.register-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.register-form {
  width: 100%;
}

.register-form-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.register-footer a {
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
