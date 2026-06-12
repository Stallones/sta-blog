import { useFloatingMenu } from "@/composables/useFloatingMenu";

/**
 * 注册全局功能项（在 Layout 挂载时调用一次）
 * 这些功能项在所有页面都默认展示（收起状态可见）
 */
export function registerGlobalItems() {
  const { registerItem } = useFloatingMenu();

  // ═══ 始终显示（全局）═══

  // 设置按钮（触发展开）— 最顶部
  registerItem({ id: "settings", global: true, order: 100 });

  // 亮暗色切换
  registerItem({ id: "colorMode", global: true, order: 200 });

  // 百分比 + ToTop 合并按钮 — 最底部
  registerItem({ id: "scrollPercentage", global: true, order: 300 });

  // 侧边栏隐藏
  registerItem({ id: "sidebarHide", global: false, order: 50 });
}

/**
 * 注册首页独有功能项（在首页挂载时调用）
 */
export function registerHomeItems() {
  const { registerItem } = useFloatingMenu();
  registerItem({ id: "galleryLayout", global: false, order: -10 });
}

export function unregisterHomeItems() {
  const { unregisterItem } = useFloatingMenu();
  unregisterItem("galleryLayout");
}

/**
 * 注册文章页独有功能项（在文章页挂载时调用）
 */
export function registerArticleItems() {
  const { registerItem } = useFloatingMenu();
  registerItem({ id: "readingMode", global: false, order: -20 });
  registerItem({ id: "toComment", global: false, order: -10 });
  // 目录抽屉按钮（always 列表，仅文章页注册，≤900px 时显示）
  registerItem({ id: "catalogDrawer", global: true, order: 110 });
}

/**
 * 注销文章页独有功能项（离开文章页时调用）
 */
export function unregisterArticleItems() {
  const { unregisterItem } = useFloatingMenu();

  unregisterItem("readingMode");
  unregisterItem("toComment");
  unregisterItem("catalogDrawer");
}
