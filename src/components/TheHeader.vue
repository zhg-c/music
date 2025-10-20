<script setup lang="ts">
// useUser 会被自动导入（因为配置了 AutoImport）
// import { useUser } from '@/composables/useUser';
// useRoute, useRouter 也会被自动导入
import { useUser } from '../composables/useUser';
const { isAuthenticated, logout, currentUser } = useUser();
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

// 定义导航菜单数据
const menus = [
  { label: '曲谱首页', link: '/', icon: 'i-carbon-home' }, 
  { label: '所有曲谱', link: '/scores', icon: 'i-carbon-music' },
  { label: '关于我们', link: '/about', icon: 'i-carbon-information' },
];

/**
 * 处理登出逻辑，并跳转到首页
 */
const handleLogout = () => {
  logout();
  router.push('/');
  console.log('用户已登出');
};
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white shadow-md dark:bg-gray-800">
    <div class="mx-auto max-w-screen-2xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      
      <RouterLink to="/" class="flex items-center text-xl font-bold text-gray-900 dark:text-white">
        <span class="text-green-600 dark:text-green-400 mr-2 i-carbon-music text-2xl" />
        <span class="text-green-600">竹笛曲谱网</span>
      </RouterLink>
      
      <nav class="hidden lg:flex flex-grow justify-center">
        </nav>

      <div class="flex items-center space-x-4">
        
        <div v-if="isAuthenticated" class="flex items-center space-x-4">
          <RouterLink to="/login" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 hidden sm:block">
            <span class="i-carbon-user text-lg mr-1" />
            {{ currentUser?.username }}
          </RouterLink>
          
          <button @click="handleLogout" class="text-sm font-medium px-3 py-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition duration-150 shadow-md">
            退出
          </button>
        </div>
        
        <RouterLink v-else to="/login" class="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
          <div class="i-carbon-login inline-block mr-1" />
          登录 / 注册
        </RouterLink>
        
        </div>
    </div>
  </header>
</template>