import { ref, reactive, computed } from "vue";
import type { AppArticleRespVO } from "@/types";

// ══════════════════════════════════════════════════
//  Gallery 页面状态中心（共享变量桥）
//
//  计算逻辑（fetchArticles / showMoreResults / hasMore / cycleMode）
//  已退回到 Gallery/index.vue 和 FloatingMenu 本地
// ══════════════════════════════════════════════════

// ── 文章分页（全局单例）──
const articlePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// ── 卡片布局模式（全局单例）──
export type GalleryLayoutMode = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const layoutMode = ref<GalleryLayoutMode>(3);

// ── 文章列表（全局单例）──
const cardList = ref<AppArticleRespVO[]>([]);
const searchDisplayLimit = ref(10);

export function useGalleryComponent() {
  // ── 布局模式 ──
  const mode = computed(() => layoutMode.value);

  function setMode(val: GalleryLayoutMode) {
    layoutMode.value = val;
  }

  // ── Setter（组件本地计算后通过 setter 写共享变量）──
  function setCardList(list: AppArticleRespVO[]) {
    cardList.value = list;
  }

  function setArticleTotal(total: number) {
    articlePagination.total = total;
  }

  function setSearchDisplayLimit(limit: number) {
    searchDisplayLimit.value = limit;
  }

  return {
    // 分页
    articlePagination,
    // 文章列表
    cardList,
    searchDisplayLimit,
    // Setter
    setCardList,
    setArticleTotal,
    setSearchDisplayLimit,
    // 布局模式
    mode,
    setMode,
    layoutMode,
  };
}
