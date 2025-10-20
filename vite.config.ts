// vite.config.ts

import { defineConfig } from 'vite'

// 导入所有插件
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
// ❌ 移除这个已弃用的命名导出
import { presetUno } from 'unocss' 

// ✅ 替换为正确的默认导出
//import preset from 'unocss' // 你可以使用任何名称，例如 'presetUnoCore'
import { presetIcons } from '@unocss/preset-icons' // 图标预设

// 如果项目部署在子目录（例如 GitHub Pages），可能需要设置 REPO_NAME
const REPO_NAME = 'music'

export default defineConfig(({ command }) => {
  const isProd = command === 'build'
  
  return {
    // 基础路径配置
    base: isProd ? `/${REPO_NAME}/` : '/',

    plugins: [
      // 1. Vue 3 核心支持
      vue(),

      // 2. 文件系统路由 (vite-plugin-pages)
      // 自动将 src/pages 下的文件映射为路由
      Pages(),

      // 3. 组件自动导入 (unplugin-vue-components)
      // 自动导入 src/components 目录下的 Vue 组件
      Components({
        dts: true, // 生成 TypeScript 声明文件
        // 确保它扫描并自动注册你的组件
        dirs: ['src/components'], 
      }),

      // 4. API 自动导入 (unplugin-auto-import)
      // 自动导入 Composition API、Vue-Router 和 VueUse 的函数
      AutoImport({
        imports: [
          'vue', 
          'vue-router', 
          '@vueuse/core'
        ],
        dts: true, // 生成 TypeScript 声明文件
        vueTemplate: true, // 在 Vue 模板中也启用自动导入
      }),

      // 5. UnoCSS 样式框架
      UnoCSS({
        presets: [
          // 核心 UnoCSS 预设（包含基础工具类）
          presetUno(),
          // 图标预设（启用 i-carbon-dashboard 等图标类）
          presetIcons({
            scale: 1.2, // 可选：设置图标缩放比例
            warn: true, // 启用警告，帮助调试未找到的图标
          }),
        ],
      }),
    ],
    
    // 其他配置（例如 TypeScript 别名等）
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})