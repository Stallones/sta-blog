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

// ── 侧边栏显隐状态（FloatingMenu 按钮控制）──
const sidebarVisible = ref(true);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
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
    sidebarVisible,
    toggleSidebar,
    registerItem,
    unregisterItem,
    hasItem,
  };
}
