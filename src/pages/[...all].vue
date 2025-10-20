<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const path = route.path; // 获取用户尝试访问的路径
</script>

<template>
  <div class="p-8 max-w-screen-lg mx-auto min-h-full flex flex-col items-center justify-center text-center py-20">
    
    <h1 class="text-9xl font-extrabold text-green-600 dark:text-green-400 mb-4">
      404
    </h1>
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
      页面未找到
    </h2>
    
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      抱歉！您尝试访问的地址 
      <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded font-mono text-red-500">{{ path }}</code> 
      不存在或已被移除。
    </p>
    
    <div class="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
      
      <RouterLink 
        to="/" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 transition duration-150"
      >
        <div class="i-carbon-home mr-2" />
        返回竹笛首页
      </RouterLink>
      
      <RouterLink 
        to="/scores" 
        class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-semibold rounded-lg shadow-md text-gray-800 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
      >
        <div class="i-carbon-music mr-2" />
        查看所有曲谱
      </RouterLink>
      
    </div>
    
  </div>
</template>