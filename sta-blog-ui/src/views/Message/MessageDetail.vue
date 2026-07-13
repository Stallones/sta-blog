<script setup lang="ts">
/**
 * MessageDetail — 留言详情页（兼容旧路由）
 *
 * 新设计中留言列表已支持内联回复展开，
 * 此页面保留用于兼容旧的 /message/detail/:id 链接。
 * 直接跳转回留言板列表。
 */
const router = useRouter();

onMounted(() => {
  router.replace("/message");
});
</script>

<template>
  <div class="message-detail-redirect">
    正在跳转到留言板...
  </div>
</template>

<style scoped>
.message-detail-redirect {
  text-align: center;
  padding: 40px;
  color: var(--text-placeholder);
  font-size: 14px;
}
</style>
