<script setup lang="ts">
// 因为配置了 AutoImport，所以 RouterLink 可以直接使用
// useRoute 也可以直接使用

// 定义导航菜单数据
const menus = [
  { label: '曲谱首页', link: '/', icon: 'i-carbon-home' }, 
  { label: '所有曲谱', link: '/scores', icon: 'i-carbon-music' },
  { label: '关于我们', link: '/about', icon: 'i-carbon-information' },
];

// 假设用户登录状态
const isLoggedIn = false; 

const handleLogout = () => {
  console.log('用户已登出');
};
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white shadow-md dark:bg-gray-800">
    <div class="mx-auto max-w-screen-2xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      
      <RouterLink to="/" class="flex items-center text-xl font-bold text-gray-900 dark:text-white">
        <span class="text-green-600 dark:text-green-400 mr-2 i-carbon-ibm-cloud-pak-for-data text-2xl" />
        <span class="text-green-600">竹笛曲谱网</span>
      </RouterLink>
      
      <nav class="hidden lg:flex flex-grow justify-center">
        <ul class="flex space-x-8">
          <li v-for="menu in menus" :key="menu.label">
            <RouterLink 
              :to="menu.link" 
              class="flex items-center py-2 text-sm font-medium transition duration-150"
              :class="{ 
                'text-green-600 dark:text-green-400 border-b-2 border-green-600': useRoute().path === menu.link || (menu.link !== '/' && useRoute().path.startsWith(menu.link)),
                'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400': useRoute().path !== menu.link && !(menu.link !== '/' && useRoute().path.startsWith(menu.link))
              }"
            >
              <div :class="menu.icon" class="mr-1.5 text-lg" /> 
              {{ menu.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center space-x-4">
        <div v-if="isLoggedIn" class="flex items-center space-x-2">
          <button @click="handleLogout" class="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hidden sm:block">
            退出
          </button>
        </div>
        <RouterLink v-else to="/login" class="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
          登录 / 注册
        </RouterLink>
        
        <button class="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-green-600" aria-label="Open menu">
          <div class="i-carbon-menu text-xl" />
        </button>
      </div>
    </div>
  </header>
</template>