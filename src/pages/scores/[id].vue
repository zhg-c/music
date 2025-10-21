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

let synth: Tone.AMSynth | undefined;
let sequence: Tone.Sequence | undefined;
let transport: Tone.Transport | undefined; // 使用 Transport 规范管理时钟

// ----------------------------------------------------
// 3. 数据处理
// ----------------------------------------------------

const BEATS_PER_MEASURE = 4; // 拍号：4/4 拍

const groupJianpuByMeasure = (data: Score['jianpuData']): any[][] => {
    let currentBeatCount = 0;
    const measures: any[][] = [];
    let currentMeasure: any[] = [];
    const totalNotes = data.length;

    data.forEach((note, index) => {
        // 检查是否是新小节的开始 (当拍数计数为0时)
        // 且防止在第一个音符前插入小节线
        if (currentBeatCount === 0 && currentMeasure.length > 0) {
            measures.push(currentMeasure); // 结束前一个小节
            currentMeasure = [];          // 开始新小节
        } 

        // 添加音符到当前小节，并添加原始索引
        const isSongEnd = (index === totalNotes - 1);
        currentMeasure.push({ ...note, index: index, isSongEnd });
        
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

// 原始音符数据（用于播放 Sequence，但我们现在从 groupedJianpu 中提取）
const rawJianpuData = computed(() => {
    // 拍平分组数据，确保播放序列是正确的
    return groupedJianpu.value.flat();
});


// ----------------------------------------------------
// 4. Tone.js 核心逻辑
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
    if (!currentScore.value) return;
    
    // 清理旧实例
    sequence?.dispose();
    synth?.dispose();

    // 1. 获取 Transport
    transport = Tone.getTransport();
    transport.bpm.value = 120;
    transport.loop = false;
    
    // 2. 创建 Synth (使用 AM Synth)
    synth = new Tone.AMSynth({
        // 使用更简单的配置，避免过度冗余
        oscillator: { type: "fatsawtooth" }, 
    }).toDestination();
    
    // 3. 创建 Sequencer
    sequence = new Tone.Sequence((time, noteObj) => {
        
        // 播放声音
        const tonePitch = jianpuToTonePitch(noteObj.pitch);
        const toneDuration = toneDurationMap[noteObj.duration] || '4n'; 
        if (tonePitch) {
            synth?.triggerAttackRelease(tonePitch, toneDuration, time);
        }
        
        // 同步高亮 (使用 Tone.Draw 保证与 Web Audio 时间对齐)
        Tone.Draw.schedule(() => {
            currentNoteIndex.value = noteObj.index;
        }, time);
        
    }, rawJianpuData.value, '4n');

    // 4. 安排 Sequence 从 Transport 0 时刻开始
    sequence.start(0);
    
    // 5. 监听 Transport 停止事件，重置状态
    transport.off("stop"); // 确保只注册一次监听器
    transport.on("stop", () => {
        // 只有当 Transport 停止时才重置状态
        Tone.Draw.schedule(() => {
            isPlaying.value = false;
            currentNoteIndex.value = -1; 
        }, Tone.now());
    });
};

// 控制函数 (启动/暂停)
const startPlayback = async () => {
    if (!currentScore.value || rawJianpuData.value.length === 0) return;

    if (transport?.state === 'stopped') {
        // 1. 遵循规范：用户交互时启动 AudioContext
        await Tone.start(); 
        
        // 2. 首次播放或重置时，重新初始化播放器
        setupPlayer(); 

        // 3. 修复第一个音符播放问题：手动触发第一个音符和高亮
        const firstNote = rawJianpuData.value[0];
        currentNoteIndex.value = 0; 
        
        const tonePitch = jianpuToTonePitch(firstNote.pitch);
        const toneDuration = toneDurationMap[firstNote.duration] || '4n'; 

        if (tonePitch && synth) {
            // 使用 Tone.now() 确保声音在当前的 AudioContext 时间开始
            synth.triggerAttackRelease(tonePitch, toneDuration, Tone.now());
        }

        // 4. 启动 Transport (Sequence 已经安排在 Transport 0 时刻开始)
        transport?.start();

    } else {
        // 暂停/继续
        transport?.toggle(); 
    }
    
    // 更新播放状态
    isPlaying.value = transport?.state === 'started';
};

// 组件卸载时停止播放并清理资源
onUnmounted(() => {
    Tone.getTransport().stop(); // 确保 Transport 停止
    Tone.getTransport().off("stop"); // 移除事件监听
    sequence?.dispose();
    synth?.dispose();
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

                            <div class="flex w-64 justify-between items-end py-1 h-24"> 
                                
                                <div 
                                    v-for="(note, noteIndex) in measure" 
                                    :key="note.index"
                                    class="flex flex-col items-center justify-end relative"
                                    
                                    :style="{ 
                                        // 关键修正：将音符宽度设置为固定小节宽度的分数
                                        width: (note.duration / BEATS_PER_MEASURE) * 100 + '%'
                                    }"
                                >
                                    <div v-if="note.pitch.includes('.') && note.pitch !== '0'" 
                                         class="text-xl font-extrabold text-gray-800 dark:text-white order-2" 
                                         style="margin-bottom: -0.4rem;">
                                        .
                                    </div>

                                    <span
                                        class="px-1 py-1 transition-colors duration-100 ease-linear rounded-md select-none text-center text-4xl font-extrabold order-1"
                                        :class="{ 
                                            // 高亮
                                            'bg-yellow-300 dark:bg-yellow-700/50': currentNoteIndex === note.index, 
                                            // 区分休止符和普通音符
                                            'text-gray-400': note.pitch === '0', 
                                            'text-gray-800 dark:text-white': note.pitch !== '0'
                                        }"
                                    >
                                        {{ note.pitch.replace(/[\.\^]/g, '') === '0' ? '—' : note.pitch.replace(/[\.\^]/g, '') }}
                                    </span>

                                    <div v-if="note.pitch.includes('^') && note.pitch !== '0'" 
                                         class="text-xl font-extrabold text-gray-800 dark:text-white order-0" 
                                         style="margin-top: -0.4rem;">
                                        ·
                                    </div>
                                    
                                    <span v-if="note.lyric && note.pitch !== '0'" 
                                          class="text-base font-sans text-gray-700 dark:text-gray-300 mt-2 whitespace-nowrap order-3">
                                        {{ note.lyric }}
                                    </span>


                                    <template v-if="note.duration === 0.5 && note.pitch !== '0'">
                                        <div 
                                            class="absolute bottom-0 h-0.5 bg-gray-800 dark:bg-white z-10"
                                            :style="{ 
                                                width: '120%', 
                                                bottom: '12px', /* 调整位置使其不遮挡歌词 */
                                            }"
                                        ></div>
                                    </template>
                                </div>
                            </div>

                            <span v-if="measure[measure.length - 1].isSongEnd" class="text-gray-500 mx-2 select-none self-center h-full">
                                ||
                            </span>

                        </template>
                        
                    </div>
                    
                    <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        当前播放速度: {{ transport?.bpm.value || 120 }} BPM。音符高亮与演奏同步。
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