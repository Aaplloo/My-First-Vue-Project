# 用户认证系统说明

## 功能概述

本项目已成功集成了完整的用户认证系统，包括：

- 🔐 用户登录
- 📝 用户注册  
- 🚪 退出登录
- 💾 登录状态持久化
- 🎨 美观的UI界面

## 组件结构

```
src/components/Auth/
├── Login.vue          # 登录组件
├── Register.vue       # 注册组件
└── AuthManager.vue    # 认证管理组件
```

## 使用方法

### 1. 默认账户

系统预设了一个管理员账户：
- 用户名：`admin`
- 密码：`admin`

### 2. 新用户注册

1. 点击登录页面的"立即注册"链接
2. 填写用户名（至少3个字符）
3. 填写有效的邮箱地址
4. 设置密码（至少6个字符）
5. 确认密码
6. 同意服务条款
7. 点击"注册"按钮

### 3. 用户登录

1. 输入用户名和密码
2. 可选择"记住我"选项
3. 点击"登录"按钮

### 4. 退出登录

登录后，在页面顶部右侧可以看到用户名和"退出登录"按钮，点击即可退出。

## 技术特性

- **Vue 3 Composition API**：使用最新的Vue 3语法
- **Ant Design Vue**：美观的UI组件库
- **响应式设计**：适配不同屏幕尺寸
- **表单验证**：完整的输入验证逻辑
- **状态管理**：使用localStorage持久化登录状态
- **模拟API**：内置模拟后端服务

## 自定义配置

### 修改默认用户

编辑 `src/services/userService.js` 文件中的 `users` 数组：

```javascript
const users = [
  {
    id: 1,
    username: 'your-username',
    password: 'your-password',
    email: 'your-email@example.com',
    role: 'admin'
  }
]
```

### 连接真实后端

将 `src/services/userService.js` 中的模拟API替换为真实的HTTP请求：

```javascript
// 示例：使用fetch API
async login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  
  if (!response.ok) {
    throw new Error('登录失败')
  }
  
  return await response.json()
}
```

## 安全注意事项

1. **密码存储**：当前使用明文存储密码，生产环境应使用加密存储
2. **Token管理**：建议实现JWT token刷新机制
3. **输入验证**：已在客户端实现基础验证，建议在服务端也进行验证
4. **HTTPS**：生产环境必须使用HTTPS协议

## 样式自定义

所有组件都使用scoped样式，可以通过修改CSS变量来自定义主题：

```css
:root {
  --primary-color: #1890ff;
  --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 故障排除

### 常见问题

1. **登录失败**：检查用户名和密码是否正确
2. **注册失败**：确保用户名和邮箱未被使用
3. **样式异常**：确保Ant Design Vue样式文件正确加载

### 调试模式

在浏览器控制台中可以看到详细的错误信息和API调用日志。

## 更新日志

- v1.0.0：初始版本，包含基础登录注册功能
- 支持用户名/密码认证
- 响应式设计
- 表单验证
- 状态持久化
