// vite.config.ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 插件导入
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
// UnoCSS 核心预设和图标预设 (使用兼容性最好的命名导入)
import { presetUno } from 'unocss' 
import { presetIcons } from '@unocss/preset-icons' 

// 🚨 如果部署在 GitHub Pages 子目录，将 'music' 替换为你的仓库名
const REPO_NAME = 'music'

export default defineConfig(({ command }) => {
  const isProd = command === 'build'
  
  return {
    // 部署配置：如果不是在根域名部署，需要设置 base
    base: isProd ? `/${REPO_NAME}/` : '/',

    plugins: [
      vue(),
      
      // 文件系统路由：自动将 src/pages/ -> 路由
      Pages(),

      // 组件自动导入：自动导入 src/components 中的组件
      Components({ dts: true }),

      // API 自动导入：自动导入 Vue, Vue-Router 和 VueUse 的函数
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core'],
        dts: true,
        vueTemplate: true,
      }),

      // UnoCSS 样式框架
      UnoCSS({
        presets: [
          presetUno(), // 基础工具类
          presetIcons(), // 图标支持
        ],
      }),
    ],
    
    // 配置 @ 路径别名
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})