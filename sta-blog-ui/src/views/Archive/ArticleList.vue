<script setup lang="ts">
import { Clock, ChatLineSquare } from '@element-plus/icons-vue';

defineProps({
  articleList: {
    type: Array<any>,
    required: true,
  },
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.substring(0, 10);
}
</script>

<template>
  <div class="article-card-list">
    <div
      v-for="article in articleList"
      :key="article.id"
      class="article-card"
      @click="$router.push(`/article/${article.id}`)"
    >
      <div class="card-thumb">
        <img
          v-if="article.coverPath"
          :src="article.coverPath"
          alt="封面"
          class="thumb-img"
        />
        <div v-else class="thumb-placeholder">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#ccc">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ article.title }}</h3>
        <div class="card-meta">
          <span class="meta-date">
            <el-icon :size="13"><Clock /></el-icon>
            {{ formatDate(article.createTime) }}
          </span>
          <span class="meta-comment" v-if="article.commentCount != null">
            <el-icon :size="13"><ChatLineSquare /></el-icon>
            {{ article.commentCount }}
          </span>
        </div>
        <p class="card-summary" v-if="article.summary">{{ article.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0;

  .article-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface-bg);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }

  .card-thumb {
    flex-shrink: 0;
    width: 140px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;

    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    .article-card:hover .thumb-img {
      transform: scale(1.06);
    }

    .thumb-placeholder {
      width: 100%;
      height: 100%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .card-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.4rem;
  }

  .card-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;

    .article-card:hover & {
      color: #409EFF;
    }
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--text-secondary);

    span {
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  .card-summary {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 移动端缩略图缩小
@media screen and (max-width: 768px) {
  .article-card-list {
    .card-thumb {
      width: 100px;
      height: 66px;
    }

    .card-title {
      font-size: 0.95rem;
    }
  }
}
</style>
