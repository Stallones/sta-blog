<script setup lang="ts">
import type { AppArticleRespVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";

defineProps<{ article: AppArticleRespVO }>();
</script>

<template>
  <div class="o-card">
    <!-- 封面背景 -->
    <div class="g-cover">
      <img class="g-img" v-lazy="true" :data-src="article.coverPath" alt="" />
      <div class="o-overlay" />
    </div>

    <!-- 浮动内容 — 上下居中 左对齐 -->
    <div class="g-body o-body">
      <div class="g-title o-title">{{ article.title }}</div>
      <div class="g-tags o-tags">
        <el-icon><Calendar /></el-icon>
        <span> 发布于 {{ dayjs(article.createTime).format("YYYY-MM-DD") }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><Folder /></el-icon>
        <span> {{ article.categoryName }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><View /></el-icon>
        <span> {{ article.visitCount }}</span>
      </div>
      <p class="g-desc o-desc">{{ article.summary }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.o-card {
  @include surface-card;
  position: relative;
  height: 15rem;
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
  background: var(--cover-shadow);
}

/* ── 浮动内容（上下居中、左对齐）── */
.o-body {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.g-title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.35;
  /* 文字阴影保证可读性 */
  text-shadow: 0 1px 4px hsla(0, 0%, 0%, 0.45);
  color: var(--text-on-dark-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-on-dark-secondary);
  flex-wrap: wrap;

  .g-divider {
    margin: 0 5px;
    border-left: 1px solid hsl(0, 0%, 85%);
  }
  .g-tag-item { white-space: nowrap; }
}

.g-desc {
  font-size: 0.84rem;
  line-height: 1.4;
  color: var(--text-on-dark-regular);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
</style>
