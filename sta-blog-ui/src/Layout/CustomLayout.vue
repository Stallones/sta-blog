<template>
  <div class="custom-layout">
    <!-- needNav: true(默认) → 只显示 Nav，无 banner -->
    <Header v-if="needNav" headerType="none" />

    <!-- 裸露内容区：无 wrapper、无 padding、无 max-width，完全交给路由页面 -->
    <router-view v-slot="{ Component, route: r }">
      <transition name="el-fade-in-linear">
        <component :is="Component" :key="r.fullPath" />
      </transition>
    </router-view>

    <!-- Footer: 默认不显示，meta.showFooter=true 时显示 -->
    <Footer v-if="showFooter" />

    <!-- 全局 FloatingMenu -->
    <FloatingMenu />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header/index.vue";
import Footer from "@/components/Footer/index.vue";
import FloatingMenu from "@/components/FloatingMenu/index.vue";
import { registerGlobalItems } from "@/components/FloatingMenu/registerGlobal";

const route = useRoute();

/** 默认显示 Nav，meta.needNav=false 时隐藏整个 Header */
const needNav = computed(() => route.meta.needNav !== false);

/** 默认不显示 Footer，meta.showFooter=true 时显示 */
const showFooter = computed(() => (route.meta.showFooter as boolean) ?? false);

// 注册全局功能项
onMounted(() => {
  registerGlobalItems();
});
</script>

<style scoped lang="scss">
.custom-layout {
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
</style>
