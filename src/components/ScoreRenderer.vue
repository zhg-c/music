<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Stave, StaveNote, Renderer, Formatter, Voice } from 'vexflow';

const props = defineProps<{
  musicData: any[]; // VexFlow 格式的音符数组
  containerId: string;
}>();

const scoreContainer = ref<HTMLDivElement | null>(null);

// 配置常量
const STAVE_WIDTH = 780;      // 每行五线谱的宽度
const STAVE_HEIGHT = 100;     // 每行五线谱的高度
const STAVE_X = 10;           // 起始 X 坐标
const STAVE_Y_SPACING = 100;  // 每行之间的 Y 间隔
const BEATS_PER_MEASURE = 4;  // 每小节的拍数 (4/4 拍)

// 辅助函数：将音符数据分割成固定数量小节的块
const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};


watchEffect(() => {
  if (scoreContainer.value && props.musicData && props.musicData.length > 0) {
    const container = scoreContainer.value;
    container.innerHTML = ''; 

    // 1. 计算总拍数并确定每行小节数（简化：假设每 4 个音符为一个小节，每行 4 小节）
    const totalMeasures = Math.ceil(props.musicData.length / BEATS_PER_MEASURE);
    const measuresPerLine = 4; 
    
    // 假设每个音符都是四分音符 (q)，计算每行需要的音符数量
    const notesPerLine = BEATS_PER_MEASURE * measuresPerLine;

    // 将所有音符数据分割成行
    const scoreLines = chunkArray(props.musicData, notesPerLine);
    
    // 计算总高度
    const totalHeight = scoreLines.length * STAVE_Y_SPACING + 50; 
    
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(800, totalHeight); // 动态调整画布大小
    const context = renderer.getContext();

    let currentY = 0; // 追踪当前的 Y 坐标

    scoreLines.forEach((lineNotes, lineIndex) => {
        // 2. 创建一个 Voice 数组来容纳每行的所有小节
        const voices: Voice[] = [];
        
        // 3. 将当前行的音符分割成小节
        const measureNotes = chunkArray(lineNotes, BEATS_PER_MEASURE); // 假设每 4 个音符一个节拍

        measureNotes.forEach((notesInMeasure, measureIndex) => {
            // 计算当前小节的 X 位置
            const staveX = STAVE_X + (STAVE_WIDTH / measuresPerLine) * measureIndex;
            const staveWidth = STAVE_WIDTH / measuresPerLine;
            
            // 4. 创建五线谱行 (Stave)
            const stave = new Stave(staveX, currentY, staveWidth);
            
            // 只有第一行或每行第一个小节才显示谱号和拍号
            if (lineIndex === 0 && measureIndex === 0) {
                stave.addClef("treble").addTimeSignature("4/4");
            } else if (measureIndex === 0 && lineIndex !== 0) {
                // 后续行的第一个小节也需要 Clef 
                stave.addClef("treble");
            }
            
            stave.setContext(context).draw();

            // 5. 转换音乐数据为 VexFlow Note 对象
            const notes = notesInMeasure.map(note => {
                return new StaveNote({
                    keys: note.keys,
                    duration: note.duration,
                    stemDirection: note.stemDirection 
                });
            });

            // 6. 组合成声部和格式化
            const voice = new Voice({ numBeats: BEATS_PER_MEASURE, beatValue: 4 }).addTickables(notes);
            voices.push(voice);
        });

        // 7. 格式化和渲染整行
        if (voices.length > 0) {
            // 需要格式化所有 voice，并分配宽度
            const formatter = new Formatter();
            const totalWidth = STAVE_WIDTH * voices.length / measuresPerLine;
            formatter.joinVoices(voices).format(voices, totalWidth);
            
            voices.forEach(voice => {
                voice.draw(context, voice.getStave());
            });
        }
        
        // 8. 移动到下一行的 Y 坐标
        currentY += STAVE_Y_SPACING;
    });
  }
}, { flush: 'post' });
</script>

<template>
  <div :id="props.containerId" ref="scoreContainer" class="overflow-x-auto">
    <div v-if="!props.musicData || props.musicData.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
        无曲谱数据可供渲染。
    </div>
  </div>
</template>