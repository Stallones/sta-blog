<script setup lang="ts">
import type { AppArticleRespVO } from "@/types";
import { Calendar, Folder, View } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";
import { useDemotion } from "@/composables/useDemotion";

const { imageOnline } = useDemotion();
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
            v-if="imageOnline"
            class="g-img"
            v-lazy="true"
            :data-src="article.coverPath"
            alt=""
          />
          <div v-else class="img-placeholder">
            <!-- <span class="img-placeholder__text">图片</span> -->
          </div>
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
        <span>
          发布于 {{ dayjs(article.createTime).format("YYYY-MM-DD") }}
        </span>
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
  @include surface-card;
  display: flex;
  flex-direction: column;
  height: 200px;
  cursor: pointer;
  margin-bottom: $margin-bottom;
  // 扩展 surface-card 过渡：补充悬浮位移与边框色
  transition:
    transform $glass-transition,
    border-color $glass-transition,
    background $glass-transition,
    box-shadow $glass-transition;

  @media (min-width: $bp) {
    flex-direction: row;
    height: 14rem;
  }

  // 悬浮：整卡上浮 + 强调色光效（语义层 --accent-shadow-hover，随主题自动切换）
  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-border);
    box-shadow: var(--accent-shadow-hover);
  }

  &:hover .g-img {
    transform: scale(1.08);
  }

  &:hover .g-title {
    color: var(--accent-primary);
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
    padding: 0 2rem;
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

  // &:hover {
  //   color: var(--accent-primary);
  // }
}

.g-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  flex-wrap: wrap;
  color: var(--text-secondary);

  .g-divider {
    margin: 0 5px;
    border-left: 1px solid var(--text-secondary);
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
  color: var(--text-regular);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.g-time {
  font-size: 0.72rem;
  color: var(--text-placeholder);
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
