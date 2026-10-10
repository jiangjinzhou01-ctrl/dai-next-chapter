export interface Memory {
  id: string;
  title: string;
  body: string;
  date?: string;
  photo?: string; // public 下的相对路径，如 media/class-photo.webp
  caption?: string;
  alt?: string;
  consent: boolean; // 涉及人物的信息与照片，取得授权后才设为 true
  order: number;
}

// 无真实资料时保持空数组，不用示例故事冒充真实经历。
export const timeline: Memory[] = [];
export const photos: Memory[] = [
  {
    id: 'classroom-2026-10-10',
    title: '教室里的这一刻',
    body: '',
    date: '2026-10-10',
    photo: 'media/classroom-2026-10-10.jpg',
    caption: '2026 年 10 月 10 日的教室照片',
    alt: '教室内，同学们坐在课桌旁，前方是黑板和讲台。',
    consent: false, // 取得照片中相关人员的公开展示同意后，再加入 public/media 并改为 true。
    order: 0,
  },
];
export const stories: Memory[] = [];
export const fragments: Memory[] = [];
