<template>
  <!-- 正常模式 -->
  <div v-if="!isReadingMode" class="article-container">
    <div class="article-scroll"></div>

    <ArticleBody
      :content="articleVO.articleContent"
      :editorId="editorId"
      :theme="mode"
      @htmlChanged="mdHtml"
    />
    <ArticleFooter :article="articleVO" />
    <!-- 用户评论 -->
    <Comment
      v-if="showComment"
      :serverOn="useService.isServiceAvailable"
      :authorId="articleVO.userId"
      :commentType="COMMENT_ARTICLE_CONS"
      :commentPId="articleVO.id"
      :liketype="2"
    />

  </div>

  <!-- 阅读模式 -->
  <div v-if="isReadingMode" class="reading-mode">
    <div
      @click="isReadingMode = false"
      class="reading-exit-btn"
    >
      <svg-icon name="exit_icon" style="width: 25px; height: 25px" />
    </div>
    <div
      class="reading-content"
      style="transition: all 0.5s ease"
    >
      <ArticleBody
        :content="articleVO.articleContent"
        :editorId="editorId"
        :theme="mode"
        @htmlChanged="mdHtml"
      />
      <ArticleFooter :article="articleVO" />
    </div>
  </div>

  <DirectoryCardMob :id="editorId" :scroll-element="scrollElement" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useColorMode } from "@vueuse/core";
import { storeToRefs } from "pinia";

import { useServiceStore } from "@/store/useServiceStore";
import { useArticleStore } from "@/store/useArticleStore";
import { useReadingProgress } from "@/composables/useReadingProgress";
import { useReadingMode } from "@/composables/useReadingMode";
import { COMMENT_ARTICLE_CONS } from "@/const";

import {
  registerArticleItems,
  unregisterArticleItems,
} from "@/components/FloatingMenu/registerGlobal";

// ── Store ──
const route = useRoute();
const useService = useServiceStore();
const articleStore = useArticleStore();
const { articleVO } = storeToRefs(articleStore);

// ── Composables ──
const { isReadingMode } = useReadingMode();

onMounted(async () => {
  registerArticleItems();
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

// ── 文章数据（从 store 读） ──
const editorId = "preview-only";
const scrollElement = document.documentElement;

// ── 功能显隐 ──
const showComment = ref(false);

// ── 路由切换重新获取 ──
watch(
  () => route.params.id,
  () => {
    getArticleDetailById();
  }
);

async function getArticleDetailById() {
  await articleStore.fetchArticle(route.params.id as string);

  // 服务可用时展示交互功能区
  if (useService.isServiceAvailable) {
    showComment.value = true;
  }
}

// ── 字数统计回调（ArticleBody emit）→ 写回 store ──
function mdHtml(htmlText: string) {
  const text = htmlText
    .replace(/<[^>]+>/g, "")
    .replace(/[\r\n]/g, "")
    .replace(/[ ]/g, "")
    .replace(/[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+/g, "");
  articleStore.setWordCount(text.length);
}

// ── 顶部进度条（阅读进度） ──
useReadingProgress(".progress");
</script>

<style scoped lang="scss">
@use "@/styles/mixin" as *;

.article-container {
  background-color: var(--mao-card-bg);
  border-radius: $border-radius;
  box-shadow: var(--mao-box-shadow);
  display: flex ;
  flex-direction: column;
  gap: 20px;
  padding: 0 $padding-lg;
}

.article-scroll {
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  background: var(--mao-scroll-percentage-bar);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  z-index: 1032;
}

.pre-text {
  text-align: left;
  overflow: auto;
}

/* ── 阅读模式 ── */
.reading-mode {
  background-color: var(--card-bg);
}

.reading-exit-btn {
  position: fixed;
  top: 2em;
  right: 1em;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: $border-radius;
  background-color: var(--secondary-bg);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: var(--border-color-light);
  }

  @media (min-width: 1024px) {
    right: 5em;
  }
}

.reading-content {
  padding: 0.75rem 0.25rem;

  @media (min-width: 640px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 768px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }

  @media (min-width: 1024px) {
    padding-left: 10rem;
    padding-right: 10rem;
  }

  @media (min-width: 1280px) {
    padding-left: 15rem;
    padding-right: 15rem;
  }
}
</style>
