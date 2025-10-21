<script setup lang="ts">
// useUser, useRoute, useRouter, useDark, useToggle 都会被自动导入
import { useUser } from '../composables/useUser';
const { isAuthenticated} = useUser();
import { useRouter } from 'vue-router';
useRouter();

// ✨ 暗黑模式逻辑 ✨
// 1. 创建 isDark 状态，它会自动检测系统偏好和存储
import { useDark } from '@vueuse/core';
const isDark = useDark({
    storageKey: 'music-color-scheme',
    attribute: 'class', 
    valueDark: 'dark', 
    valueLight: 'light'
});
// 2. 创建切换函数
import { useToggle } from '@vueuse/core';
const toggleDark = useToggle(isDark);

// ... 其他代码（menus 和 handleLogout）保持不变 ...
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white shadow-md dark:bg-gray-800">
    <div class="mx-auto max-w-screen-2xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      
      <div class="flex items-center space-x-4">
        
        <button 
            @click="toggleDark()" 
            class="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
            aria-label="Toggle dark mode"
        >
            <div v-if="isDark" class="i-carbon-sun text-xl" />
            <div v-else class="i-carbon-moon text-xl" />
        </button>
        
        <div v-if="isAuthenticated" class="flex items-center space-x-4">
          </div>
        
        <RouterLink v-else to="/login" class="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
          <div class="i-carbon-login inline-block mr-1" />
          登录 / 注册
        </RouterLink>
      </div>
    </div>
  </header>
</template>