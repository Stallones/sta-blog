<template>
  <nav
    class="h-nav"
    :class="{ 'nav-hidden': isHidden, 'nav-transparent': isTransparent }"
  >
    <!-- <div class="nav-bg"></div> -->
    <!-- 左侧：品牌名 -->
    <span class="blog-info">
      <a href="/">{{ useWebsite.webInfo?.websiteName }}</a>
    </span>

    <!-- 右侧：导航菜单 + 登录 -->
    <MenuList />
  </nav>

  <div class="h-nav-mob">
    <NavMob />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useSiteStore } from "@/store/useSiteStore";

const useWebsite = useSiteStore();
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
  background-color: var(--nav-bg);
  backdrop-filter: var(--nav-blur);
  border-bottom: 1px solid var(--nav-border);
  box-shadow: var(--nav-shadow);
  transition:
    top 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  padding: 0 1.5rem;
  box-sizing: border-box;

  &.nav-hidden {
    top: -50px;
  }

  &.nav-transparent {
    background-color: transparent;
    backdrop-filter: none;
    border-bottom: 1px solid var(--nav-border-transparent);
    box-shadow: none;
    color: var(--text-on-dark-primary);

    :deep(*) {
      color: var(--text-on-dark-primary) !important;
    }

    /* 子菜单下拉恢复正常文字颜色（亮色背景上不能用白字） */
    :deep(.menus_item_child),
    :deep(.menus_item_child *) {
      color: var(--text-primary) !important;
    }

    /* dark 模式下子菜单也正常 */
    html.dark & :deep(.menus_item_child),
    html.dark & :deep(.menus_item_child *) {
      color: var(--text-primary) !important;
    }
  }

  // ≤$bp-tablet 切换到移动端导航（与 NavMob 断点对齐）
  @include tablet-down($breakpoint: $bp-tablet) {
    display: none;
  }

  // .nav-bg {
  //   position: absolute;
  //   inset: 0;
  //   background: linear-gradient(
  //     135deg,
  //     hsla(220, 70%, 50%, 0.15) 0%,
  //     hsla(280, 60%, 50%, 0.1) 50%,
  //     hsla(180, 60%, 40%, 0.1) 100%
  //   );
  //   z-index: 0;
  // }

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
}
</style>
