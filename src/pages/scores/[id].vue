<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 自动导入，但这里明确写出

// 1. 获取路由参数
const route = useRoute();
const router = useRouter();
const scoreId = computed(() => Number(route.params.id));

// 2. 模拟数据（与列表页保持一致）
interface Score {
  id: number;
  title: string;
  artist: string;
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  key: string;
  description: string;
  scoreUrl: string; // 模拟曲谱图片链接
}

const allScores: Score[] = [
  { id: 1, title: '姑苏行', artist: '江先渭', difficulty: '中级', duration: '5:30', key: 'D调', description: '一首著名的竹笛曲，描绘了苏州水乡的美丽风光和人们悠闲的生活情景。乐曲风格典雅、流畅，是笛子艺术的经典之作。', scoreUrl: '/mock/gusu.png' },
  { id: 2, title: '牧民新歌', artist: '简广易', difficulty: '高级', duration: '4:15', key: 'C调', description: '以内蒙古民歌素材为基础创作的乐曲，表现了牧民们对美好生活的赞美和对家乡的热爱。技巧要求较高，富有激情。', scoreUrl: '/mock/mumin.png' },
  // ... 实际项目中这里将是 API 调用
];

// 3. 查找当前曲谱
const currentScore = computed(() => {
  return allScores.find(score => score.id === scoreId.value);
});

// 4. 处理曲谱不存在的情况
if (!currentScore.value) {
    // 实际项目中可以重定向到 404 页面
    console.warn(`曲谱 ID ${scoreId.value} 不存在，重定向到列表页.`);
    // router.replace('/scores'); 
}

// 5. 根据难度获取颜色类 (复用列表页的逻辑)
const getDifficultyClass = (difficulty: Score['difficulty']) => {
  switch (difficulty) {
    case '初级':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case '中级':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case '高级':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return '';
  }
};
</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto min-h-full">
    
    <button @click="router.back()" class="flex items-center text-green-600 dark:text-green-400 hover:underline mb-6">
      <div class="i-carbon-arrow-left mr-2" />
      返回曲谱列表
    </button>

    <div v-if="currentScore" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
      <header class="border-b pb-4 mb-6">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          {{ currentScore.title }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          作曲/整理：<span class="font-semibold">{{ currentScore.artist }}</span>
        </p>
      </header>
      
      <div class="flex flex-wrap gap-3 mb-8">
        <span :class="getDifficultyClass(currentScore.difficulty)" class="px-4 py-1 rounded-full font-semibold text-sm">
          <div class="i-carbon-star inline-block mr-1" />
          难度：{{ currentScore.difficulty }}
        </span>
        <span class="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-4 py-1 rounded-full text-sm">
          <div class="i-carbon-time inline-block mr-1" />
          时长：{{ currentScore.duration }}
        </span>
        <span class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-4 py-1 rounded-full text-sm">
          <div class="i-carbon-music-add inline-block mr-1" />
          调性：{{ currentScore.key }}
        </span>
      </div>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
          乐曲简介
        </h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed indent-8">
          {{ currentScore.description }}
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
          曲谱高清预览
        </h2>
        <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-inner p-4 bg-gray-50 dark:bg-gray-900">
          
          <img 
            :src="currentScore.scoreUrl" 
            :alt="currentScore.title + ' 曲谱'" 
            class="w-full h-auto object-contain max-h-[80vh] mx-auto opacity-50 hover:opacity-100 transition duration-300 cursor-zoom-in"
          >
          
          <p class="text-center mt-4 text-gray-500 dark:text-gray-400 text-sm">
            点击曲谱图片可放大查看 (模拟图片，当前设置为半透明)。
          </p>
        </div>
        
        <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 rounded text-red-700 dark:text-red-300 text-sm">
            提示：曲谱图片路径 (如 `/mock/gusu.png`) 需要你将图片文件放入项目的 **`public/mock`** 目录下才能正常显示。
        </div>
      </section>
      
    </div>
    
    <div v-else class="text-center py-20">
      <h1 class="text-3xl text-red-500">404 - 曲谱未找到</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
          您请求的曲谱 ID ({{ scoreId }}) 不存在。
      </p>
    </div>

  </div>
</template>