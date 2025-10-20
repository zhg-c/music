<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// RouterLink 已被自动导入

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
  { id: 7, title: '雪山春晓', artist: '聂中明', difficulty: '高级', duration: '5:00', key: 'D调' },
  { id: 8, title: '我是一个兵', artist: '佚名', difficulty: '初级', duration: '2:30', key: 'C调' },
];

// 2. 筛选和搜索状态
const searchTerm = ref('');
// 筛选状态：'all' 表示不过滤
const selectedDifficulty = ref<'all' | Score['difficulty']>('all');
const selectedKey = ref<'all' | string>('all');

// 提取所有独特的调性，用于筛选器
const uniqueKeys = computed(() => {
  const keys = new Set(allScores.map(score => score.key));
  return ['all', ...Array.from(keys)].sort(); // 'all' 放在第一个，并排序
});

const difficultyOptions = ['all', '初级', '中级', '高级'];


// 3. 筛选后的曲谱列表 (Computed Property - 核心逻辑)
const filteredScores = computed(() => {
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  
  return allScores.filter(score => {
    // A. 搜索过滤
    const matchesSearch = 
      score.title.toLowerCase().includes(lowerCaseSearch) ||
      score.artist.toLowerCase().includes(lowerCaseSearch);
      
    // B. 难度过滤
    const matchesDifficulty = 
      selectedDifficulty.value === 'all' || 
      score.difficulty === selectedDifficulty.value;
      
    // C. 调性过滤
    const matchesKey = 
      selectedKey.value === 'all' || 
      score.key === selectedKey.value;
      
    // 必须同时满足所有条件
    return matchesSearch && matchesDifficulty && matchesKey;
  });
});

// 4. 根据难度获取 UnoCSS 颜色类 (保持不变)
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

// 5. 重置所有筛选
const resetFilters = () => {
    searchTerm.value = '';
    selectedDifficulty.value = 'all';
    selectedKey.value = 'all';
}

// ✨ 1. 加载状态管理 ✨
const isLoading = ref(true);

// 2. 模拟数据获取函数
const fetchData = () => {
    isLoading.value = true;
    
    // 模拟网络延迟 1.5 秒
    setTimeout(() => {
        // ⚠️ 实际项目中，这里是 axios.get('/api/scores')
        // allScores = response.data; 
        isLoading.value = false;
    }, 1500);
};

// 3. 在组件挂载时开始加载
onMounted(() => {
    fetchData();
});
</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto min-h-full">
    <div v-if="isLoading" class="text-center py-20">
        <div class="i-carbon-spinner-gap animate-spin text-6xl text-green-600 mx-auto mb-4" />
        <p class="text-xl text-gray-600 dark:text-gray-300">
            正在加载竹笛曲谱，请稍候...
        </p>
    </div>

    <div v-else-if="filteredScores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      </div>
    
    <div v-else class="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
        </div>
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-4 border-green-500 pb-2">
      竹笛曲谱库 ({{ filteredScores.length }} / {{ allScores.length }} 首)
    </h1>
    
    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        
        <div class="mb-6 flex items-center space-x-4">
            <div class="i-carbon-search text-2xl text-gray-500 dark:text-gray-400" />
            <input 
                type="text" 
                v-model="searchTerm"
                placeholder="搜索曲名或作者..." 
                class="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150"
            />
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
            
            <label class="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">难度：</label>
            <div class="flex space-x-2">
                <button
                    v-for="option in difficultyOptions" 
                    :key="option"
                    @click="selectedDifficulty = option as 'all' | Score['difficulty']"
                    class="px-4 py-2 rounded-full text-sm font-semibold transition duration-150"
                    :class="{
                        'bg-green-600 text-white shadow-md': selectedDifficulty === option,
                        'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600': selectedDifficulty !== option
                    }"
                >
                    {{ option === 'all' ? '全部难度' : option }}
                </button>
            </div>
            
            <label for="key-select" class="text-gray-700 dark:text-gray-300 font-medium ml-4">调性：</label>
            <select 
                id="key-select"
                v-model="selectedKey" 
                class="p-2 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
                <option v-for="key in uniqueKeys" :key="key" :value="key">
                    {{ key === 'all' ? '所有调性' : key }}
                </option>
            </select>
            
            <button 
                @click="resetFilters" 
                class="ml-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition duration-150"
            >
                <div class="i-carbon-trash-can inline-block mr-1" />
                重置
            </button>
        </div>
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
            没有找到符合筛选条件的竹笛曲谱。
        </p>
        <button @click="resetFilters" class="mt-4 text-green-600 hover:underline">
            清除所有筛选条件
        </button>
    </div>
    
  </div>
</template>