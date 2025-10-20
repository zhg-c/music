<script setup lang="ts">
import {computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '../../composables/useUser';
import * as Tone from 'tone'; // ✨ 引入 Tone.js
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
  jianpuData: { // ✨ 新增：简谱数据结构
  pitch: string; // 简谱音高 (如 '5', '6.', '1^' - 高音)
  duration: number; // 时长 (Tone.js 格式，如 0.5 为八分音符，1 为四分音符)
  }[];
}

// 模拟数据 (简谱 '姑苏行' 简单开头，C调 4/4 拍)
const GUSU_JIANPU_DATA = [
  // C调，4/4拍。1 = 四分音符 (Quarter Note)
  { pitch: '5', duration: 1 }, // Sol, 四分音符
  { pitch: '6', duration: 0.5 }, // La, 八分音符
  { pitch: '5', duration: 0.5 }, // Sol, 八分音符pnom
  { pitch: '3', duration: 1 }, // Mi, 四分音符
  { pitch: '1', duration: 2 }, // Do, 二分音符
  { pitch: '0', duration: 1 }, // 休止符
  // ... 更多小节 ...
];

const allScores: Score[] = [
  { id: 1, title: '姑苏行', artist: '江先渭', difficulty: '中级', duration: '5:30', key: 'D调', description: '一首著名的竹笛曲...', jianpuData: GUSU_JIANPU_DATA},
];

// 3. 查找当前曲谱 (保持不变)
const currentScore = computed(() => {
  return allScores.find(score => score.id === scoreId.value);
});
// ✨✨✨ 播放状态和逻辑 ✨✨✨
const isPlaying = ref(false);
const currentNoteIndex = ref(-1); // 跟踪当前演奏到哪个音符

let synth: Tone.Synth;
let sequence: Tone.Sequence;

// 辅助函数：将简谱音高 (如 '1', '5', '1^') 转换为 MIDI/Tone.js 频率 (如 'C4')
const jianpuToTonePitch = (pitch: string, key: string) => {
 if (pitch === '0') return null; // 休止符
 
 // 简化：假设 C 调（Key of C），中音区为 4 (C4)
 const map: { [key: string]: string } = {
  '1': 'C', '2': 'D', '3': 'E', '4': 'F', '5': 'G', '6': 'A', '7': 'B'
 };
 
 let octave = 4;
 let basePitch = pitch.replace(/[\.\^]/g, ''); // 移除高低音标记
 
 if (pitch.includes('.')) octave = 3; // 低音点
 if (pitch.includes('^')) octave = 5; // 高音点
 
 return map[basePitch] ? `${map[basePitch]}${octave}` : null;
};

// 初始化 Tone.js 播放器
const setupPlayer = () => {
 if (!currentScore.value || !currentScore.value.jianpuData) return;
 
 // 使用简单的合成器作为竹笛音色（生产环境应使用采样音源）
 synth = new Tone.Synth().toDestination();
 
 // 创建 Sequencer
 sequence = new Tone.Sequence((time, noteObj) => {
 
 // 1. 播放声音
 const tonePitch = jianpuToTonePitch(noteObj.pitch, currentScore.value!.key);
  if (tonePitch) {
  synth.triggerAttackRelease(tonePitch, noteObj.duration, time);
 }
 
 // 2. 同步高亮（更新索引）
 Tone.Draw.schedule(() => {
 currentNoteIndex.value = noteObj.index;
 }, time);
 
}, currentScore.value.jianpuData.map((note, index) => ({...note, index})), '4n'); // '4n' 表示序列步进是四分音符

 sequence.loop = false; // 不循环
 sequence.playbackRate = 1; 
 Tone.Transport.bpm.value = 120; // 速度
};

// 控制函数
const startPlayback = async () => {
 if (Tone.Transport.state === 'stopped') {
 await Tone.start(); // 浏览器可能需要用户交互才能启动 AudioContext
 setupPlayer();
 currentNoteIndex.value = -1; // 重置
 Tone.Transport.start();
 sequence.start(0);
 } else {
 Tone.Transport.toggle(); // 暂停/继续
}
 isPlaying.value = !isPlaying.value;
};

// 组件卸载时停止播放
onUnmounted(() => {
 Tone.Transport.stop();
 sequence?.dispose();
 synth?.dispose();
});

// 初始化播放器（在数据加载后）
onMounted(() => {
 setupPlayer();
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
  <div v-if="currentScore" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
    <section class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
            交互式简谱
        </h2>
        
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner">
            
            <button 
                @click="startPlayback"
                class="mb-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150"
                :class="isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
            >
                <div :class="isPlaying ? 'i-carbon-pause' : 'i-carbon-play'" class="mr-2" />
                {{ isPlaying ? '暂停演奏' : '点击播放' }}
            </button>
            
            <div class="flex flex-wrap text-4xl font-mono justify-start border-t border-b py-4 border-gray-300 dark:border-gray-700">
                
                <span 
                    v-for="(note, index) in currentScore.jianpuData" 
                    :key="index"
                    class="px-3 py-1 m-1 transition-colors duration-100 ease-linear rounded-md"
                    :class="{ 
                        // 同步高亮效果
                        'bg-yellow-300 dark:bg-yellow-700/50': currentNoteIndex === index,
                        // 区分休止符和普通音符
                        'text-gray-400': note.pitch === '0', 
                        'text-gray-800 dark:text-white': note.pitch !== '0'
                    }"
                    :style="{ minWidth: note.duration * 50 + 'px' }" 
                >
                    {{ note.pitch === '0' ? '—' : note.pitch }}
                </span>
                
            </div>
            
            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                当前音符索引: {{ currentNoteIndex }}。简谱的音高和时长是基于 Tone.js 模拟的。
            </p>
        </div>
    </section>
  </div>
</template>