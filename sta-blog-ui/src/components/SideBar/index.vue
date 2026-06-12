<!-- 侧边栏 -->
<template>
  <BloggerInfoCard />

  <PublicCard />

  <ClocksCard />

  <div v-if="showRandom">
    <RandomCard />
  </div>

  <TagListCard />

  <ChargingCard />

  <DailySoupCard />

  <WebsiteCard />
</template>

<script setup lang="ts">
import { useServiceStore } from "@/store/useServiceStore";

const isServiceAvailable = useServiceStore().isServiceAvailable;
const showRandom = ref(false);
showRandom.value = isServiceAvailable;
</script>

<style lang="scss" scoped>
// 侧边栏样式已提取到独立的 SCard 组件中
</style>
