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
import DevToolsBlocker from "@/components/DevToolsBlocker.vue";
import RightClickMenu from "@/components/RightClickMenu.vue";
import { useDemotion } from "@/composables/useDemotion";
import Loading from "@/components/Loading.vue";
import CanvasLayer from "@/components/CanvasLayer/index.vue";

const { isReady, checkService, requestOrRead } = useDemotion();
const useWebsite = useWebsiteStore();

onMounted(async () => {
  //服务状态
  await checkService();
  //网站信息
  useWebsite.getInfo(requestOrRead);
});

useDark({
  selector: "html",
  attribute: "class",
  valueLight: "light",
  valueDark: "dark",
})
</script>

<style scoped lang="scss"></style>
