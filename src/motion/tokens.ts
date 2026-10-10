export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: { feedback: 0.18, reveal: 0.8, chapter: 1.2, card: 0.85 },
  stagger: 0.065,
  blur: 7,
  distance: 18,
};

// CSS 层级与这里一致：正文 0，固定页眉 10，阅读进度 11，原生 dialog 顶层。
export const layers = { content: 0, navigation: 10, progress: 11 };
