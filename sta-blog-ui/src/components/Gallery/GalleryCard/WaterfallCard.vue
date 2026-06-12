<script setup lang="ts">
import type { ArticleVO } from "@/types";

defineProps<{
  article: ArticleVO;
  /** true = 模式7（信息浮于封面），false = 模式6（封面上+信息下） */
  overlay?: boolean;
}>();
</script>

<template>
  <div class="w-card" :class="{ 'w-card--overlay': overlay }">
    <!-- 封面 -->
    <div class="g-cover">
      <img class="g-img" v-lazy="true" :data-src="article.articleCover" alt="" />

      <!-- overlay 模式的遮罩和浮动内容 -->
      <template v-if="overlay">
        <div class="w-overlay" />
        <div class="g-body w-overlay-body">
          <div class="g-title w-o-title">{{ article.articleTitle }}</div>
          <div class="g-tags w-o-tags">
            <span class="g-tag-cat">{{ article.categoryName }}</span>
            <span v-for="tag in article.tags" :key="tag.id" class="g-tag-item">#{{ tag.tagName }}</span>
          </div>
          <div class="g-meta w-o-meta">
            <SvgIcon name="reading" /> {{ article.visitCount }}
            <span class="g-sep">|</span>
            <SvgIcon name="comments" /> {{ article.commentCount }}
            <span class="g-sep">|</span>
            <SvgIcon name="like" /> {{ article.likeCount }}
          </div>
          <p class="g-desc w-o-desc">{{ article.articleContent }}</p>
          <div class="g-time w-o-time">{{ article.createTime }}</div>
        </div>
      </template>
    </div>

    <!-- 非 overlay：信息在下 -->
    <div v-if="!overlay" class="g-body">
      <div class="g-title">{{ article.articleTitle }}</div>
      <div class="g-tags">
        <span class="g-tag-cat">{{ article.categoryName }}</span>
        <span v-for="tag in article.tags" :key="tag.id" class="g-tag-item">#{{ tag.tagName }}</span>
      </div>
      <div class="g-meta">
        <SvgIcon name="reading" /> {{ article.visitCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="comments" /> {{ article.commentCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="like" /> {{ article.likeCount }}
      </div>
      <p class="g-desc">{{ article.articleContent }}</p>
      <div class="g-time">{{ article.createTime }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.w-card {
  break-inside: avoid;
  overflow: hidden;
  border-radius: $border-radius;
  background-color: var(--mao-card-bg);
  box-shadow: var(--mao-box-shadow);
  cursor: pointer;
  margin-bottom: $margin-bottom;
  display: inline-block;
  width: 100%;

  @media (max-width: $bp) { display: flex; flex-direction: column; }

  &:hover .g-img { transform: scale(1.04); }
}

/* ── 统一封面 ── */
.g-cover {
  position: relative;
  width: 100%;

  .w-card--overlay & { aspect-ratio: 4/3; }
}

.g-img {
  width: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;

  .w-card:not(.w-card--overlay) & { max-height: 170px; }
}

/* ── Overlay 遮罩 ── */
.w-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to top,
    rgba(0,0,0,.7) 0%,
    rgba(0,0,0,.2) 50%,
    rgba(0,0,0,.08) 100%
  );
}

/* ── Overlay 浮层（上下居中）── */
.w-overlay-body {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.9rem 1.1rem;
  color: #fff;
}

.w-o-title { text-shadow: 0 1px 3px rgba(0,0,0,.5); }

.w-o-tags { color: rgba(255,255,255,.82); }
.w-o-meta { color: rgba(255,255,255,.8); svg{width:14px;height:14px;} }
.w-o-desc { color: rgba(255,255,255,.76); }
.w-o-time { color: rgba(255,255,255,.68); }

/* ── 非 overlay 内容区 ── */
.g-body:not(.w-overlay-body) { padding: 0.7rem 1rem; display:flex; flex-direction:column; gap:0.2rem; }

/* ═══════ 统一元素样式 ═══════ */
.g-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { color: var(--accent-color); }
}

.w-card--overlay .g-title { color: #fff; }

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.32rem;
  font-size: 0.76rem;
  color: var(--text-secondary);
  flex-wrap: wrap;

  .g-tag-cat::after { content:"|"; margin-left:.32rem; opacity:.5; }
  .g-tag-item { white-space:nowrap; }
}

.g-meta {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.72rem;
  color: var(--text-secondary);

  svg { width: 13px; height: 13px; }
  .g-sep { opacity: .4; }
}

.g-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.g-time { font-size: 0.72rem; color: var(--text-placeholder); }
</style>
