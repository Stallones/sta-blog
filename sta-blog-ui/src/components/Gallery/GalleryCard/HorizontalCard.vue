<script setup lang="ts">
import type { ArticleVO } from "@/types";

defineProps<{
  article: ArticleVO;
  direction: "left" | "right";
}>();
</script>

<template>
  <div class="h-card" :class="`h-card--${direction}`">
    <!-- 封面 42% -->
    <div class="g-cover">
      <div class="g-cover-inner">
        <div class="g-img-wrap">
          <img class="g-img" v-lazy="true" :data-src="article.articleCover" alt="" />
        </div>
      </div>
    </div>

    <!-- 内容区 58% — 上下居中 -->
    <div class="g-body">
      <!-- 第1行：标题 -->
      <div class="g-title">{{ article.articleTitle }}</div>

      <!-- 第2行：分类 | #tag #tag -->
      <div class="g-tags">
        <span class="g-tag-cat">{{ article.categoryName }}</span>
        <span v-for="tag in article.tags" :key="tag.id" class="g-tag-item">#{{ tag.tagName }}</span>
      </div>

      <!-- 第3行：meta -->
      <div class="g-meta">
        <SvgIcon name="reading" /> {{ article.visitCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="comments" /> {{ article.commentCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="like" /> {{ article.likeCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="collection" /> {{ article.favoriteCount }}
      </div>

      <!-- 第4行：描述（最多2行） -->
      <p class="g-desc">{{ article.articleContent }}</p>

      <!-- 第5行：时间 -->
      <div class="g-time">{{ article.createTime }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.h-card {
  display: flex;
  flex-direction: column;
  height: 200px;
  overflow: hidden;
  border-radius: $border-radius;
  background-color: var(--mao-card-bg);
  box-shadow: var(--mao-box-shadow);
  cursor: pointer;
  margin-bottom: $margin-bottom;

  @media (min-width: $bp) {
    flex-direction: row;
    height: 12rem;
  }

  &:hover .g-img { transform: scale(1.08); }

  &--left  { @media(min-width:$bp){flex-direction:row;} }
  &--right { @media(min-width:$bp){flex-direction:row-reverse;} }
}

/* ── 统一封面 ── */
.g-cover {
  width: 100%;
  height: 45%;

  @media (min-width: $bp) {
    width: 42%;
    height: 100%;
  }
}

.g-cover-inner,
.g-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.g-img-wrap { overflow: hidden; }

.g-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

/* ── 统一内容区（上下居中）── */
.g-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0.65rem 1rem;
  gap: 0.25rem;

  @media (min-width: $bp) {
    width: 58%;
    padding: 0 1.25rem;
  }
}

.g-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { color: var(--accent-color); }
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  flex-wrap: wrap;

  .g-tag-cat::after { content: "|"; margin-left: 0.35rem; opacity: 0.5; }
  .g-tag-item { white-space: nowrap; }
}

.g-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  color: var(--text-secondary);

  svg { width: 14px; height: 14px; }
  .g-sep { opacity: 0.4; }
}

.g-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.g-time {
  font-size: 0.72rem;
  color: var(--text-placeholder);
}
</style>
