/**
 * 全局统一滚动工具函数
 * 所有平滑滚动行为都应通过这些函数，保证行为一致
 */

/** 平滑滚动到页面顶部（scrollTop = 0） */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** 平滑滚动到页面底部 */
export function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
}

/**
 * 平滑滚动到 .main-shell 元素顶部（Header 下边界）
 * 用于分页切换后定位到内容区起始位置
 */
export function scrollToMainShell() {
  const el = document.querySelector(".main-shell");
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}
