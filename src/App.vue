<script setup lang="ts">
// 自动导入 TheHeader（因为配置了 unplugin-vue-components）
import TheHeader from './components/TheHeader.vue';
// 自动导入 TheFooter
import TheFooter from './components/TheFooter.vue'; 
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