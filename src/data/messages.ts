export interface ClassMessage {
  id: string;
  content: string;
  author?: string;
  date?: string;
  order: number;
  approved: boolean;
}

// 收集到真实留言、得到公开许可并审核后再加入。
// 本地草稿不会进入这个数组，不会自动发布。
export const messages: ClassMessage[] = [];
