import { ref, watch } from "vue";
import { useFloatingMenu } from "./useFloatingMenu";

/**
 * useArticleView — 文章页状态中心（共享变量桥）
 *
 * 职责：暴露全局共享变量用于跨组件控制
 * 计算逻辑（scroll 监听）已退到 App.vue 本地
 *
 * 用法:
 *   const { isReadingMode, setTocContext, setTocList } = useArticleView()   // Article.vue
 *   const { toggleReadingMode, scrollPercentage, MobTocVisible, ... } = useArticleView()  // FloatingMenu
 */

export interface TocHeading {
  text: string;
  level: number;
  index: number;
}

// ── 阅读模式（全局单例）──
const isReadingMode = ref(false);

watch(isReadingMode, (val) => {
  const { sidebarVisible } = useFloatingMenu();
  sidebarVisible.value = !val;
});

// ── 阅读进度（全局单例）──
const scrollPercentage = ref(0);

// ── 移动端目录状态（全局单例）──
const MobTocVisible = ref(false);
const MobTocEditorId = ref("");
const MobTocScrollElement = ref<HTMLElement | null>(null);
const tocList = ref<TocHeading[]>([]);
const activeHeadingIdx = ref(-1);

function toggleMobToc() {
  MobTocVisible.value = !MobTocVisible.value;
}

function setTocContext(editorId: string, scrollEl: HTMLElement) {
  MobTocEditorId.value = editorId;
  MobTocScrollElement.value = scrollEl;
}

function setTocList(list: TocHeading[]) {
  tocList.value = list;
}

/** 生成合法的 HTML heading id：空格→连字符 */
export function makeHeadingId(text: string): string {
  return text.trim().replace(/\s+/g, "-");
}

export function useArticleView() {
  function toggleReadingMode() {
    isReadingMode.value = !isReadingMode.value;
  }

  return {
    // 阅读模式
    isReadingMode,
    toggleReadingMode,
    // 阅读进度
    scrollPercentage,
    // 目录状态
    MobTocVisible,
    toggleMobToc,
    MobTocEditorId,
    MobTocScrollElement,
    tocList,
    activeHeadingIdx,
    setTocContext,
    setTocList,
  };
}
