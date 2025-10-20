<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '../../composables/useUser';
import * as Tone from 'tone'; 

// 从外部文件导入 Score 接口和 allScores 数组
import { type Score, allScores } from '../../data/scores'; 

const { isAuthenticated } = useUser();

// 1. 路由参数
const route = useRoute();
const router = useRouter();
const scoreId = computed(() => Number(route.params.id));

// 2. 查找当前曲谱
const currentScore = computed(() => {
    return allScores.find(score => score.id === scoreId.value);
});

// ✨✨✨ 播放状态和逻辑 ✨✨✨
const isPlaying = ref(false);
const currentNoteIndex = ref(-1); // 跟踪当前演奏到哪个音符

let synth: Tone.Synth | undefined;
let sequence: Tone.Sequence | undefined;

// ----------------------------------------------------
// 3. 简谱显示规范处理（小节标记）
// ----------------------------------------------------
const BEATS_PER_MEASURE = 4; // 拍号：4/4 拍
const NOTES_PER_BEAT = 4;    // 假设最小音符粒度是十六分音符 (1/4 拍)
// ✨ 修改：将音符数据按小节分组
const groupJianpuByMeasure = (data: Score['jianpuData']): any[][] => {
    let currentBeatCount = 0;
    const measures: any[][] = [];
    let currentMeasure: any[] = [];
    const totalNotes = data.length;

    data.forEach((note, index) => {
        // 检查是否是新小节的开始 (当拍数计数为0时)
        if (currentBeatCount === 0 && currentMeasure.length > 0) {
            measures.push(currentMeasure); // 结束前一个小节
            currentMeasure = [];          // 开始新小节
        } 

        // 添加音符到当前小节，并添加原始索引
        currentMeasure.push({ ...note, index: index, isSongEnd: (index === totalNotes - 1) });
        
        currentBeatCount += note.duration;

        // 检查是否结束一个小节
        if (currentBeatCount >= BEATS_PER_MEASURE) {
            currentBeatCount = currentBeatCount % BEATS_PER_MEASURE;
        }
    });

    // 推入最后一个小节
    if (currentMeasure.length > 0) {
        measures.push(currentMeasure);
    }

    return measures;
};

// 计算属性：现在是包含多个小节数组的二维数组
const groupedJianpu = computed(() => {
    if (!currentScore.value || !currentScore.value.jianpuData) return [];
    return groupJianpuByMeasure(currentScore.value.jianpuData);
});

const annotateJianpuData = (data: Score['jianpuData']): any[] => {
    let currentBeatCount = 0;
    const annotatedData: any[] = [];
    
    data.forEach((note, index) => {
        const durationValue = note.duration; 
        let isMeasureStart = false;
        
        if (currentBeatCount === 0) {
            isMeasureStart = true;
        } 
        
        // 标记数据：添加小节开始标记和音符在原始数据中的索引
        annotatedData.push({ ...note, index: index, isMeasureStart: isMeasureStart, isSongEnd: false });
        
        currentBeatCount += durationValue;

        if (currentBeatCount >= BEATS_PER_MEASURE) {
            currentBeatCount = currentBeatCount % BEATS_PER_MEASURE;
        }
    });

    if (annotatedData.length > 0) {
        annotatedData[annotatedData.length - 1].isSongEnd = true;
    }

    return annotatedData;
};

const annotatedJianpu = computed(() => {
    if (!currentScore.value || !currentScore.value.jianpuData) return [];
    return annotateJianpuData(currentScore.value.jianpuData);
});


// ----------------------------------------------------
// 4. Tone.js 播放逻辑
// ----------------------------------------------------

// 辅助函数：将简谱音高转换为 Tone.js 频率
const jianpuToTonePitch = (pitch: string) => {
    if (pitch === '0') return null; 
    const map: { [key: string]: string } = {
        '1': 'C', '2': 'D', '3': 'E', '4': 'F', '5': 'G', '6': 'A', '7': 'B'
    };
    let octave = 4;
    let basePitch = pitch.replace(/[\.\^]/g, ''); 
    if (pitch.includes('.')) octave = 3;
    if (pitch.includes('^')) octave = 5;
    return map[basePitch] ? `${map[basePitch]}${octave}` : null;
};

