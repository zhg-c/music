<script setup lang="ts">
// 自动导入 TheHeader（因为配置了 unplugin-vue-components）
import TheHeader from './components/TheHeader.vue';
// 自动导入 TheFooter
import TheFooter from './components/TheFooter.vue'; 
// VueUse 的 useDark, useToggle, usePreferredDark 都会被自动导入

// 1. 设置颜色模式管理
// 默认使用 'class' 模式，这意味着 UnoCSS (或 Tailwind) 将通过 body/html 上的 'dark' 类名来切换样式
import { useColorMode } from '@vueuse/core';
const mode = useColorMode({
  storageKey: 'music-color-scheme', // 存储在 localStorage 中的键名
  attribute: 'class', // 切换 'dark' 类名
  initialValue: 'auto', // 优先根据系统偏好设置
});

// 2. 将 useDark 暴露给全局，方便在任何地方使用
import { useDark } from '@vueuse/core';
const isDark = useDark({
    // 监听 mode 变化
    storageKey: 'music-color-scheme',
});

// 3. 将切换函数暴露给 Header
import { useToggle } from '@vueuse/core';
const toggleDark = useToggle(isDark);

// ⚠️ 将这两个变量暴露给 window/全局 context，以便在其他组件中访问
// 💡 在更大型的应用中，我们通常会创建一个 Store 或 Provider 来传递这些状态
// 但对于简单项目，我们可以通过一个简单的 composable 或全局暴露来实现切换
// 由于我们希望在 Header 中使用，最好的方法是将 toggleDark 放到 useUser 或新建一个 useTheme composable

// 考虑到简单性，我们现在将切换按钮直接放在 Header 中，并在 Header 中定义 toggleDark
</script>

<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-900">
    
    <TheHeader />

    <main class="flex-grow">
      <RouterView />
    </main>
    
    <TheFooter />
  </div>
</template>

<style>
/* ... */
</style>