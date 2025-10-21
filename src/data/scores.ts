// src/data/scores.ts
// 核心原则：使用配置数组，确保 ID 和文件名一一对应，标题直接使用文件名，无后缀。

// ----------------------------------------------------
// 1. 数据结构定义
// ----------------------------------------------------
export interface Score {
    id: number;
    title: string;
    imageUrl: string;      // 用于显示曲谱图片的 URL
    audioUrl: string;      // 用于播放音乐的音频文件 URL (e.g., .mp3)
}

// ----------------------------------------------------
// 2. 曲谱配置与文件路径
// ----------------------------------------------------

// 定义曲谱的文件名配置
const SCORE_CONFIGS = [
    { 
        id: 1, 
        fileName: '荒', // 标题和文件名前缀都使用 '荒'
    },
    // 未来添加更多曲谱时，只需添加 id 和 fileName：
    { 
        id: 2, 
        fileName: '成都', 
    },
    { 
        id: 3, 
        fileName: '成都', 
    },
    { 
        id: 4, 
        fileName: '成都', 
    },
    { 
        id: 5, 
        fileName: '成都', 
    },
];

const SCORE_PATH = 'mock/'; // 统一的路径前缀

// ----------------------------------------------------
// 3. 所有曲谱数组 (通过配置生成)
// ----------------------------------------------------

export const allScores: Score[] = SCORE_CONFIGS.map(config => ({
    id: config.id,
    title: config.fileName, // ✨ 标题直接等于文件名，无后缀
    imageUrl: `${SCORE_PATH}${config.fileName}.png`,
    audioUrl: `${SCORE_PATH}${config.fileName}.mp3`,
}));
export const latestThreeScores: Score[] = allScores
    .slice(-3) // 从数组末尾截取最后三个元素 (即 ID最大的三个)
    .reverse(); // 反转顺序，让最新的曲谱显示在列表最前面