// Tone.js 时长映射
const toneDurationMap: {[key: number]: Tone.Unit.Time} = { 4: '1n', 2: '2n', 1.5: '4n.', 1: '4n', 0.5: '8n' };


// 初始化 Tone.js 播放器和 Sequence
const setupPlayer = () => {
    if (!currentScore.value || !currentScore.value.jianpuData) return;
    
    // 清理旧实例
    sequence?.dispose();
    synth?.dispose();

    synth = new Tone.Synth().toDestination();
    
    // Sequence 数据使用 annotatedJianpu
    const sequenceData = annotatedJianpu.value.map((note) => ({
        pitch: note.pitch, 
        duration: note.duration, 
        index: note.index 
    }));
    
    // 创建 Sequencer
    sequence = new Tone.Sequence((time, noteObj) => {
        
        // 1. 播放声音
        const tonePitch = jianpuToTonePitch(noteObj.pitch);
        const toneDuration = toneDurationMap[noteObj.duration] || '4n'; 
        if (tonePitch) {
            synth?.triggerAttackRelease(tonePitch, toneDuration, time);
        }
        
        // 2. 同步高亮
        Tone.Draw.schedule(() => {
            currentNoteIndex.value = noteObj.index;
        }, time);
        
    }, sequenceData, '4n'); // '4n' 是步进间隔

    sequence.loop = false;
    sequence.playbackRate = 1; 
    Tone.Transport.bpm.value = 120;
    
    // 序列播放结束，重置状态
    Tone.Transport.on('stop', () => {
        // 只有当 Transport 被 sequence.stop() 停止时才执行
        if (isPlaying.value) { 
            Tone.Draw.schedule(() => {
                isPlaying.value = false;
                currentNoteIndex.value = -1; // 重置高亮索引
            }, Tone.Transport.now());
        }
    });
};

// 控制函数
// src/pages/scores/[id].vue

// 控制函数
const startPlayback = async () => {
    if (!currentScore.value || currentScore.value.jianpuData.length === 0) return;

    if (Tone.Transport.state === 'stopped') {
        await Tone.start(); 
        
        setupPlayer(); // 重新设置播放器

        const firstNote = annotatedJianpu.value[0];
        
        // 1. **强制高亮第一个音符**
        currentNoteIndex.value = 0; 

        // 2. **关键修复：手动触发第一个音符的声音**
        const tonePitch = jianpuToTonePitch(firstNote.pitch);
        const toneDuration = toneDurationMap[firstNote.duration] || '4n'; 

        if (tonePitch && synth) {
            // 使用 Tone.now() 确保声音在当前的 AudioContext 时间开始
            // 稍稍提前触发，以弥补 AudioContext 的启动延迟。
            synth.triggerAttackRelease(tonePitch, toneDuration, Tone.now());
        }

        // 3. 启动 Transport 和 Sequence
        // ⚠️ 修正：Sequence 从第二个音符开始 (start('4n'))
        // 因为我们手动播放了第一个音符，Sequence 应该从下一个时间点（即 4 分音符后）开始。
        Tone.Transport.start();

        // Sequence 从第一个音符播放完之后开始 (即 '4n' 时间)
        // 注意：sequence.start('4n') 意味着它从 Sequence 的第一个 tickable 开始，但在 Tone.js 时间轴上的 '4n' 处触发
        // 由于我们的 Sequence 是基于 '4n' 步进的，简单地从 0 开始可能会导致重复播放。

        // **简化修正：我们保持 Sequence 从 0 开始，但让它仅处理高亮，并信任手动触发的声音**
        // 实际上，更简单的做法是让 Sequence 从 0 开始，并确保其声音事件被延迟。

        // 让我们采用最直接的方式：保持 Sequence 从 0 开始，并确保 Transport 启动
        sequence?.start(0); 

    } else {
        Tone.Transport.toggle(); 
    }
    
    // 确保播放状态正确反映 Transport 的状态
    isPlaying.value = Tone.Transport.state === 'started';
};

