# 在 First-vue-project 中使用 Msg 组件库

## 概述

本项目已经配置好了 `Maps-conceil\msg` 中的 Ant Design Vue 组件库，您可以直接使用这些组件。

## 已配置的组件

以下组件已经可以直接使用：

### 基础组件
- `a-button` - 按钮组件
- `a-input` - 输入框组件
- `a-input-password` - 密码输入框组件
- `a-card` - 卡片组件
- `a-table` - 表格组件
- `a-modal` - 弹窗组件

### 反馈组件
- `a-message` - 消息提示
- `a-notification` - 通知提醒

### 布局组件
- `a-layout` - 布局容器
- `a-grid` - 栅格系统
- `a-space` - 间距组件

## 使用方法

### 1. 直接使用组件

```vue
<template>
  <div>
    <a-button type="primary">主要按钮</a-button>
    <a-input placeholder="请输入内容" />
    <a-card title="卡片标题">
      <p>卡片内容</p>
    </a-card>
  </div>
</template>
```

### 2. 使用组件的方法

```vue
<script setup>
import { message, notification } from 'ant-design-vue'

const showMessage = () => {
  message.success('操作成功！')
}

const showNotification = () => {
  notification.success({
    message: '成功',
    description: '这是一条成功通知',
  })
}
</script>
```

### 3. 响应式数据绑定

```vue
<template>
  <a-input v-model:value="inputValue" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
</script>
```

## 样式定制

项目已经配置了 Less 支持，您可以通过以下方式定制样式：

1. 在组件中使用 `scoped` 样式
2. 在 `main.js` 中导入自定义样式文件
3. 使用 CSS 变量覆盖默认主题

## 注意事项

1. 所有组件都以 `a-` 前缀开头
2. 组件属性遵循 Ant Design Vue 的 API 规范
3. 样式会自动加载，无需额外配置
4. 支持 TypeScript 类型检查

## 更多组件

如需使用更多组件，请参考：
- [Ant Design Vue 官方文档](https://antdv.com/components/overview)
- `Maps-conceil\msg\components` 目录下的具体组件实现

## 开发建议

1. 优先使用已配置的组件
2. 保持组件使用的一致性
3. 合理使用组件的各种属性
4. 注意组件的性能优化
