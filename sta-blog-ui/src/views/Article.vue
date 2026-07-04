<template>
  <!-- article header：文章封面（阅读模式下隐藏） -->
  <div
    v-if="!isReadingMode"
    class="article-cover"
    :style="
      articleCover ? `background-image: url('${articleCover}')` : undefined
    "
  >
    <ArticleHeader
      v-if="!articleLoading && articleVO.id"
      :article="articleVO"
      :wordCount="countMd"
    />
  </div>

  <!-- 正常模式：content + sidebar 并排 -->
  <div v-if="!isReadingMode" class="article-flex">
    <div class="article-main">
      <div class="article-scroll"></div>
      <MdEditor
        :content="articleVO.content ?? ''"
        :editorId="editorId"
        :theme="mode"
        @htmlChanged="mdHtml"
      />
      <ArticleFooter v-if="articleVO.id" :article="articleVO" />
      <SComment
        v-if="showComment"
        :serverOn="isOnline"
        :authorId="0"
        :articleId="(articleVO.id as number)"
        :likeType="BlogType.COMMENT"
      />
    </div>
    <div v-if="sidebarVisible" class="article-sidebar">
      <ArticleSideBar />
    </div>
  </div>

  <!-- 阅读模式 -->
  <div v-if="isReadingMode" class="reading-mode">
    <div class="reading-content">
      <div @click="isReadingMode = false" class="reading-exit-btn">
        <svg-icon name="exit_icon" style="width: 25px; height: 25px" />
      </div>
      <ArticleHeader
        v-if="!articleLoading && articleVO.id"
        :article="articleVO"
        :wordCount="countMd"
        variant="reading"
      />
      <el-divider></el-divider>
      <MdEditor
        :content="articleVO.content ?? ''"
        :editorId="editorId"
        :theme="mode"
        @htmlChanged="mdHtml"
      />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { useColorMode } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useDemotion } from "@/composables/useDemotion";
import { useArticleStore } from "@/store/useArticleStore";
import { useReadingProgress } from "@/composables/useReadingProgress";
import { useReadingMode } from "@/composables/useReadingMode";
import { BlogType } from "@/const";
import {
  registerArticleItems,
  unregisterArticleItems,
} from "@/components/FloatingMenu/registerGlobal";
import { useFloatingMenu } from "@/composables/useFloatingMenu";
import ArticleFooter from "@/components/Article/ArticleFooter.vue";
import ArticleHeader from "@/components/Article/ArticleHeader.vue";
import ArticleSideBar from "@/components/SideBar/ArticleSideBar.vue";
const SComment = defineAsyncComponent(() => import("@/components/SComment/index.vue"));
const MdEditor = defineAsyncComponent(() => import("@/components/Article/MdEditor.vue"));

// ── Store ──
const route = useRoute();
const { isOnline, requestOrRead } = useDemotion();
const articleStore = useArticleStore();
const {
  articleVO,
  countMd,
  loading: articleLoading,
  articleCover,
} = storeToRefs(articleStore);

// ── Composables ──
const { isReadingMode } = useReadingMode();
const { sidebarVisible, setCatalogContext } = useFloatingMenu();

onMounted(async () => {
  registerArticleItems();
  setCatalogContext(editorId, scrollElement);
  await getArticleDetailById();
});

onUnmounted(() => {
  unregisterArticleItems();
});

// ── 基础依赖 ──
const colorMode = useColorMode();
const mode = computed(() =>
  colorMode.value === "auto" ? "light" : colorMode.value
);

const editorId = "preview-only";
const scrollElement = document.documentElement;
const showComment = ref(false);

watch(
  () => route.params.id,
  () => {
    getArticleDetailById();
  }
);

async function getArticleDetailById() {
  await articleStore.fetchArticle(route.params.id as string, { requestOrRead, isOnline: isOnline.value });
  // 始终渲染评论区，由 SComment 组件内部根据 serverOn 控制可用性
  showComment.value = true;
}

function mdHtml(htmlText: string) {
  const text = htmlText
    .replace(/<[^>]+>/g, "")
    .replace(/[\r\n]/g, "")
    .replace(/[ ]/g, "")
    .replace(/[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+/g, "");
  articleStore.setWordCount(text.length);
}

useReadingProgress(".progress");
</script>

<style scoped lang="scss">
@use "@/styles/_layout.scss" as *;

// ── article 封面（原 h-article）──
.article-cover {
  position: relative;
  width: 100%;
  height: 30vh;
  display: flex;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-color: var(--el-bg-color);
  transition: background-color 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--mao-cover-shadow);
  }
}

// ── content + sidebar 74/26 分栏 ──
.article-flex {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: $gap-desktop;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: $pad-desktop;
  box-sizing: border-box;

  @include tablet-down($breakpoint: $bp-tablet) {
    flex-direction: column;
    gap: $gap-tablet;
    max-width: none;
    padding: $pad-tablet;
  }
  @include mobile {
    padding: $pad-mobile;
    gap: $gap-mobile;
  }
}

.article-scroll {
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  background: var(--mao-accent-gradient);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  z-index: 1032;
}

.article-main {
  flex: 0 0 $content-ratio;
  // max-width: $content-max-w;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
  border-radius: $border-radius;
  padding: $padding-md;

  @include tablet-down($breakpoint: $bp-tablet) {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
}

.article-sidebar {
  flex: 0 0 $sidebar-ratio;
  max-width: $sidebar-max-w;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @include tablet-down($breakpoint: $bp-tablet) {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
}

// ── 阅读模式 ──
.reading-mode {
  background-color: var(--el-fill-color-blank);
  border-radius: $border-radius;
  box-shadow: var(--el-box-shadow-light);
  flex: 1;
  margin: 0 auto;
  max-width: $layout-max-w;
  width: 100%;
  padding: $pad-desktop;
  box-sizing: border-box;
}

.reading-exit-btn {
  position: fixed;
  top: 2em;
  right: 1em;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $border-radius;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  @media (min-width: 1024px) {
    right: 5em;
  }

  .reading-content {
    // max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    // background-color: var(--el-fill-color-blank);
    // border-radius: $border-radius;
    // box-shadow: var(--el-box-shadow-light);
  }
}
</style>
