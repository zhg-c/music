// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 导入 UnoCSS 的虚拟入口，以便 Vite 知道要加载它
import 'uno.css' 

// 导入路由创建工具和自动生成的路由
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages' 

// 创建路由器实例
const router = createRouter({
  // 最佳兼容性：使用 Hash 模式，避免服务器配置问题
  history: createWebHashHistory(import.meta.env.BASE_URL), 
  routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')