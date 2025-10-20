<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '../../composables/useUser';
// 自动导入 useUser
const { isAuthenticated } = useUser();

// 1. 获取路由参数
const route = useRoute();
const router = useRouter();
const scoreId = computed(() => Number(route.params.id));

// 2. 模拟数据 (保持不变)
interface Score {
  id: number;
  title: string;
  artist: string;
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  key: string;
  description: string;
  scoreUrl: string; 
}

const allScores: Score[] = [
  { id: 1, title: '姑苏行', artist: '江先渭', difficulty: '中级', duration: '5:30', key: 'D调', description: '一首著名的竹笛曲...', scoreUrl: '/mock/gusu.png' },
  { id: 2, title: '牧民新歌', artist: '简广易', difficulty: '高级', duration: '4:15', key: 'C调', description: '以内蒙古民歌素材为基础...', scoreUrl: '/mock/mumin.png' },
  // ... 
];

// 3. 查找当前曲谱 (保持不变)
const currentScore = computed(() => {
  return allScores.find(score => score.id === scoreId.value);
});

// 4. 处理曲谱不存在的情况 (保持不变)
if (!currentScore.value) {
    console.warn(`曲谱 ID ${scoreId.value} 不存在.`);
}
// 5. 根据难度获取颜色类 (保持不变)
const getDifficultyClass = (difficulty: Score['difficulty']) => {
  // ... 保持不变 ...
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
    <div v-if="currentScore" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
          曲谱预览
        </h2>
        
        <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-inner p-4 bg-gray-50 dark:bg-gray-900">
          
          <div v-if="!isAuthenticated" class="relative">
              <img 
                :src="currentScore.scoreUrl" 
                :alt="currentScore.title + ' 曲谱'" 
                class="w-full h-auto object-contain max-h-[80vh] mx-auto filter blur-lg transition duration-300"
              >
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div class="i-carbon-locked text-6xl text-white mb-4" />
                  <p class="text-2xl font-bold text-white mb-4">
                      登录后解锁高清曲谱
                  </p>
                  <RouterLink to="/login" class="text-lg font-medium text-white bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition duration-150 shadow-xl">
                      立即登录
                  </RouterLink>
              </div>
          </div>
          
          <div v-else>
              <img 
                :src="currentScore.scoreUrl" 
                :alt="currentScore.title + ' 曲谱'" 
                class="w-full h-auto object-contain max-h-[80vh] mx-auto hover:shadow-lg cursor-zoom-in"
              >
              <p class="text-center mt-4 text-green-600 dark:text-green-400 text-sm font-semibold">
                您已登录，正在查看高清原版曲谱。
              </p>
          </div>
          
        </div>
      </section>
      
    </div>
    
    </div>
</template>