<template>
  <div class="article-page">
  <!-- article header：文章封面（阅读模式下隐藏） -->
  <div
    v-if="!isReadingMode"
    class="article-cover"
    :class="{ 'article-cover--offline': !imageOnline }"
    :style="
      articleCover && imageOnline ? `background-image: url('${articleCover}')` : undefined
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
        <div v-slide-in class="article-surface" :class="{ 'img-offline': !imageOnline }">
          <MdEditor
            :content="articleVO.content ?? ''"
            :editorId="editorId"
            :theme="mode"
            @htmlChanged="mdHtml"
            @getToc="setTocList"
          />
          <ArticleFooter v-if="articleVO.id && isOnline" :article="articleVO" />
        </div>
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
import { useCanvasEffects } from "@/composables/useCanvasEffects";
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
const { isOnline, imageOnline, requestOrRead } = useDemotion();
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
const { canvasHeaderH } = useCanvasEffects();

onMounted(async () => {
  registerArticleItems();
  setTocContext(editorId, scrollElement);
  // 画布视口偏移：article-cover 占 30vh，剩余 70vh 为画布可见区
  canvasHeaderH.value = window.innerHeight * 0.7;
  await getArticleDetailById();
});

onUnmounted(() => {
  unregisterArticleItems();
  canvasHeaderH.value = 0;
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

    if (res.code !== 0) {
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
// 单根容器（供 v-slide-in 指令使用）
.article-page {
  width: 100%;
}

// ── article 封面（原 h-article）──
.article-cover {
  position: relative;
  width: 100%;
  height: 30vh;
  display: flex;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-color: var(--bg-page);
  // transition: background-color 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--cover-shadow); /* 固定暗色遮罩，不随玻璃/实体切换 */
  }

  // 图片服务离线：渐变背景 + 玻璃模糊 + “图片”文字
  &--offline {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

    &::before {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.1);
    }

    &::after {
      content: "图片";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.85);
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
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
  background: var(--accent-gradient);
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

  @include tablet-down($breakpoint: $bp-tablet) {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
}

// 统一玻璃包裹层（含 editor + footer）
.article-surface {
  @include surface-card;
  padding: $padding-md;
  display: flex;
  flex-direction: column;
  gap: 20px;

  // md-editor 不重复做玻璃
  :deep(.md-editor),
  :deep(.md-editor-dark) {
    --md-bk-color: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    padding: 0;
  }

  // 图片服务离线：隐藏内嵌图并显示占位
  &.img-offline :deep(img) {
    visibility: hidden;
    display: block;
    max-height: 200px;
  }

  // 用父元素 p 的伪元素显示占位块
  &.img-offline :deep(p) {
    position: relative;

    &:has(img)::after {
      content: "图片";
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      max-height: 200px;
    }
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
  @include surface-card;
  width: $content-ratio;
  min-width: 0;
  box-sizing: border-box;
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
  @include surface-card;
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
  background-color: var(--surface-bg);
  box-shadow: var(--surface-shadow);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: var(--fill-color-light);
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
