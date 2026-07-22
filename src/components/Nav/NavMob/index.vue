<template>
  <!-- 移动端导航栏 -->
  <div class="nav-mob" :class="{ hidden: isMenuHidden }">
    <span class="blog-info">
      <a >{{ useWebsite.webInfo?.websiteName }}</a>
    </span>

    <!-- 右侧：搜索 + 抽屉 -->
    <div class="nav-mob__actions">
      <!-- 移动端搜索按钮 -->
      <div class="search-trigger" @click="searchStore.openDialog()">
        <!-- <svg-icon name="search"/> -->
        <el-icon><Search /></el-icon>
      </div>

      <div class="menu-trigger" @click="drawer = true">
        <el-icon><Menu /></el-icon>
      </div>
    </div>
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
import { Close, Search,Menu } from "@element-plus/icons-vue";
import { useSiteStore } from "@/store/useSiteStore";
import { useSearchStore } from "@/store/useSearchStore";

const useWebsite = useSiteStore();
const searchStore = useSearchStore();
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
.nav-mob {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%; // 用 100% 而非 100vw，避免包含滚动条宽度导致溢出
  box-sizing: border-box;
  background-color: var(--nav-bg);
  backdrop-filter: var(--nav-blur);
  border-bottom: 1px solid var(--nav-border);
  transition: top 0.3s ease-in-out;

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
  text-overflow: ellipsis;
  max-width: 160px;
}

.nav-mob__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 25px;
  color: var(--text-primary);
}

.search-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 25px;
  color: var(--text-primary);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
