import './assets/main.css'

// 导入 Ant Design Vue 样式
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 尝试动态导入 Ant Design Vue
import('ant-design-vue').then((Antd) => {
  app.use(Antd.default || Antd)
  app.mount('#app')
}).catch((error) => {
  console.error('Ant Design Vue 加载失败:', error)
  // 如果动态导入失败，仍然挂载应用
  app.mount('#app')
})
