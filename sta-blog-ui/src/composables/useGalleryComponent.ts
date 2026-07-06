import { ref, reactive, watch, computed } from "vue";
import { getArticlePage } from "@/api/AppArticleController";
import { useSearchStore } from "@/store/useSearchStore";
import { useDemotion } from "@/composables/useDemotion";
import { readArticlePage } from "@/utils/file-reader";
import { scrollToMainShell } from "@/utils/scroll";
import type { AppArticleRespVO } from "@/types";

// ══════════════════════════════════════════════════
//  Gallery 页面状态中心（合并 useArticleList + useGalleryLayout）
// ══════════════════════════════════════════════════

// ── 文章分页（从 usePaginationStore 内联）──
const articlePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// ── 卡片布局模式（从 useGalleryLayout）──
export type GalleryLayoutMode = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const layoutMode = ref<GalleryLayoutMode>(3);

export function useGalleryComponent() {
  const searchStore = useSearchStore();
  const { requestOrRead } = useDemotion();

  // ── 文章列表（从 useArticleList）──
  const cardList = ref<AppArticleRespVO[]>([]);
  const searchDisplayLimit = ref(10);

  watch(
    () => articlePagination.current,
    async () => {
      if (searchStore.searchResults) return;
      await fetchArticles();
      scrollToMainShell();
    }
  );

  watch(
    () => searchStore.searchResults,
    (results) => {
      if (results) {
        searchDisplayLimit.value = 10;
        cardList.value = results.list.slice(0, 10);
        articlePagination.total = results.total;
      } else {
        searchDisplayLimit.value = 10;
        articlePagination.current = 1;
        fetchArticles();
      }
    }
  );

  async function fetchArticles() {
    if (searchStore.searchResults) {
      cardList.value = searchStore.searchResults.list.slice(0, searchDisplayLimit.value);
      articlePagination.total = searchStore.searchResults.total;
      return;
    }
    const res: any = await requestOrRead(
      getArticlePage,
      readArticlePage,
      { pageNo: articlePagination.current, pageSize: articlePagination.pageSize }
    );
    const pageResult = res.data || res;
    if (pageResult?.list) {
      articlePagination.total = pageResult.total;
      cardList.value = pageResult.list;
    }
  }

  function showMoreResults() {
    if (!searchStore.searchResults) return;
    searchDisplayLimit.value = searchStore.searchResults.total;
    cardList.value = searchStore.searchResults.list.slice(0, searchDisplayLimit.value);
  }

  const hasMore = computed(() =>
    searchStore.searchResults
      ? searchStore.searchResults.total > searchDisplayLimit.value
      : false
  );

  // ── 布局模式（从 useGalleryLayout）──
  const mode = computed(() => layoutMode.value);

  function setMode(val: GalleryLayoutMode) {
    layoutMode.value = val;
  }

  function cycleMode() {
    layoutMode.value = ((layoutMode.value % 7) + 1) as GalleryLayoutMode;
  }

  return {
    // 分页
    articlePagination,
    // 文章列表
    cardList,
    searchDisplayLimit,
    fetchArticles,
    showMoreResults,
    hasMore,
    // 布局模式
    mode,
    setMode,
    cycleMode,
  };
}
