<script setup lang="ts">
import { computed, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useGalleryComponent } from "@/composables/useGalleryComponent";
import type { GalleryLayoutMode } from "@/composables/useGalleryComponent";
import { useDemotion } from "@/composables/useDemotion";
import { useSearchStore } from "@/store/useSearchStore";
import { getArticlePage } from "@/api/AppArticleController";
import { readArticlePage } from "@/utils/file-reader";
import { scrollToMainShell } from "@/utils/scroll";
import type { AppArticleRespVO } from "@/types";

// ── 外部数据（可选）──
const props = defineProps<{
  articles?: AppArticleRespVO[];
}>();

// ── 共享变量 ──
const { width } = useWindowSize();
const {
  cardList: listFromHook,
  articlePagination,
  mode: layoutMode,
  searchDisplayLimit,
  setCardList,
  setArticleTotal,
  setSearchDisplayLimit,
} = useGalleryComponent();
const { requestOrRead } = useDemotion();
const searchStore = useSearchStore();

const cardList = computed(() => props.articles ?? listFromHook.value);
const isExternal = computed(() => props.articles !== undefined);

// ── 本地：fetch 计算逻辑 ──
async function fetchArticles() {
  if (searchStore.searchResults) {
    setCardList(searchStore.searchResults.list.slice(0, searchDisplayLimit.value));
    setArticleTotal(searchStore.searchResults.total);
    return;
  }

  const params = { pageNo: articlePagination.current, pageSize: articlePagination.pageSize };

  // 瀑布流模式：双 fetch 不同摘要长度，奇偶交错制造高度差
  if ([6, 7].includes(effectiveMode.value) && !isMobile.value) {
    const [shortRes, longRes] = await Promise.all([
      requestOrRead(getArticlePage, readArticlePage, { ...params, summaryLength: 100 }),
      requestOrRead(getArticlePage, readArticlePage, { ...params, summaryLength: 1000 }),
    ]);
    const shortPage = shortRes.data || shortRes;
    const longPage = longRes.data || longRes;
    if (shortPage?.list && longPage?.list) {
      setArticleTotal(shortPage.total);
      const merged = shortPage.list.map((item: any, i: number) => ({
        ...item,
        summary: i % 2 === 0 ? shortPage.list[i].summary : longPage.list[i].summary,
      }));
      setCardList(merged);
    }
    return;
  }

  // 非瀑布流：默认 fetch
  const res: any = await requestOrRead(getArticlePage, readArticlePage, params);
  const pageResult = res.data || res;
  if (pageResult?.list) {
    setArticleTotal(pageResult.total);
    setCardList(pageResult.list);
  }
}

function showMoreResults() {
  if (!searchStore.searchResults) return;
  setSearchDisplayLimit(searchStore.searchResults.total);
  setCardList(searchStore.searchResults.list.slice(0, searchStore.searchResults.total));
}

const hasMore = computed(() =>
  searchStore.searchResults
    ? searchStore.searchResults.total > searchDisplayLimit.value
    : false
);

// ── 本地：watch 触发 fetch ──
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
      setSearchDisplayLimit(10);
      setCardList(results.list.slice(0, 10));
      setArticleTotal(results.total);
    } else {
      setSearchDisplayLimit(10);
      articlePagination.current = 1;
      fetchArticles();
    }
  }
);

// ── 布局模式 ──
const MOBILE_BREAKPOINT = 768;

/** 移动端统一降级为 VerticalCard */
const isMobile = computed(() => width.value < MOBILE_BREAKPOINT);
const effectiveMode = computed<GalleryLayoutMode>(() =>
  isMobile.value ? 4 : layoutMode.value
);

/** 网格 class（外部数据与 hook 共用） */
const gridClass = computed(() => ({
  "two-col-grid": [4, 5].includes(effectiveMode.value) && !isMobile.value,
  "waterfall-grid": [6, 7].includes(effectiveMode.value) && !isMobile.value,
}));

// ── 子组件映射表 ──
import HorizontalCard from "./GalleryCard/HorizontalCard.vue";
import VerticalCard from "./GalleryCard/VerticalCard.vue";
import OverlayCard from "./GalleryCard/OverlayCard.vue";
import WaterfallCard from "./GalleryCard/WaterfallCard.vue";

function resolveComponent(mode: GalleryLayoutMode) {
  switch (mode) {
    case 1: return HorizontalCard;  // direction="left" 在 props 中设置
    case 2: return HorizontalCard;
    case 3: return HorizontalCard;
    case 4: return VerticalCard;
    case 5: return OverlayCard;
    case 6: return WaterfallCard;
    case 7: return WaterfallCard;
  }
}

/** 模式 1/2/3 的 direction */
function resolveDirection(mode: GalleryLayoutMode, index: number): "left" | "right" {
  if (mode === 1) return "left";
  if (mode === 2) return "right";
  // 模式 3：交替 — 奇数左 偶数右
  return index % 2 === 0 ? "left" : "right";
}

/** 模式 6/7 的 overlay */
function resolveOverlay(mode: GalleryLayoutMode): boolean {
  return mode === 7;
}
</script>

<template>
  <div v-if="!isExternal" v-view-request="{ callback: fetchArticles }">
    <!-- 卡片列表：带 fade 过渡 -->
    <TransitionGroup name="gallery-fade" tag="div"
      :key="effectiveMode"
      :class="gridClass"
    >
      <template v-for="(article, index) in cardList" :key="article.id">
        <!-- 瀑布流容器：用 CSS column-count -->
        <component
          :is="resolveComponent(effectiveMode)"
          :article="article"
          :direction="resolveDirection(effectiveMode, index)"
          :overlay="resolveOverlay(effectiveMode)"
          class="gallery-item"
          @click="$router.push('/article/' + article.id)"
          v-slide-in
        />
      </template>
    </TransitionGroup>

    <!-- 搜索展开更多 -->
    <div
      v-if="hasMore"
      class="show-more-wrap"
    >
      <el-button type="primary" plain @click="showMoreResults">
        显示更多结果（共 {{ articlePagination.total }} 篇）
      </el-button>
    </div>
  </div>

  <!-- 外部数据直接渲染（无 fetch/骨架/更多） -->
  <div v-else :key="effectiveMode" :class="gridClass">
    <template v-for="(article, index) in cardList" :key="article.id">
      <component
        :is="resolveComponent(effectiveMode)"
        :article="article"
        :direction="resolveDirection(effectiveMode, index)"
        :overlay="resolveOverlay(effectiveMode)"
        class="gallery-item"
        @click="$router.push('/article/' + article.id)"
        v-slide-in
      />
    </template>
  </div>

  <!-- 骨架屏 -->
  <template v-if="cardList.length == 0 && !isExternal">
    <el-skeleton :rows="8" animated />
  </template>
</template>

<style scoped lang="scss">
/* ── 两列等宽网格（模式 4/5）── */
.two-col-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

/* ── 瀑布流网格（模式 6/7）── */
.waterfall-grid {
  column-count: 2;
  column-gap: 14px;

  .gallery-item {
    break-inside: avoid;
  }

  @media (max-width: 900px) { column-count: 1; }
}

/* ── Fade 过渡动画（布局切换时）── */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.gallery-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.gallery-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 列表移动时不要有过渡（避免闪烁） */
.gallery-fade-move {
  transition: none !important;
}

.show-more-wrap {
  text-align: center;
  padding: 12px 0;
}
</style>
