// src/data/scores.ts

// ----------------------------------------------------
// 1. 数据结构定义
// ----------------------------------------------------
export interface Score {
    id: number;
    title: string;
    artist: string;
    difficulty: '初级' | '中级' | '高级';
    duration: string;
    key: string;
    description: string;
    jianpuData: { // 简谱数据结构
        pitch: string; // 简谱音高 (如 '5', '6.', '1^' - 高音)
        duration: number; // 时长 (Tone.js 格式，如 0.5 为八分音符，1 为四分音符)
    }[];
}

// ----------------------------------------------------
// 2. 简谱数据定义
// ----------------------------------------------------
const GUSU_JIANPU_DATA: Score['jianpuData'] = [
    // 简谱 '姑苏行' 简单开头，C调 4/4 拍。
    { pitch: '5', duration: 1 }, 
    { pitch: '6', duration: 0.5 }, 
    { pitch: '5', duration: 0.5 }, 
    { pitch: '3', duration: 1 }, 
    { pitch: '1', duration: 2 }, 
    { pitch: '0', duration: 1 }, 
];

const SONG_OF_PEACE_DATA: Score['jianpuData'] = [
    // 假设的第二首曲子数据
    { pitch: '1', duration: 1 }, 
    { pitch: '2', duration: 1 }, 
    { pitch: '3', duration: 1 }, 
    { pitch: '5', duration: 1 }, 
    { pitch: '3', duration: 1 }, 
    { pitch: '2', duration: 1 }, 
    { pitch: '1', duration: 2 }, 
];


// ----------------------------------------------------
// 3. 所有曲谱数组
// ----------------------------------------------------
export const allScores: Score[] = [
    { 
        id: 1, 
        title: '姑苏行', 
        artist: '江先渭', 
        difficulty: '中级', 
        duration: '5:30', 
        key: 'D调', 
        description: '一首著名的竹笛曲...', 
        jianpuData: GUSU_JIANPU_DATA
    },
    { 
        id: 2, 
        title: '和平之歌', 
        artist: '佚名', 
        difficulty: '初级', 
        duration: '2:30', 
        key: 'C调', 
        description: '一首简单的练习曲。', 
        jianpuData: SONG_OF_PEACE_DATA
    },
];