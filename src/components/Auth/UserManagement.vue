<template>
  <div class="user-management">
    <div class="user-management-header">
      <h2>用户管理</h2>
      <p>当前系统中共有 {{ users.length }} 个用户</p>
    </div>
    
    <div class="user-list">
      <a-table
        :columns="columns"
        :data-source="users"
        :pagination="false"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'red' : 'blue'">
              {{ record.role === 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
        </template>
      </a-table>
    </div>
    
    <div class="user-management-actions">
      <a-button type="primary" @click="refreshUsers">
        刷新用户列表
      </a-button>
      <a-button type="danger" @click="clearAllUsers" :loading="clearing">
        清除所有用户数据
      </a-button>
      <a-button @click="goBack">
        返回
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { userService } from '../../services/userService'

const emit = defineEmits(['go-back'])

const users = ref([])
const clearing = ref(false)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180
  }
]

const loadUsers = () => {
  try {
    users.value = userService.getAllUsers()
  } catch (error) {
    message.error('加载用户数据失败')
  }
}

const refreshUsers = () => {
  loadUsers()
  message.success('用户列表已刷新')
}

const clearAllUsers = async () => {
  try {
    clearing.value = true
    const result = await userService.clearAllUsers()
    if (result.success) {
      message.success(result.message)
      loadUsers()
    }
  } catch (error) {
    message.error(error.message || '清除用户数据失败')
  } finally {
    clearing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleString('zh-CN')
  } catch {
    return dateString
  }
}

const goBack = () => {
  emit('go-back')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-management-header {
  text-align: center;
  margin-bottom: 24px;
}

.user-management-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.user-management-header p {
  color: #666;
  font-size: 14px;
}

.user-list {
  margin-bottom: 24px;
}

.user-management-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
