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
import { onMounted, onUnmounted } from "vue";
import { useDark } from "@vueuse/core";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useUserStore } from "@/store/useUserStore";
import DevToolsBlocker from "@/components/DevToolsBlocker.vue";
import RightClickMenu from "@/components/RightClickMenu.vue";
import { useDemotion } from "@/composables/useDemotion";
import { useLoading } from "@/composables/useLoading";
import { useArticleView } from "@/composables/useArticleView";
import { throttle } from "@/utils/optimize";
import Loading from "@/components/Loading.vue";
import CanvasLayer from "@/components/CanvasLayer/index.vue";

const { isReady, setReady, checkService, checkYiyuan, checkImage } = useDemotion();
const { show: showLoading, hide: hideLoading } = useLoading();
const { scrollPercentage } = useArticleView();
const useWebsite = useWebsiteStore();
const useUser = useUserStore();

// ── 全局 scroll 监听（写入共享变量 scrollPercentage）──
function scrollWork() {
  const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
  const scrollHeight = pageHeight - screenHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollPercentage.value = Math.min(100, Math.max(0, percent));
}

const throttledScroll = throttle(() => {
  window.requestAnimationFrame(scrollWork);
}, 40);

onMounted(async () => {
  // 全局 Loading：启动时一次性显示
  showLoading();

  // 1. 并行健康检查（后端 + 一言 + 图片，各自独立，一次性判定）
  await Promise.all([checkService(), checkYiyuan(), checkImage()]);

  // 2. 并行获取数据
  const tasks: Promise<any>[] = [useWebsite.getInfo()];

  // 有本地 Token 时恢复登录态（hasToken 每次重新读 localStorage）
  if (useUser.hasToken()) {
    tasks.push(useUser.getInfo());
  }

  await Promise.all(tasks);

  // 全部完成后关闭全局 Loading，并触发 router-view 渲染
  hideLoading();
  setReady();

  // 启动全局 scroll 监听（写入共享 scrollPercentage）
  window.addEventListener("scroll", throttledScroll);
  scrollWork();
});

onUnmounted(() => {
  window.removeEventListener("scroll", throttledScroll);
});

useDark({
  selector: "html",
  attribute: "class",
  valueLight: "light",
  valueDark: "dark",
})
</script>

<style scoped lang="scss"></style>
