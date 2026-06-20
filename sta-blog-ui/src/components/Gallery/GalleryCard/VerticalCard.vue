<script setup lang="ts">
import type { ArticleVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";

defineProps<{ article: ArticleVO }>();
</script>

<template>
  <div class="v-card">
    <!-- 封面在上 -->
    <div class="g-cover">
      <div class="g-cover-inner">
        <div class="g-img-wrap">
          <img class="g-img" v-lazy="true" :data-src="article.articleCover" alt="" />
        </div>
      </div>
    </div>

    <!-- 内容区 — 上下居中 -->
    <div class="g-body">
      <div class="g-title">{{ article.articleTitle }}</div>
      <div class="g-tags">
        <el-icon><Calendar /></el-icon>
        <span> 发布于 {{ article.createTime }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><Folder /></el-icon>
        <span> {{ article.categoryName }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><View /></el-icon>
        <span> {{ article.visitCount }}</span>
      </div>
      <p class="g-desc">{{ article.articleContent }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.v-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: $border-radius;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;
  margin-bottom: $margin-bottom;

  @media (max-width: $bp) {
    min-height: 18rem;
  }

  &:hover .g-img { transform: scale(1.05); }
}

.g-cover {
  width: 100%;
  height: 11rem;
  flex-shrink: 0;

  @media (max-width: $bp) { height: 10rem; }
}

.g-cover-inner,
.g-img-wrap {
  position: relative;
  width: 100%; height: 100%;
}
.g-img-wrap { overflow: hidden; }

.g-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

/* ── 统一内容区 ── */
.g-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 1.5rem;
  gap: 1rem;
}

.g-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { color: var(--mao-accent); }
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--el-text-color-secondary);
  flex-wrap: wrap;

  .g-divider {
    margin: 0 5px;
    border-left: 1px var(--el-text-color-secondary) var(--el-border-style);
  }
  .g-tag-item { white-space: nowrap; }
}

.g-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}


</style>
