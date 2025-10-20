// src/shims-vue.d.ts (示例文件名)

// 告诉 TypeScript 虚拟模块 'virtual:generated-pages' 的类型
declare module 'virtual:generated-pages' {
  import type { RouteRecordRaw } from 'vue-router'
  // 声明它默认导出一个 RouteRecordRaw 数组
  const routes: RouteRecordRaw[]
  export default routes
}