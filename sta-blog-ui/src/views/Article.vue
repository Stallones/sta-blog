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

  <!-- 正常模式：content + sidebar 并排 + 评论区独立一行 -->
  <div v-if="!isReadingMode" class="article-body">
    <div class="article-flex">
      <div class="article-content">
        <div class="article-scroll"></div>
        <MdEditor
          :content="articleVO.content ?? ''"
          :editorId="editorId"
          :theme="mode"
          @htmlChanged="mdHtml"
          @getToc="setTocList"
        />
        <ArticleFooter v-if="articleVO.id" :article="articleVO" />
      </div>
      <div v-if="sidebarVisible" class="article-sidebar">
        <ArticleSideBar :article="articleVO" />
      </div>
    </div>
    <div v-if="showComment" class="article-comments">
      <SComment
        :serverOn="isOnline"
        :authorId="0"
        :articleId="(articleVO.id as number)"
        :likeType="BlogType.COMMENT"
      />
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
        @getToc="setTocList"
      />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { useColorMode, useTitle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { useDemotion } from "@/composables/useDemotion";
import { useArticleView } from "@/composables/useArticleView";
import { BlogType, ARTICLE_VISIT_PREFIX } from "@/const";
import {
  registerArticleItems,
  unregisterArticleItems,
} from "@/components/FloatingMenu/registerGlobal";
import { useFloatingMenu } from "@/composables/useFloatingMenu";
import { getArticle, addVisitCount } from "@/api/AppArticleController";
import { readArticleDetail } from "@/utils/file-reader";
import type { AppArticleRespVO } from "@/types";
import router from "@/router";
import ArticleFooter from "@/components/Article/ArticleFooter.vue";
import ArticleHeader from "@/components/Article/ArticleHeader.vue";
import ArticleSideBar from "@/components/SideBar/ArticleSideBar.vue";
const SComment = defineAsyncComponent(() => import("@/components/SComment/index.vue"));
const MdEditor = defineAsyncComponent(() => import("@/components/Article/MdEditor.vue"));

// ── 本地状态（原 useArticleStore 降级）──
const route = useRoute();
const { isOnline, requestOrRead } = useDemotion();
const articleVO = ref<AppArticleRespVO>({} as AppArticleRespVO);
const countMd = ref<string | number>(0);
const articleLoading = ref(false);
const articleCover = computed(() => articleVO.value.coverPath ?? "");

// ── Composables ──
const { isReadingMode, setTocContext, setTocList, scrollPercentage } = useArticleView();

// ── 本地：scrollPercentage → DOM 进度条写入 ──
watch(scrollPercentage, (percent) => {
  const el: HTMLElement | null = document.querySelector(".progress");
  if (el) {
    el.style.width = percent + "%";
  }
});
const { sidebarVisible } = useFloatingMenu();

onMounted(async () => {
  registerArticleItems();
  setTocContext(editorId, scrollElement);
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
  const articleId = route.params.id as string;
  if (!articleId) return;

  articleLoading.value = true;

  try {
    const res = await requestOrRead(
      (id: string) => getArticle({ id: Number(id) }),
      readArticleDetail,
      articleId
    );

    if (res.code !== 200) {
      ElMessage.warning({ message: res.msg });
      router.push({ path: "/" });
      return;
    }

    articleVO.value = res.data as AppArticleRespVO;
    useTitle(articleVO.value.title ?? "");

    // 时间格式化（后端可能返回数字时间戳或字符串）
    const rawTime = articleVO.value.createTime;
    if (rawTime) {
      articleVO.value.createTime = typeof rawTime === 'number'
        ? new Date(rawTime).toLocaleDateString('zh-CN')
        : String(rawTime).split(" ")[0];
    }
    if ((articleVO.value as any).updateTime) {
      (articleVO.value as any).updateTime = (articleVO.value as any).updateTime?.split(" ")[0];
    }

    // 访问统计
    if (
      !sessionStorage.getItem(ARTICLE_VISIT_PREFIX + articleId) &&
      isOnline.value
    ) {
      sessionStorage.setItem(ARTICLE_VISIT_PREFIX + articleId, articleId);
      addVisitCount({ id: Number(articleId) });
    }

    // 始终渲染评论区，由 SComment 组件内部根据 serverOn 控制可用性
    showComment.value = true;
  } finally {
    articleLoading.value = false;
  }
}

function mdHtml(htmlText: string) {
  const text = htmlText
    .replace(/<[^>]+>/g, "")
    .replace(/[\r\n]/g, "")
    .replace(/[ ]/g, "")
    .replace(/[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+/g, "");
  countMd.value =
    text.length <= 1000 ? text.length : Number((text.length / 1000).toFixed(1)) + "k";
}


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
    background: var(--glass-bg);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

// ── body 容器：包裹 content+sidebar 行 + 评论区行 ──
.article-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: $pad-desktop;
  box-sizing: border-box;

  @include tablet-down($breakpoint: $bp-tablet) {
    max-width: none;
    padding: $pad-tablet;
  }
  @include mobile {
    padding: $pad-mobile;
  }
}

// ── content + sidebar 74/26 分栏 ──
.article-flex {
  display: flex;
  align-items: stretch;
  gap: $gap-desktop;
  width: 100%;
  box-sizing: border-box;

  @include tablet-down($breakpoint: $bp-tablet) {
    flex-direction: column;
    gap: $gap-tablet;
  }
  @include mobile {
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

.article-content {
  flex: 0 0 $content-ratio;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @include glass-card;
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

// ── 评论区：独立一行，宽度与内容区一致 ──
.article-comments {
  width: $content-ratio;
  min-width: 0;
  box-sizing: border-box;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
  border-radius: $border-radius;
  padding: $padding-md;
  margin-top: $gap-desktop;

  @include tablet-down($breakpoint: $bp-tablet) {
    width: 100%;
    max-width: 100%;
    margin-top: $gap-tablet;
  }
  @include mobile {
    margin-top: $gap-mobile;
  }
}

// ── 阅读模式 ──
.reading-mode {
  @include solid-card;
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
