<template>
  <div id="articleHeader" :class="['h-a-info', variant === 'reading' ? 'h-a-info--reading' : 'h-a-info--cover']">
    <h1 class="h-a-title">{{ article.articleTitle }}</h1>

    <div class="h-a-meta">
      <div class="meta-line-1">
        <span class="category">
          <el-icon><Folder /></el-icon>
          {{ article.categoryName }}
        </span>
        <span class="divider">|</span>
        <span v-for="tag in article.tags" :key="tag.id" class="tag">
          #{{ tag.tagName }}
        </span>
      </div>
      <div class="meta-line-2">
        <span
          ><el-icon><EditPen /></el-icon>字数：{{ wordCount ?? 0 }}</span
        >
        <span class="divider">|</span>
        <span
          ><el-icon><View /></el-icon>访问：{{ article.visitCount }}</span
        >
        <span class="divider">|</span>
        <span
          ><el-icon><ChatDotRound /></el-icon>评论：{{
            article.commentCount
          }}</span
        >
        <span class="divider">|</span>
        <svg-icon name="like"></svg-icon
        ><span>点赞：{{ article.likeCount }}</span>
        <span class="divider">|</span>
        <span
          ><el-icon><Star /></el-icon>收藏：{{
            article.favoriteCount
          }}</span
        >
      </div>
      <div class="meta-line-3">
        <span>发布：{{ article.createTime }}</span>
        <span class="divider">|</span>
        <span>更新：{{ article.updateTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Folder,
  EditPen,
  View,
  ChatDotRound,
  Star,
} from "@element-plus/icons-vue";
import type { ArticleVO } from "@/types";

defineProps<{
  article: ArticleVO;
  wordCount?: string | number;
  variant?: "cover" | "reading";  // cover=遮罩上, reading=文本流中
}>();
</script>

<style scoped lang="scss">
// ── 基类：共享布局 ──
.h-a-info {
  width: 100%;

  .h-a-title {
    margin: 10px auto;
    padding: 0 15px;
    max-width: 1400px;
    font-weight: 400;
    font-size: 2.5em;
    line-height: 1.4;
  }

  .h-a-meta {
    margin: 10px auto;
    padding: 0 15px;
    max-width: 1400px;
    font-weight: 200;
    font-size: 0.95em;
    line-height: 1.8;

    > div {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    span {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    }

    .divider {
      opacity: 0.45;
      user-select: none;
      margin: 0 2px;
    }

    .meta-line-1 { margin-bottom: 2px; }
    .meta-line-2 { margin-bottom: 1px; }
  }

  // ── cover 变体：绝对定位在遮罩上，固定浅色 ──
  &--cover {
    position: absolute;
    bottom: 5px;

    .h-a-title,
    .h-a-meta {
      color: var(--mao-overlay-text-secondary);
    }
  }

  // ── reading 变体：文档流中，跟随主题色 ──
  &--reading {
    position: relative;

    .h-a-title {
      color: var(--el-text-color-primary);
    }

    .h-a-meta {
      color: var(--el-text-color-regular);
    }
  }
}
</style>
