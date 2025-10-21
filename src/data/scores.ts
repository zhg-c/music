// src/data/scores.ts
// 核心原则：数据结构简化，使用 imageUrl 显示曲谱，使用 audioUrl 播放音频。

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
    imageUrl: string;      // 用于显示曲谱图片的 URL
    audioUrl: string;      // ✨ 新增：用于播放音乐的音频文件 URL (e.g., .mp3)
}

// ----------------------------------------------------
// 2. 所有曲谱数组
// ----------------------------------------------------
export const allScores: Score[] = [
    { 
        id: 1, 
        title: '荒 (最终版)', 
        artist: '橙光/Tureleo', 
        difficulty: '高级', 
        duration: '3:50', 
        key: 'D调 (4/4 拍)', 
        description: '使用图片显示曲谱，使用外部音频文件播放音乐。', 
        imageUrl: 'mock/荒.png', 
        audioUrl: 'mock/荒.mp3', // 假设音频在 assets 目录
    },
];