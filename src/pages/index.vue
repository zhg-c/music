<script setup lang="ts">

// ✨ 1. 导入最终简化的数据结构和曲谱列表
// 注意：Score 接口已在 scores.ts 中定义，这里需要再次导入，但我们只使用其中的 id 和 title。
// 引入所有曲谱数据 (allScores 已经是 ID 对应的)
import { latestThreeScores } from '../data/scores'; 
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
            
            <ul class="flex flex-col md:flex-row gap-4">
                <li v-for="score in latestThreeScores" :key="score.id"
                    class="w-full md:w-1/3 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between items-start"
                >
                    <div class="w-full">
                        <RouterLink :to="`/scores/${score.id}`" class="text-xl font-bold text-green-600 dark:text-green-400 hover:text-green-700 transition duration-150 block mb-2">
                            {{ score.title }}
                        </RouterLink>
                        
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            点击查看曲谱详情和音频。
                        </p>
                    </div>
                </li>
            </ul>
            <p v-if="latestThreeScores.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无曲谱数据。
            </p>
        </div>
        </div>
      
</template>