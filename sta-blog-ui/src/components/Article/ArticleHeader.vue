<template>
  <div id="articleHeader" class="h-a-info">
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
        <span
          ><el-icon><Star /></el-icon>点赞：{{ article.likeCount }}</span
        >
        <span class="divider">|</span>
        <span
          ><el-icon><Collection /></el-icon>收藏：{{
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
  Collection,
  
} from "@element-plus/icons-vue";
import type { ArticleVO } from "@/types";

defineProps<{
  article: ArticleVO;
  wordCount?: string | number;
}>();
</script>

<style scoped lang="scss">
.h-a-info {
  position: absolute;
  width: 100%;
  bottom: 5px;
  color: var(--w1);

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

    /* 每行统一 flex 布局，确保图标文字基线对齐 */
    > div {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* 图标+文字的 span 用 inline-flex 强制垂直居中 */
    span {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    }

    /* 竖线分隔符弱化 */
    .divider {
      opacity: 0.45;
      user-select: none;
      margin: 0 2px;
    }

    /* 分类行间距 */
    .meta-line-1 {
      margin-bottom: 2px;
    }

    .meta-line-2 {
      margin-bottom: 1px;
    }
  }
}
</style>
