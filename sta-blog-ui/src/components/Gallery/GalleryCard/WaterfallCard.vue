<script setup lang="ts">
import type { ArticleVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";

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
      <img class="g-img" v-lazy="true" :data-src="article.coverPath" alt="" />

      <!-- overlay 模式的遮罩和浮动内容 -->
      <template v-if="overlay">
        <div class="w-overlay" />
        <div class="g-body w-overlay-body">
          <div class="g-title w-o-title">{{ article.title }}</div>
          <div class="g-tags w-o-tags">
            <el-icon><Calendar /></el-icon>
            <span> 发布于 {{  dayjs(article.createTime).format("YYYY-MM-DD") }} </span>
            <el-divider direction="vertical" class="g-divider" />
            <el-icon><Folder /></el-icon>
            <span> {{ article.categoryName }} </span>
            <el-divider direction="vertical" class="g-divider" />
            <el-icon><View /></el-icon>
            <span> {{ article.visitCount }}</span>
          </div>
          <p class="g-desc w-o-desc">{{ article.summary }}</p>
        </div>
      </template>
    </div>

    <!-- 非 overlay：信息在下 -->
    <div v-if="!overlay" class="g-body">
      <div class="g-title">{{ article.title }}</div>
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
      <p class="g-desc">{{ article.summary }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.w-card {
  break-inside: avoid;
  overflow: hidden;
  border-radius: $border-radius;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
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

.w-o-tags { color: rgba(255,255,255,.82);
  .g-divider { margin: 0 5px; color: rgba(255,255,255,.5); }
}
.w-o-desc { color: rgba(255,255,255,.76); }

/* ── 非 overlay 内容区 ── */
.g-body:not(.w-overlay-body) { padding: 0.7rem 1rem; display:flex; flex-direction:column; gap:0.2rem; }

/* ═══════ 统一元素样式 ═══════ */
.g-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover { color: var(--mao-accent); }
}

.w-card--overlay .g-title { color: #fff; }

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.32rem;
  font-size: 0.76rem;
  color: var(--el-text-color-secondary);
  flex-wrap: wrap;

  .g-divider {
    margin: 0 5px;
    border-left: 1px var(--el-text-color-secondary) var(--el-border-style);
  }
  .g-tag-item { white-space:nowrap; }
}

.g-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
</style>
