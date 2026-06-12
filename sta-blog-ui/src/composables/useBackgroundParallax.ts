/**
 * useBackgroundParallax — 背景视差滚动层状态管理
 * 控制背景图片 URL、header 偏移量
 */
import { ref } from 'vue';

/** 画布 header 偏移量（px）。页面 header 写入 → 背景视差层据此计算初始偏移 */
const canvasHeaderH = ref(0);

/** 背景图片 URL。空字符串 = 使用主题变量纯色背景 */
const canvasImageUrl = ref('');

export function useBackgroundParallax() {
  function setHeaderH(h: number) {
    canvasHeaderH.value = h;
  }

  function setImageUrl(url: string) {
    canvasImageUrl.value = url;
  }

  return {
    canvasHeaderH,
    canvasImageUrl,
    setHeaderH,
    setImageUrl,
  };
}
