<script setup lang="ts">
// 这里可以导入全局组件，如 Header/Footer
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-900">
    <TheHeader />

    <main class="flex-grow">
      <RouterView />
    </main>
    
    </div>
</template>

<style>
/* 全局基础样式可以在这里添加或使用 UnoCSS 的 @unocss preflight */
</style>