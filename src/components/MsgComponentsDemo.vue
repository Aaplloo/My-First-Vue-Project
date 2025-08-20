<template>
  <div class="msg-components-demo">
    <h2>Msg 组件库演示</h2>
    
    <!-- Button 组件 -->
    <div class="component-section">
      <h3>Button 组件</h3>
      <a-button type="primary">主要按钮</a-button>
      <a-button>默认按钮</a-button>
      <a-button type="dashed">虚线按钮</a-button>
      <a-button type="link">链接按钮</a-button>
    </div>

    <!-- Input 组件 -->
    <div class="component-section">
      <h3>Input 组件</h3>
      <a-input v-model:value="inputValue" placeholder="请输入内容" style="width: 200px; margin-right: 10px;" />
      <a-input-password v-model:value="passwordValue" placeholder="请输入密码" style="width: 200px;" />
    </div>

    <!-- Card 组件 -->
    <div class="component-section">
      <h3>Card 组件</h3>
      <a-card title="卡片标题" style="width: 300px;">
        <template #extra>
          <a-button type="link">更多</a-button>
        </template>
        <p>这是一个卡片组件的内容</p>
      </a-card>
    </div>

    <!-- Table 组件 -->
    <div class="component-section">
      <h3>Table 组件</h3>
      <a-table :columns="columns" :data-source="dataSource" :pagination="false" />
    </div>

    <!-- Modal 组件 -->
    <div class="component-section">
      <h3>Modal 组件</h3>
      <a-button type="primary" @click="showModal">打开弹窗</a-button>
      <a-modal
        v-model:open="modalVisible"
        title="弹窗标题"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <p>这是弹窗的内容</p>
      </a-modal>
    </div>

    <!-- Message 组件 -->
    <div class="component-section">
      <h3>Message 组件</h3>
      <a-button @click="showMessage">显示消息</a-button>
      <a-button @click="showNotification">显示通知</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message, notification } from 'ant-design-vue'

// 响应式数据
const inputValue = ref('')
const passwordValue = ref('')
const modalVisible = ref(false)

// Table 数据
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
]

const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
  },
]

// 方法
const showModal = () => {
  modalVisible.value = true
}

const handleOk = () => {
  modalVisible.value = false
  message.success('弹窗已确认')
}

const handleCancel = () => {
  modalVisible.value = false
  message.info('弹窗已取消')
}

const showMessage = () => {
  message.success('这是一条成功消息')
}

const showNotification = () => {
  notification.success({
    message: '成功',
    description: '这是一条成功通知',
  })
}
</script>

<style scoped>
.msg-components-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.component-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.component-section h3 {
  margin-bottom: 15px;
  color: #1890ff;
}

.component-section .ant-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.component-section .ant-input {
  margin-bottom: 10px;
}
</style>
