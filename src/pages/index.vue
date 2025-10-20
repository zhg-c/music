<script setup lang="ts">
import { ref } from 'vue';

// 模拟最近更新的曲谱（实际应通过 API 获取）
const latestScores = ref([
    { id: 7, title: '雪山春晓', artist: '聂中明/田景恩', difficulty: '高级', key: 'E调' },
    { id: 8, title: '我是一个兵', artist: '佚名', difficulty: '初级', key: 'C调' },
    { id: 9, title: '早晨', artist: '赵松庭', difficulty: '中级', key: 'G调' },
]);
</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto min-h-full">
    
    <div class="text-center py-20 bg-green-50 dark:bg-gray-800 rounded-2xl shadow-xl mb-12 border-b-4 border-green-600">
      <h1 class="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
        <span class="text-green-600">乐随竹动</span>，曲伴君行
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        最全的专业竹笛曲谱库，从入门到精通，一站式解决您的找谱难题。
      </p>
      
      <RouterLink 
          to="/scores" 
          class="inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-105"
      >
          <div class="i-carbon-search mr-2 text-xl" />
          立即探索曲谱
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      
      <div class="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <div class="i-carbon-download text-4xl text-blue-500 mb-3" />
        <h3 class="text-xl font-bold dark:text-white mb-2">免费下载</h3>
        <p class="text-gray-600 dark:text-gray-300">
          大部分曲谱提供高清 PDF 或图片格式下载，方便打印。
        </p>
      </div>

      <div class="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <div class="i-carbon-music-add text-4xl text-purple-500 mb-3" />
        <h3 class="text-xl font-bold dark:text-white mb-2">调性齐全</h3>
        <p class="text-gray-600 dark:text-gray-300">
          涵盖各种常用调性，满足您不同笛子的演奏需求。
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <div class="i-carbon-star-filled text-4xl text-yellow-500 mb-3" />
        <h3 class="text-xl font-bold dark:text-white mb-2">难度分级</h3>
        <p class="text-gray-600 dark:text-gray-300">
          曲谱清晰标记难度等级，小白也能轻松找到合适的入门曲。
        </p>
      </div>
    </div>
    
    <div class="mt-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
            最近更新 <span class="i-carbon-calendar text-2xl ml-2 text-green-600" />
        </h2>
        <ul class="space-y-3">
            <li v-for="score in latestScores" :key="score.id"
                class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 flex justify-between items-center"
            >
                <div>
                    <RouterLink :to="`/scores/${score.id}`" class="text-lg font-semibold text-green-600 dark:text-green-400 hover:underline">
                        {{ score.title }}
                    </RouterLink>
                    <span class="text-gray-500 dark:text-gray-400 ml-3"> - {{ score.artist }}</span>
                </div>
                <span class="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {{ score.difficulty }} ({{ score.key }})
                </span>
            </li>
        </ul>
    </div>
    
  </div>
</template>