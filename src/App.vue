<script setup lang="ts">
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue'; 
import { useDark } from '@vueuse/core';
import { RouterView } from 'vue-router';


useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
});

</script>

<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-900">
    
    <TheHeader />

    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
    <TheFooter />
  </div>
</template>

<style>
/* ---------------------------------- */
/* 路由过渡效果 (淡入淡出) */
/* ---------------------------------- */

/* 离开前的状态 */
.fade-leave-active {
  transition: opacity 0.3s ease; /* 离开时过渡 0.3s */
}

/* 进入时的状态 */
.fade-enter-active {
  transition: opacity 0.3s ease 0.3s; /* 进入时延迟 0.3s (等离开动画结束) */
}

/* 离开和进入时的不透明度 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 🎯 关键的全局 CSS 优化：确保 body/html 不引起双重滚动条 */
html, body {
    /* 移除浏览器默认的 margin 和 padding */
    margin: 0;
    padding: 0;
    /* 避免 html 或 body 出现多余的滚动条 */
    overflow-x: hidden; 
    /* 确保 body 不会比视口小 */
    min-height: 100%;
}
</style>