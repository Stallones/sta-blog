<template>
  <nav
    class="hh-nav"
    :class="{ 'nav-hidden': isHidden, 'nav-transparent': isTransparent }"
  >
    <!-- 左侧：品牌名 -->
    <span class="blog-info">
      <a href="/">{{ useWebsite.webInfo?.websiteName }}</a>
    </span>

    <!-- 右侧：导航菜单 + 搜索 + 登录 -->
    <div class="nav-menus">
      <NavList />
      <SearchByDB :is-service-available="isServiceAvailable" />
      <UserLogin :is-service-available="isServiceAvailable" />
    </div>
  </nav>

  <div class="hh-mob-nav">
    <NavForMob />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import NavList from "./NavList.vue";
import SearchByDB from "./SearchByDB.vue";
import UserLogin from "./UserLogin.vue";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useServiceStore } from "@/store/useServiceStore";
import NavForMob from "./NavForMob/index.vue";

const useWebsite = useWebsiteStore();
const isServiceAvailable = useServiceStore().isServiceAvailable;
const route = useRoute();

const isHidden = ref(false);
const isTransparent = ref(false);
let lastScrollTop = 0;
let scrollTimeout: number | undefined;

const handleScroll = () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  const isHomePage = route.path === "/";

  // 首页且滚动位置为0时，透明菜单
  if (currentScrollTop === 0 && isHomePage) {
    isTransparent.value = true;
  } else {
    isHidden.value = currentScrollTop > lastScrollTop;
  }

  // 立即更新背景透明状态
  isTransparent.value = currentScrollTop === 0;

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

const debounceBackground = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = window.setTimeout(() => {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    isTransparent.value = currentScrollTop === 0;
  }, 100); // 100ms 防抖时间
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("scroll", debounceBackground);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("scroll", debounceBackground);
});
</script>

<style scoped lang="scss">
@use "../../styles/_layout" as *;

// ── 桌面导航 ──

nav {
  position: fixed;
  display: flex;
  justify-content: space-between; // 左右两端对齐
  align-items: center;
  top: 0;
  height: 50px;
  width: 100%;
  z-index: 10;
  background-color: var(--mao-nav-bg);
  backdrop-filter: blur(6px);
  transition: top 0.3s ease-in-out, background-color 0.3s ease-in-out;
  // border-bottom: 1px solid var(--mao-nav-border);
  padding: 0 1.5rem;
  box-sizing: border-box;

  &.nav-hidden {
    top: -50px;
  }

  &.nav-transparent {
    height: 60px;
    border-bottom: 1px solid var(--mao-background-color);
    background-color: transparent;
    backdrop-filter: none;
    border-bottom-color: transparent;
    box-shadow: none;
    color: #fff;

    :deep(*) {
      color: #fff !important;
    }
  }

  // ≤$bp-tablet 切换到移动端导航（与 NavForMob 断点对齐）
  @include tablet-down($breakpoint: $bp-tablet) {
    display: none;
  }

  .blog-info {
    height: 100%;
    display: flex;
    align-items: center;
    // 不再 flex:1，让右侧菜单自然靠右
    flex-shrink: 0;

    white-space: nowrap; // 品牌名不换行
    font-weight: bold;
    font-size: 1.1rem;

    a {
      text-decoration: none;
      color: inherit;
    }
  }

  .nav-menus {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0; // 右侧整体不被压缩
    min-width: 0; // 允许内部元素收缩空间，但不影响字体大小
  }
}
</style>
