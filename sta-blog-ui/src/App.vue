<template>
  <router-view v-if="useService.afterCheckService" />

  <Loading></Loading>
   <Music />
  <DevToolsBlocker :enableDevToolsBlocker="true" />
  <RightClickMenu />
  <!-- <CanvasLayer :imageUrl="aaa" /> -->
  <CanvasLayer  />
</template>

<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import DevToolsBlocker from "@/components/DevToolsBlocker.vue";
import RightClickMenu from "@/components/RightClickMenu.vue";
// import MusicAi from "@/components/Music-ai/index.vue";
import Music from "@/components/Music-ai/index.vue";
import { useServiceStore } from "@/store/useServiceStore";
import Loading from "@/components/Loading.vue";
import CanvasLayer from "@/components/CanvasLayer/index.vue";
import aaa from "@/assets/images/学习的史蒂夫.jpg";

const useService = useServiceStore();
const useWebsite = useWebsiteStore();

onMounted(async () => {
  //服务状态
  await useService.checkService();
  //网站信息
  useWebsite.getInfo();
});

useDark({
  selector: "html",
  attribute: "class",
  valueLight: "light",
  valueDark: "dark",
})
</script>

<style scoped lang="scss"></style>
