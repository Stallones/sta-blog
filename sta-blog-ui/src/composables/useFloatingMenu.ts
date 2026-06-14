import { ref } from "vue";

// ── 功能项类型 ──
export interface FloatingMenuItem {
  /** 唯一标识 */
  id: string;
  /** 全局项：始终默认展示；独有项：需点击「设置」展开 */
  global: boolean;
  /** 渲染顺序，越小越靠上 */
  order: number;
}

// ── 已注册的功能项列表 ──
const registeredItems = ref<FloatingMenuItem[]>([]);

// ── 展开状态（设置按钮控制）──
const isExpanded = ref(false);

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

// ── 滚动隐藏状态（scrollTop≈0 时整组菜单右滑隐藏）──
// 独立于 isExpanded，两者互不覆盖
const hiddenByScroll = ref(false);

function setHiddenByScroll(val: boolean) {
  hiddenByScroll.value = val;
}

// ── 侧边栏显隐状态（FloatingMenu 按钮控制）──
// 独立于 isExpanded，两者互不覆盖
const sidebarVisible = ref(true);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}

// ── 目录 Popover 状态（文章页 FloatingMenu 按钮控制）──
const catalogPopoverVisible = ref(true);

function toggleCatalogPopover() {
  catalogPopoverVisible.value = !catalogPopoverVisible.value;
}

// ── 目录所需上下文（Article 页挂载时设置）──
const catalogEditorId = ref("");
const catalogScrollElement = ref<HTMLElement | null>(null);

function setCatalogContext(editorId: string, scrollEl: HTMLElement) {
  catalogEditorId.value = editorId;
  catalogScrollElement.value = scrollEl;
}

// ── 注册/注销功能项 ──
function registerItem(item: FloatingMenuItem) {
  if (registeredItems.value.some((i) => i.id === item.id)) return;
  registeredItems.value.push(item);
}

function unregisterItem(id: string) {
  registeredItems.value = registeredItems.value.filter((i) => i.id !== id);
}

function hasItem(id: string) {
  return registeredItems.value.some((i) => i.id === id);
}

export function useFloatingMenu() {
  return {
    registeredItems,
    isExpanded,
    toggleExpanded,
    hiddenByScroll,
    setHiddenByScroll,
    sidebarVisible,
    toggleSidebar,
    catalogPopoverVisible,
    toggleCatalogPopover,
    catalogEditorId,
    catalogScrollElement,
    setCatalogContext,
    registerItem,
    unregisterItem,
    hasItem,
  };
}
