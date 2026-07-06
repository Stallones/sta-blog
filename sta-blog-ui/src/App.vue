<template>
  <router-view v-if="isReady" />

  <Loading></Loading>
   <!-- <Music /> -->
   <RightClickMenu />
   <SearchDialog />
   <DevToolsBlocker :enableDevToolsBlocker="true" />
   <!-- <CanvasLayer :imageUrl="aaa" /> -->
   <CanvasLayer  />
</template>

<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useUserStore } from "@/store/useUserStore";
import DevToolsBlocker from "@/components/DevToolsBlocker.vue";
import RightClickMenu from "@/components/RightClickMenu.vue";
import { useDemotion } from "@/composables/useDemotion";
import { useLoading } from "@/composables/useLoading";
import Loading from "@/components/Loading.vue";
import CanvasLayer from "@/components/CanvasLayer/index.vue";

const { isReady, checkService } = useDemotion();
const { show: showLoading, hide: hideLoading } = useLoading();
const useWebsite = useWebsiteStore();
const useUser = useUserStore();

onMounted(async () => {
  // 全局 Loading：启动时一次性显示
  showLoading();

  // 1. 先做健康检查（设定 isOnline，供后续 requestOrRead 判断）
  await checkService();

  // 2. 并行获取数据
  const tasks: Promise<any>[] = [useWebsite.getInfo()];

  // 有本地 Token 时恢复登录态（hasToken 每次重新读 localStorage）
  if (useUser.hasToken()) {
    tasks.push(useUser.getInfo());
  }

  await Promise.all(tasks);

  // 全部完成后关闭全局 Loading
  hideLoading();
});

useDark({
  selector: "html",
  attribute: "class",
  valueLight: "light",
  valueDark: "dark",
})
</script>

<style scoped lang="scss"></style>