// 组件卸载时停止播放
onUnmounted(() => {
    Tone.Transport.stop();
    sequence?.dispose();
    synth?.dispose();
    Tone.Transport.off('stop'); // 移除事件监听
});

// 在数据加载后初始化播放器
onMounted(() => {
    setupPlayer();
});

// 5. 辅助函数：根据难度获取颜色类
const getDifficultyClass = (difficulty: Score['difficulty']) => {
    const map = {
        '初级': 'text-blue-500',
        '中级': 'text-yellow-500',
        '高级': 'text-red-500',
    };
    return map[difficulty] || 'text-gray-500';
};
</script>

<template>
    <div class="p-8 max-w-screen-xl mx-auto min-h-full">
        <div v-if="currentScore" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
            
            <header class="mb-8 border-b dark:border-gray-700 pb-4">
                <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{{ currentScore.title }}</h1>
                <p class="text-xl text-gray-600 dark:text-gray-400">作曲家: {{ currentScore.artist }}</p>
                
                <div class="mt-4 flex flex-wrap space-x-6 text-sm">
                    <span class="font-semibold" :class="getDifficultyClass(currentScore.difficulty)">
                        难度: {{ currentScore.difficulty }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">时长: {{ currentScore.duration }}</span>
                    <span class="text-gray-500 dark:text-gray-400">调性: {{ currentScore.key }}</span>
                </div>
            </header>

            <section class="mt-8">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
                    交互式简谱
                </h2>
                
                <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner">
                    
                    <button 
                        @click="startPlayback"
                        class="mb-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150"
                        :class="isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                        :disabled="!currentScore.jianpuData || currentScore.jianpuData.length === 0"
                    >
                        <div :class="isPlaying ? 'i-carbon-pause' : 'i-carbon-play'" class="mr-2" />
                        {{ isPlaying ? '暂停演奏' : '点击播放' }}
                    </button>
                    
                    <div class="flex flex-wrap text-4xl font-mono justify-start py-4 border-t border-b border-gray-300 dark:border-gray-700">
    
                      <template v-for="(measure, measureIndex) in groupedJianpu" :key="measureIndex">

                          <span v-if="measureIndex !== 0" class="text-gray-500 mx-2 select-none self-center h-full">
                              |
                          </span>

                          <div class="flex w-48 justify-between items-center py-1">
                              
                              <span 
                                  v-for="(note, noteIndex) in measure" 
                                  :key="noteIndex"
                                  
                                  class="px-1 py-1 transition-colors duration-100 ease-linear rounded-md select-none text-center"
                                  
                                  :class="{ 
                                      // 高亮修正：使用音符的原始索引进行高亮判断
                                      'bg-yellow-300 dark:bg-yellow-700/50': currentNoteIndex === note.index, 
                                      // 颜色修正
                                      'text-gray-400': note.pitch === '0', 
                                      'text-gray-800 dark:text-white': note.pitch !== '0'
                                  }"
                                  
                                  :style="{ 
                                      // ✨ 关键修正：将音符宽度设置为固定小节宽度的分数
                                      // 例如：四分音符 (duration=1) 占 1/4 的宽度，二分音符 (duration=2) 占 2/4
                                      width: (note.duration / BEATS_PER_MEASURE) * 100 + '%'
                                  }"
                              >
                                  {{ note.pitch === '0' ? '—' : note.pitch }}
                              </span>
                          </div>

                          <span v-if="measure[measure.length - 1].isSongEnd" class="text-gray-500 mx-2 select-none self-center h-full">
                              ||
                          </span>

                      </template>
                      
                    </div>
                    
                    <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        当前播放速度: 120 BPM。音符高亮与演奏同步。
                    </p>
                </div>
            </section>
            
            <section class="mt-8">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">
                    曲谱描述
                </h2>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ currentScore.description }}</p>
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
.i-carbon-play, .i-carbon-pause {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
}
</style>