<template>
  <!-- 移动端导航栏 -->
  <div class="nav-mob" :class="{ hidden: isMenuHidden }">
    <span class="blog-info">
      <a href="/">{{ useWebsite.webInfo?.websiteName }}</a>
    </span>

    <div class="drawer-trigger" @click="drawer = true">
      <SvgIcon
        name="directory_icon"
        width="28"
        height="28"
        color="var(--accent-color)"
        class="icon"
      />
    </div>

    <SearchByDB :is-service-available="isServiceAvailable" />
  </div>

  <!-- 移动端抽屉菜单 -->
  <el-drawer
    v-model="drawer"
    :with-header="true"
    size="33%"
    direction="rtl"
    :show-close="false"
  >
    <template #header>
      <span style="font-size: 1.2rem">导航</span>
      <el-button
        :icon="Close"
        style="background: none; font-size: 1.5rem; width: 30px; border: none"
        @click="drawer = false"
      />
    </template>
    <template #default>
      <MenuListMob @update:closeDrawer="drawer = false" />
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useServiceStore } from "@/store/useServiceStore";

const isServiceAvailable = useServiceStore().isServiceAvailable;
const useWebsite = useWebsiteStore();
const drawer = ref(false);

// 滚动显隐
const isMenuHidden = ref(false);
let lastScrollTop = 0;

const handleScroll = () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop <= 0) {
    isMenuHidden.value = false;
  } else {
    isMenuHidden.value = currentScrollTop > lastScrollTop;
  }

  lastScrollTop = Math.max(0, currentScrollTop);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">
@use "@/styles/_layout" as *;

.nav-mob {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%; // 用 100% 而非 100vw，避免包含滚动条宽度导致溢出
  box-sizing: border-box;
  background-color: var(--mao-nav-bg);
  backdrop-filter: blur(6px);
  transition: top 0.3s ease-in-out;
  // border-bottom: 1px solid var(--mao-nav-border);

  html.dark & {
    background-color: var(--mao-nav-bg);
    // border-bottom-color: var(--mao-nav-border);
  }

  &.hidden {
    top: -45px;
  }

  @media screen and (min-width: #{$bp-tablet + 1}px) {
    display: none;
  }
}

.blog-info {
  font-weight: bold;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.drawer-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
