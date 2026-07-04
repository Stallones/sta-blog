import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import router from "@/router";
import { getArticle, addVisitCount } from "@/api/AppArticleController";
import { readArticleDetail } from "@/utils/file-reader";
import { ARTICLE_VISIT_PREFIX } from "@/const";
import type { ArticleVO, ApiResponse } from "@/types";

type RequestOrReadFn = <T, Args extends any[]>(
  requestFn: (...args: Args) => Promise<T>,
  readFn: (...args: Args) => Promise<ApiResponse<T>>,
  ...args: Args
) => Promise<ApiResponse<T>>;

export const useArticleStore = defineStore("article", () => {
  // ── State ──
  const articleVO = ref<ArticleVO>({} as ArticleVO);
  const countMd = ref<string | number>(0);
  const loading = ref(false);

  const route = useRoute();

  // ── Computed ──
  /** 动态封面 URL（供 Header .h-article 使用） */
  const articleCover = computed(() => articleVO.value.coverPath ?? "");

  // ── Actions ──
  async function fetchArticle(
    id: string | undefined,
    demotion: { requestOrRead: RequestOrReadFn; isOnline: boolean }
  ) {
    const articleId = (id || route.params.id) as string;
    if (!articleId) return;

    loading.value = true;

    try {
      const res = await demotion.requestOrRead(
        (id: string) => getArticle({ id: Number(id) }),
        readArticleDetail,
        articleId
      );

      if (res.code !== 200) {
        ElMessage.warning({ message: res.msg });
        router.push({ path: "/" });
        return;
      }

      articleVO.value = res.data as ArticleVO;
      useTitle(articleVO.value.title ?? "");

      // 时间格式化（后端可能返回数字时间戳或字符串）
      const rawTime = articleVO.value.createTime;
      if (rawTime) {
        articleVO.value.createTime = typeof rawTime === 'number'
          ? new Date(rawTime).toLocaleDateString('zh-CN')
          : String(rawTime).split(" ")[0];
      }
      // updateTime 在新 API 中不存在于 ArticleVO，先做安全处理
      if ((articleVO.value as any).updateTime) {
        (articleVO.value as any).updateTime = (articleVO.value as any).updateTime?.split(" ")[0];
      }

      // 访问统计
      if (
        !sessionStorage.getItem(ARTICLE_VISIT_PREFIX + articleId) &&
        demotion.isOnline
      ) {
        sessionStorage.setItem(ARTICLE_VISIT_PREFIX + articleId, articleId);
        addVisitCount({ id: Number(articleId) });
      }
    } finally {
      loading.value = false;
    }
  }

  /** 设置字数统计（由 ArticleBody 回调触发） */
  function setWordCount(count: number) {
    countMd.value =
      count <= 1000 ? count : Number((count / 1000).toFixed(1)) + "k";
  }

  /** 重置文章数据 */
  function resetArticle() {
    articleVO.value = {} as ArticleVO;
    countMd.value = 0;
  }

  return {
    articleVO,
    countMd,
    loading,
    articleCover,
    fetchArticle,
    setWordCount,
    resetArticle,
  };
});
