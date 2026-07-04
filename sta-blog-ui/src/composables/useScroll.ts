import { scrollToTop as _scrollToTop, scrollToBottom as _scrollToBottom, scrollToMainShell as _scrollToMainShell } from "@/utils/scroll";

/**
 * 全局滚动控制 composable
 * 所有滚动行为统一由此提供，组件直接调用，不套方法
 */
export function useScroll() {
  return {
    scrollToTop: _scrollToTop,
    scrollToBottom: _scrollToBottom,
    scrollToMainShell: _scrollToMainShell,
  };
}
