import { ref, watch, onMounted, onUnmounted } from "vue";
import { useFloatingMenu } from "./useFloatingMenu";
import { throttle } from "@/utils/optimize";

/**
 * useArticleView — 文章页状态中心
 * 合并 useReadingMode + useReadingProgress + useCatalog
 *
 * 全局单例（目录状态 + 阅读模式）+ 实例级（阅读进度）
 *
 * 用法:
 *   const { isReadingMode, setCatalogContext } = useArticleView(".progress")   // Article.vue
 *   const { toggleReadingMode, scrollPercentage, catalogPopoverVisible, ... } = useArticleView()  // FloatingMenu
 *   const { catalogPopoverVisible, toggleCatalogPopover } = useArticleView()  // DirectoryCardMob
 */

// ── 阅读模式（全局单例）──
const isReadingMode = ref(false);

watch(isReadingMode, (val) => {
  const { sidebarVisible } = useFloatingMenu();
  sidebarVisible.value = !val;
});

// ── 目录状态（全局单例，从 useCatalog 合并）──
const catalogPopoverVisible = ref(true);
const catalogEditorId = ref("");
const catalogScrollElement = ref<HTMLElement | null>(null);

function toggleCatalogPopover() {
  catalogPopoverVisible.value = !catalogPopoverVisible.value;
}

function setCatalogContext(editorId: string, scrollEl: HTMLElement) {
  catalogEditorId.value = editorId;
  catalogScrollElement.value = scrollEl;
}

export function useArticleView(selector?: string) {
  function toggleReadingMode() {
    isReadingMode.value = !isReadingMode.value;
  }

  // ── 阅读进度（实例级）──
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
    scrollWork();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", throttledScroll);
  });

  return {
    // 阅读模式
    isReadingMode,
    toggleReadingMode,
    // 阅读进度
    scrollPercentage,
    // 目录状态
    catalogPopoverVisible,
    toggleCatalogPopover,
    catalogEditorId,
    catalogScrollElement,
    setCatalogContext,
  };
}
