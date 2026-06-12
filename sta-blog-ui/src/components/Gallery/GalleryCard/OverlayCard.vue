<script setup lang="ts">
import type { ArticleVO } from "@/types";

defineProps<{ article: ArticleVO }>();
</script>

<template>
  <div class="o-card">
    <!-- 封面背景 -->
    <div class="g-cover">
      <img class="g-img" v-lazy="true" :data-src="article.articleCover" alt="" />
      <div class="o-overlay" />
    </div>

    <!-- 浮动内容 — 上下居中 左对齐 -->
    <div class="g-body o-body">
      <div class="g-title">{{ article.articleTitle }}</div>
      <div class="g-tags o-tags">
        <span class="g-tag-cat">{{ article.categoryName }}</span>
        <span v-for="tag in article.tags" :key="tag.id" class="g-tag-item">#{{ tag.tagName }}</span>
      </div>
      <div class="g-meta o-meta">
        <SvgIcon name="reading" /> {{ article.visitCount }}&nbsp;
        <span class="g-sep">|</span>&nbsp;
        <SvgIcon name="comments" /> {{ article.commentCount }}&nbsp;
        <span class="g-sep">|</span>&nbsp;
        <SvgIcon name="like" /> {{ article.likeCount }}
      </div>
      <p class="g-desc o-desc">{{ article.articleContent }}</p>
      <div class="g-time o-time">{{ article.createTime }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.o-card {
  position: relative;
  height: 15rem;
  overflow: hidden;
  border-radius: $border-radius;
  background-color: var(--mao-card-bg);
  box-shadow: var(--mao-box-shadow);
  cursor: pointer;
  margin-bottom: $margin-bottom;
}

/* ── 封面背景 ── */
.g-cover {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.g-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .o-card:hover & { transform: scale(1.05); }
}

.o-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0.55) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

/* ── 浮动内容（上下居中、左对齐）── */
.o-body {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.25rem 1.5rem;
  color: var(--text-primary); /* 与其他mode一致，不硬编码白色 */
}

.g-title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.35;
  /* 文字阴影保证可读性 */
  text-shadow: 0 1px 4px rgba(0,0,0,.45);
  color: #fff; /* 覆盖模式必须白色才能在深色背景上可见 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,.85);
  flex-wrap: wrap;

  .g-tag-cat::after { content:"|"; margin-left:.35rem; opacity:.5; }
  .g-tag-item { white-space:nowrap; }
}

.g-meta {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.76rem;
  color: rgba(255,255,255,.82);

  svg { width:14px; height:14px; }
  .g-sep { opacity:.5; }
}

.g-desc {
  font-size: 0.84rem;
  line-height: 1.4;
  color: rgba(255,255,255,.78);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.g-time { font-size: 0.74rem; color: rgba(255,255,255,.7); }
</style>
