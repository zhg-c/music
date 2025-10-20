<script setup lang="ts">
import { ref, computed } from 'vue';

// 1. 模拟曲谱数据
interface Score {
  id: number;
  title: string;
  artist: string;
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  key: string; // 调性
}

const allScores: Score[] = [
  { id: 1, title: '姑苏行', artist: '江先渭', difficulty: '中级', duration: '5:30', key: 'D调' },
  { id: 2, title: '牧民新歌', artist: '简广易', difficulty: '高级', duration: '4:15', key: 'C调' },
  { id: 3, title: '春江花月夜', artist: '古曲', difficulty: '初级', duration: '6:00', key: 'G调' },
  { id: 4, title: '扬鞭催马运粮忙', artist: '魏显忠', difficulty: '高级', duration: '3:50', key: 'A调' },
  { id: 5, title: '喜相逢', artist: '冯子存', difficulty: '中级', duration: '3:30', key: 'F调' },
  { id: 6, title: ' P T H', artist: '佚名', difficulty: '初级', duration: '2:10', key: '降B调' },
];

// 2. 搜索状态
const searchTerm = ref('');

// 3. 筛选后的曲谱列表 (Computed Property)
const filteredScores = computed(() => {
  if (!searchTerm.value) {
    return allScores;
  }
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  
  return allScores.filter(score => 
    score.title.toLowerCase().includes(lowerCaseSearch) ||
    score.artist.toLowerCase().includes(lowerCaseSearch)
  );
});

// 根据难度获取 UnoCSS 颜色类
const getDifficultyClass = (difficulty: Score['difficulty']) => {
  switch (difficulty) {
    case '初级':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case '中级':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case '高级':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto min-h-full">
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-4 border-green-500 pb-2">
      竹笛曲谱库 ({{ filteredScores.length }} 首)
    </h1>
    
    <div class="mb-8 flex items-center space-x-4">
        <div class="i-carbon-search text-2xl text-gray-500 dark:text-gray-400" />
        <input 
            type="text" 
            v-model="searchTerm"
            placeholder="搜索曲名或作者..." 
            class="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150"
        />
    </div>

    <div v-if="filteredScores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div v-for="score in filteredScores" :key="score.id" 
           class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-green-500"
      >
        <RouterLink :to="`/scores/${score.id}`" class="block">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1 hover:text-green-600 transition duration-150">
            {{ score.title }}
          </h3>
          <p class="text-md text-gray-500 dark:text-gray-400 mb-4">
            作者：{{ score.artist }}
          </p>
          
          <div class="flex flex-wrap gap-2 text-sm">
            <span :class="getDifficultyClass(score.difficulty)" class="px-3 py-1 rounded-full font-semibold">
              <div class="i-carbon-star inline-block mr-1" />
              {{ score.difficulty }}
            </span>
            <span class="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              <div class="i-carbon-time inline-block mr-1" />
              {{ score.duration }}
            </span>
            <span class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full">
              <div class="i-carbon-music-add inline-block mr-1" />
              {{ score.key }}
            </span>
          </div>
        </RouterLink>
      </div>
      
    </div>
    
    <div v-else class="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div class="i-carbon-data-unavailable text-6xl text-gray-400 mx-auto mb-4" />
        <p class="text-xl text-gray-600 dark:text-gray-300">
            没有找到与 "{{ searchTerm }}" 相关的竹笛曲谱。
        </p>
        <button @click="searchTerm = ''" class="mt-4 text-green-600 hover:underline">
            重置搜索
        </button>
    </div>
    
  </div>
</template>