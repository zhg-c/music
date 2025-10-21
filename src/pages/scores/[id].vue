<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 导入简化后的 Score 接口和 allScores 数组
import {allScores } from '../../data/scores'; 

const route = useRoute();
const router = useRouter();

// 1. 路由参数
const scoreId = computed(() => Number(route.params.id));

// 2. 查找当前曲谱
const currentScore = computed(() => {
    return allScores.find(score => score.id === scoreId.value);
});

// ✨✨✨ HTML Audio 播放状态和逻辑 ✨✨✨
const isPlaying = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null); // 用于引用 <audio> 元素

// 控制函数 (启动/暂停)
const startPlayback = () => {
    const audio = audioRef.value;
    if (!audio) return;
    
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
};

// 监听播放状态变化
const handlePlay = () => {
    isPlaying.value = true;
};

const handlePause = () => {
    isPlaying.value = false;
};

const handleEnded = () => {
    isPlaying.value = false;
    // 播放结束后，将播放头重置到开头
    if (audioRef.value) {
        audioRef.value.currentTime = 0;
    }
};

// 组件卸载时确保音频停止并解绑
onUnmounted(() => {
    if (audioRef.value) {
        audioRef.value.pause();
        audioRef.value.currentTime = 0;
        // 移除所有事件监听器，避免内存泄漏
        audioRef.value.removeEventListener('play', handlePlay);
        audioRef.value.removeEventListener('pause', handlePause);
        audioRef.value.removeEventListener('ended', handleEnded);
    }
});

// 在数据加载后初始化播放器
onMounted(() => {
    // 组件挂载时绑定事件监听器
    if (audioRef.value) {
        audioRef.value.addEventListener('play', handlePlay);
        audioRef.value.addEventListener('pause', handlePause);
        audioRef.value.addEventListener('ended', handleEnded);
    }
});
</script>

<template>
    <div class="p-8 max-w-screen-xl mx-auto min-h-full">
        <div v-if="currentScore" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
            
            <header class="mb-8 border-b dark:border-gray-700 pb-4">
                <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{{ currentScore.title }}</h1>
            </header>

            <section class="mt-8">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
                    曲谱视图与播放
                </h2>
                
                <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner">
                    
                    <audio 
                        ref="audioRef" 
                        :src="currentScore.audioUrl" 
                        preload="auto"
                        class="hidden"
                    ></audio>

                    <button 
                        @click="startPlayback"
                        class="mb-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150"
                        :class="isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                    >
                        <div :class="isPlaying ? 'i-carbon-pause' : 'i-carbon-play'" class="mr-2" />
                        {{ isPlaying ? '暂停播放' : '点击播放' }}
                    </button>
                    
                    <div class="flex justify-center py-4 border-t border-b border-gray-300 dark:border-gray-700">
                        <img 
                            :src="currentScore.imageUrl" 
                            :alt="currentScore.title + ' 简谱'"
                            class="max-w-full h-auto rounded-lg shadow-xl dark:shadow-none"
                            style="max-height: 80vh;"
                        />
                    </div>
                    
                    <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        当前功能已切换为播放外部音频文件。请确保音频和图片文件存在于项目中的正确路径下。
                    </p>
                </div>
            </section>
            
        </div>
        
        <div v-else class="text-center py-20">
            <h1 class="text-3xl font-semibold text-gray-500 dark:text-gray-400">曲谱未找到</h1>
            <p class="mt-4 text-gray-500 dark:text-gray-400">ID 为 {{ scoreId }} 的曲谱不存在。</p>
            <button @click="router.push('/scores')" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                返回曲谱列表
            </button>
        </div>
    </div>
</template>

<style scoped>
/* 确保图标显示正常 */
.i-carbon-play, .i-carbon-pause {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
}
</style>