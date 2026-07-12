<script setup lang="ts">
import type { AppArticleRespVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";

defineProps<{
  article: AppArticleRespVO;
  direction: "left" | "right";
}>();
</script>

<template>
  <div class="h-card" :class="`h-card--${direction}`">
    <!-- 封面 42% -->
    <div class="g-cover">
      <div class="g-cover-inner">
        <div class="g-img-wrap">
          <img
            class="g-img"
            v-lazy="true"
            :data-src="article.coverPath"
            alt=""
          />
        </div>
      </div>
    </div>

    <!-- 内容区 58% — 上下居中 -->
    <div class="g-body">
      <!-- 第1行：标题 -->
      <div class="g-title">{{ article.title }}</div>

      <!-- 第2行：分类 | #tag #tag | time-->
      <div class="g-tags">
        <el-icon><Calendar /></el-icon>
        <span> 发布于 {{  dayjs(article.createTime).format("YYYY-MM-DD") }} </span>
        <el-divider direction="vertical" class="g-divider" />

        <el-icon><Folder /></el-icon>
        <span> {{ article.categoryName }} </span>
        <el-divider direction="vertical" class="g-divider" />

        <el-icon><View /></el-icon>
        <span> {{ article.visitCount }}</span>
        <!-- <span v-for="tag in article.tags" :key="tag.id" class="g-tag-item">#{{ tag.tagName }}</span> -->
      </div>

      <!-- 第3行：meta -->
      <!-- <div class="g-meta">
        <SvgIcon name="reading" /> {{ article.visitCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="comments" /> {{ article.commentCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="like" /> {{ article.likeCount }}
        <span class="g-sep">|</span>
        <SvgIcon name="collection" /> {{ article.favoriteCount }}
      </div> -->

      <!-- 第4行：描述（最多2行） -->
      <p class="g-desc">{{ article.summary }}</p>

      <!-- 第5行：时间 -->
      <!-- <div class="g-time">{{ article.createTime }}</div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp: 768px;

.h-card {
  @include glass-card;
  display: flex;
  flex-direction: column;
  height: 200px;
  cursor: pointer;
  margin-bottom: $margin-bottom;

  @media (min-width: $bp) {
    flex-direction: row;
    height: 12rem;
  }

  &:hover .g-img {
    transform: scale(1.08);
  }

  &--left {
    @media (min-width: $bp) {
      flex-direction: row;
    }
  }
  &--right {
    @media (min-width: $bp) {
      flex-direction: row-reverse;
    }
  }
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

.g-img-wrap {
  overflow: hidden;
}

.g-img {
  width: 100%;
  height: 100%;
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
  gap: 1rem;

  @media (min-width: $bp) {
    width: 58%;
    padding: 0 1.25rem;
  }
}

.g-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: var(--mao-accent);
  }
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  flex-wrap: wrap;
  color: var(--el-text-color-secondary);

  .g-divider {
    margin: 0 5px;
    border-left: 1px var(--el-text-color-secondary) var(--el-border-style);
  }
  // .g-tag-cat::after { content: "|"; margin-left: 0.35rem; opacity: 0.5; }
  .g-tag-item {
    white-space: nowrap;
  }
}

// .g-meta {
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
//   font-size: 0.72rem;
//   color: var(--el-text-color-secondary);

//   svg {
//     width: 14px;
//     height: 14px;
//   }
//   .g-sep {
//     opacity: 0.4;
//   }
// }

.g-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  display: -webkit-box;
  color: var(--el-text-color-regular);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.g-time {
  font-size: 0.72rem;
  color: var(--el-text-color-placeholder);
}
</style>
