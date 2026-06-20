<template>
  <div class="custom-layout">
    <!-- Nav（阅读模式下隐藏） -->
    <Nav v-if="!isReadingMode" />

    <!-- 裸露内容区：路由页面完全自主管理 -->
    <div class="custom-content">
      <router-view v-slot="{ Component, route: r }">
        <component :is="Component" :key="r.fullPath" />
      </router-view>
    </div>

    <!-- Footer（阅读模式下隐藏） -->
    <Footer v-if="showFooter && !isReadingMode" />

    <!-- 全局 FloatingMenu（阅读模式下隐藏） -->
    <FloatingMenu v-if="!isReadingMode" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Nav from "@/components/Nav/index.vue";
import Footer from "@/components/Footer/index.vue";
import FloatingMenu from "@/components/FloatingMenu/index.vue";
import { registerGlobalItems } from "@/components/FloatingMenu/registerGlobal";
import { useReadingMode } from "@/composables/useReadingMode";

const route = useRoute();
const { isReadingMode } = useReadingMode();

/** 默认不显示 Footer，meta.showFooter=true 时显示 */
const showFooter = computed(() => (route.meta.showFooter as boolean) ?? false);

onMounted(() => {
  registerGlobalItems();
});
</script>

<style scoped lang="scss">
.custom-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
