<script setup lang="ts">
import type { AppArticleRespVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";
import { useDemotion } from "@/composables/useDemotion";

const { imageOnline } = useDemotion();
defineProps<{ article: AppArticleRespVO }>();
</script>

<template>
  <div class="v-card">
    <!-- 封面在上 -->
    <div class="g-cover">
      <div class="g-cover-inner">
        <div class="g-img-wrap">
          <img v-if="imageOnline" class="g-img" v-lazy="true" :data-src="article.coverPath" alt="" />
          <div v-else class="img-placeholder">
            <!-- <span class="img-placeholder__text">图片</span> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区 — 上下居中 -->
    <div class="g-body">
      <div class="g-title">{{ article.title }}</div>
      <div class="g-tags">
        <el-icon><Calendar /></el-icon>
        <span> 发布于 {{dayjs(article.createTime).format("YYYY-MM-DD") }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><Folder /></el-icon>
        <span> {{ article.categoryName }} </span>
        <el-divider direction="vertical" class="g-divider" />
        <el-icon><View /></el-icon>
        <span> {{ article.visitCount }}</span>
      </div>
      <p class="g-desc">{{ article.summary }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.v-card {
  @include surface-card;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-bottom: $margin-bottom;

  @media (max-width: $bp) {
    min-height: 18rem;
  }

  &:hover .g-img { transform: scale(1.05); }
}

.g-cover {
  width: 100%;
  height: 12rem;
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
  color: var(--text-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { color: var(--accent-primary); }
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  flex-wrap: wrap;

  .g-divider {
    margin: 0 5px;
    border-left: 1px solid var(--text-secondary);
  }
  .g-tag-item { white-space: nowrap; }
}

.g-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--text-regular);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* 图片服务离线占位（固定样式，不跟随主题） */
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
  }

  &__text {
    position: relative;
    z-index: 1;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    user-select: none;
  }
}


</style>
