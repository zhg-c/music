// src/data/scores.ts
// 核心原则：只包含一个曲谱，ID 永远为 1。

// ----------------------------------------------------
// 1. 数据结构定义
// ----------------------------------------------------
export interface NoteData {
    pitch: string;      // 简谱音高 (如 '5', '6.', '1^' - 高音, '6.' - 低音)
    duration: number;   // 时长 (Tone.js 格式，1 为四分音符, 0.5 为八分音符)
    lyric?: string;     // 歌词 (可选，用于排版对齐)
}

export interface Score {
    id: number;
    title: string;
    artist: string;
    difficulty: '初级' | '中级' | '高级';
    duration: string;
    key: string;
    description: string;
    jianpuData: NoteData[];
}

// ----------------------------------------------------
// 2. 简谱数据定义 (排排坐，吃果果 - C调 4/4 拍)
// ----------------------------------------------------
const PAIPAIZUO_JIANPU_DATA: NoteData[] = [
    // 小节 1: | 1 1 2 - | (排 排 坐，-)
    { pitch: '1', duration: 1, lyric: '排' }, 
    { pitch: '1', duration: 1, lyric: '排' }, 
    { pitch: '2', duration: 1, lyric: '坐' }, 
    { pitch: '0', duration: 1, lyric: '，' }, // 休止符也需要占据时值

    // 小节 2: | 3 3 2 - | (吃 果 果，-)
    { pitch: '3', duration: 1, lyric: '吃' },
    { pitch: '3', duration: 1, lyric: '果' },
    { pitch: '2', duration: 1, lyric: '果' },
    { pitch: '0', duration: 1, lyric: '，' }, 

    // 小节 3: | 5 5 3 1 | (幼 儿 园 里)
    { pitch: '5', duration: 1, lyric: '幼' },
    { pitch: '5', duration: 1, lyric: '儿' },
    { pitch: '3', duration: 1, lyric: '园' },
    { pitch: '1', duration: 1, lyric: '里' },

    // 小节 4: | 2 3 2 - | (朋 友 多，-)
    { pitch: '2', duration: 1, lyric: '朋' },
    { pitch: '3', duration: 1, lyric: '友' },
    { pitch: '2', duration: 1, lyric: '多' },
    { pitch: '0', duration: 1, lyric: '，' }, 
    
    // 小节 5: | 3 3 2 - | (朋 友 多，-)
    { pitch: '3', duration: 1, lyric: '朋' },
    { pitch: '3', duration: 1, lyric: '友' },
    { pitch: '2', duration: 1, lyric: '多' },
    { pitch: '0', duration: 1, lyric: '，' }, 

    // 小节 6: | 6, 1 2 - | (来 唱 歌，-)
    { pitch: '6.', duration: 1, lyric: '来' }, // 低音 6
    { pitch: '1', duration: 1, lyric: '唱' },
    { pitch: '2', duration: 1, lyric: '歌' },
    { pitch: '0', duration: 1, lyric: '，' }, 

    // 小节 7: | 5 5 3 1 | (唱 起 歌 来)
    { pitch: '5', duration: 1, lyric: '唱' },
    { pitch: '5', duration: 1, lyric: '起' },
    { pitch: '3', duration: 1, lyric: '歌' },
    { pitch: '1', duration: 1, lyric: '来' },

    // 小节 8: | 2 3 1 - || (多 快 活。-)
    { pitch: '2', duration: 1, lyric: '多' },
    { pitch: '3', duration: 1, lyric: '快' },
    { pitch: '1', duration: 1, lyric: '活' },
    { pitch: '0', duration: 1, lyric: '。' }, 
];


// ----------------------------------------------------
// 3. 唯一的曲谱数组 (ID=1)
// ----------------------------------------------------
export const allScores: Score[] = [
    { 
        id: 1, // 永远是 ID 1
        title: '排排坐，吃果果 (最终版本)', 
        artist: '儿歌', 
        difficulty: '初级', 
        duration: '1:30', 
        key: 'C调 (4/4 拍)', 
        description: '集成了小节、歌词、播放和高亮的最终版本。', 
        jianpuData: PAIPAIZUO_JIANPU_DATA
    },
];