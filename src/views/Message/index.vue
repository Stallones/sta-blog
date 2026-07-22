<script setup lang="ts">
import { useDemotion } from "@/composables/useDemotion";
import SComment from "@/components/SComment/index.vue";

const { isOnline } = useDemotion();
</script>

<template>
  <div class="message-page" v-slide-in>
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <svg class="page-title-icon" viewBox="0 0 1024 1024" width="1.4rem" height="1.4rem" fill="currentColor">
          <path d="M512 64L64 384v512h896V384L512 64z m0 73.824L873.52 384H150.48L512 137.824zM128 448h768v384H128V448z m224 96c-17.664 0-32 14.336-32 32s14.336 32 32 32h320c14.336 0 32-14.336 32-32s-14.336-32-32-32H352z"/>
        </svg>
        留言板
      </h1>
    </div>
    <div class="message-page__desc">
        <p>欢迎访问留言板板块！</p>
        <p>
          留言板是一个方便与其他用户交流、分享观点和意见的平台。通过留言板，您可以：
        </p>
        <p>
          1、留下自己的留言：无论是对特定主题的讨论、某篇文章的评论，还是向其他用户的提问，您都可以在留言板发表自己的留言。
        </p>
        <p>
          2、回复其他用户：看到其他用户的留言后，您可以进行回复和互动，分享自己的观点，提供帮助或者表达共鸣。
        </p>
        <p>支持：普通文档，markdown</p>
    </div>

    <el-divider />

    <!-- 留言区：复用 SComment 组件，mode="message" + 无限滚动 -->
    <SComment mode="message" :server-on="isOnline" :is-show-header="true" />
  </div>
</template>

<style scoped lang="scss">
.message-page {
  width: 100%;
  @include surface-card;
  padding: var(--page-padding);
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &-icon {
    flex-shrink: 0;
    color: var(--accent-primary);
  }
}

.message-page__desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--surface-bg);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  line-height: 1.6;

  p {
    margin: 0.3rem 0;
  }
}
</style>
