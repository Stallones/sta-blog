import { ref, onMounted, onUnmounted } from "vue";
import { throttle } from "@/utils/optimize";

/**
 * 阅读进度 composable
 * - 提供响应式 scrollPercentage（0~100 百分比数字）
 * - 提供 applyToProgressBar() 将进度应用到指定选择器的 DOM 元素宽度
 * - 自动在 onUnmounted 时移除 scroll 监听
 *
 * 用法:
 *   const { scrollPercentage, applyToProgressBar } = useReadingProgress()
 *   applyToProgressBar('.progress')  // 自动将进度写入 .progress 元素的 width
 */
export function useReadingProgress(selector?: string) {
  const scrollPercentage = ref(0);

  function scrollWork() {
    const pageHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const screenHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    const scrollHeight = pageHeight - screenHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollPercentage.value = Math.min(100, Math.max(0, percent));

    // 如果指定了 selector，同步写入 DOM 元素的 width
    if (selector) {
      const el: HTMLElement | null = document.querySelector(selector);
      if (el) {
        el.style.width = scrollPercentage.value + "%";
      }
    }
  }

  const throttledScroll = throttle(() => {
    window.requestAnimationFrame(scrollWork);
  }, 40);

  onMounted(() => {
    window.addEventListener("scroll", throttledScroll);
    // 初始计算一次
    scrollWork();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", throttledScroll);
  });

  return { scrollPercentage };
}
