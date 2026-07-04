import { ref, watch, computed, nextTick } from "vue";
import { getArticlePage } from "@/api/AppArticleController";
import { ElMessage } from "element-plus";
import { usePaginationStore } from "@/store/usePaginationStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useDemotion } from "@/composables/useDemotion";
import { readArticlePage } from "@/utils/file-reader";
import { useScroll } from "@/composables/useScroll";
import type { ArticleVO, Page } from "@/types";

export function useArticleList() {
  const usePagination = usePaginationStore();
  const searchStore = useSearchStore();
  const { requestOrRead } = useDemotion();
  const { scrollToMainShell } = useScroll();

  const articlePagination = usePagination.articlePagination;
  const cardList = ref<ArticleVO[]>([]);
  const searchDisplayLimit = ref(10);

  watch(
    () => articlePagination.current,
    async () => {
      if (searchStore.searchResults) return;
      await fetchArticles();
      await nextTick();
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

  return {
    cardList, searchDisplayLimit, fetchArticles, showMoreResults, articlePagination,
    hasMore: computed(() =>
      searchStore.searchResults
        ? searchStore.searchResults.total > searchDisplayLimit.value
        : false
    ),
  };
}
