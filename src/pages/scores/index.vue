<script setup lang="ts">
import { ref, computed} from 'vue';

// ✨ 1. 导入最终简化的数据结构和曲谱列表
// 注意：Score 接口已在 scores.ts 中定义，这里需要再次导入，但我们只使用其中的 id 和 title。
// 引入所有曲谱数据 (allScores 已经是 ID 对应的)
import { allScores } from '../../data/scores'; 

// 2. 筛选和搜索状态 (只保留搜索)
const searchTerm = ref('');

// 3. 筛选后的曲谱列表 (Computed Property - 核心逻辑)
const filteredScores = computed(() => {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    
    return allScores.filter(score => {
        // 只有标题匹配搜索词才显示
        const matchesSearch = score.title.toLowerCase().includes(lowerCaseSearch);
        
        return matchesSearch;
    });
});

// 4. 重置搜索
const resetFilters = () => {
    searchTerm.value = '';
}

</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto min-h-full">
        
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-4 border-green-500 pb-2">
        曲谱列表 ({{ filteredScores.length }} / {{ allScores.length }} 首)
    </h1>
    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <div class="mb-6 flex items-center space-x-4">
            <div class="i-carbon-search text-2xl text-gray-500 dark:text-gray-400" />
            <input 
                type="text" 
                v-model="searchTerm"
                placeholder="搜索曲名..." 
                class="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150"
            />
              <button 
                v-if="searchTerm"
                @click="resetFilters" 
                class="px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition duration-150"
            >
                <div class="i-carbon-trash-can inline-block mr-1" />
                清除
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
                
                <p class="text-md text-gray-500 dark:text-gray-400 mt-2">
                    点击查看曲谱
                </p>
            </RouterLink>
        </div>
    </div>
      
    <div v-else class="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div class="i-carbon-data-unavailable text-6xl text-gray-400 mx-auto mb-4" />
        <p class="text-xl text-gray-600 dark:text-gray-300">
            没有找到符合条件的曲谱。
        </p>
    </div>
  </div>
</template>

<style scoped>
.i-carbon-search, .i-carbon-trash-can {
    vertical-align: middle;
}
</style>