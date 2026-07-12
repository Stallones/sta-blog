<script setup lang="ts">
import { useDemotion } from "@/composables/useDemotion";
import SComment from "@/components/SComment/index.vue";

const { isOnline } = useDemotion();
</script>

<template>
  <div class="message-page">
    <!-- 页面标题 -->
    <div class="message-page__header">
      <div class="message-page__title">留言板</div>
      <div class="message-page__desc">
        <p>欢迎访问留言板板块！</p>
        <p>
          留言板是一个方便与其他用户交流、分享观点和意见的平台。通过留言板，您可以：
        </p>
        <p>
          1、留下自己的留言：无论是对特定主题的讨论、对某篇文章的评论，还是向其他用户的提问，您都可以在留言板发表自己的留言。
        </p>
        <p>
          2、回复其他用户：看到其他用户的留言后，您可以进行回复和互动，分享自己的观点，提供帮助或者表达共鸣。
        </p>
        <p>支持：普通文档，markdown</p>
      </div>
    </div>

    <el-divider />

    <!-- 留言区：复用 SComment 组件，mode="message" + 无限滚动 -->
    <SComment mode="message" :server-on="isOnline" :is-show-header="true" />
  </div>
</template>

<style scoped lang="scss">
.message-page {
  width: 100%;
  @include glass-card;
  padding: 2.5rem;
}

.message-page__header {
  margin-bottom: 1rem;
}

.message-page__title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.message-page__desc {
  font-size: 0.85rem;
  color: #999;
  background: var(--mao-bg-message);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  line-height: 1.6;

  p {
    margin: 0.3rem 0;
  }
}
</style>
