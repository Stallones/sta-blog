import { ref, watch, computed } from "vue";
import { getArticlePage } from "@/apis/home";
import { ElMessage } from "element-plus";
import { usePaginationStore } from "@/store/usePaginationStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useDemotion } from "@/composables/useDemotion";
import { readArticlePage } from "@/utils/file-reader";
import type { ArticleVO, Page } from "@/types";

export function useArticleList() {
  // 移入函数内部，避免 Pinia 初始化前调用
  const usePagination = usePaginationStore();
  const searchStore = useSearchStore();
  const { requestOrRead } = useDemotion();

  const articlePagination = usePagination.articlePagination;

  const cardList = ref<ArticleVO[]>([]);
  const searchDisplayLimit = ref(10);

  // ── 分页监听 ──
  watch(
    () => articlePagination.current,
    () => {
      if (searchStore.searchResults) return;
      fetchArticles();
      window.scrollTo(0, 300);
    }
  );

  // ── 搜索 store 监听 ──
  watch(
    () => searchStore.searchResults,
    (results) => {
      if (results) {
        searchDisplayLimit.value = 10;
        cardList.value = results.page.slice(0, 10);
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
      cardList.value = searchStore.searchResults.page.slice(0, searchDisplayLimit.value);
      articlePagination.total = searchStore.searchResults.total;
      return;
    }

    const res = await requestOrRead(
      getArticlePage,
      readArticlePage,
      articlePagination.current,
      articlePagination.pageSize
    );

    if (res.code === 200) {
      const pageResult = res.data as Page<ArticleVO>;
      articlePagination.total = pageResult.total;
      pageResult.page.forEach((item: ArticleVO) => {
        // 统一标签格式
        if (item.tags && item.tags.length > 0 && typeof item.tags[0] === "string") {
          item.tags = (item.tags as unknown as string[]).map((name, idx) => ({
            id: idx,
            tagName: name,
          })) as any;
        }
        // 截取摘要
        if (item.articleContent) {
          item.articleContent = item.articleContent
            .replace(/[*#>`~\-\\[\\]()\\s]|(\n\n)/g, "")
            .substring(0, 60) + "...";
        }
      });
      cardList.value = pageResult.page;
    } else {
      ElMessage.error(res.msg);
    }
  }

  function showMoreResults() {
    if (!searchStore.searchResults) return;
    searchDisplayLimit.value = searchStore.searchResults.total;
    cardList.value = searchStore.searchResults.page.slice(0, searchDisplayLimit.value);
  }

  return {
    cardList,
    searchDisplayLimit,
    fetchArticles,
    showMoreResults,
    articlePagination,
    hasMore: computed(() =>
      searchStore.searchResults
        ? searchStore.searchResults.total > searchDisplayLimit.value
        : false
    ),
  };
}
