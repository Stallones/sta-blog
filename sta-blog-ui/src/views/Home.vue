<template>
  <div class="home-content" >
    <!-- 搜索 + 公告 重叠区域 -->
    <div class="hc-header">
      <!-- 公告：底层，被搜索展开后遮挡 -->
      <div class="hc-notice">
        <SvgIcon style="min-width: 30px" name="notice" color="#409EFF" />
        {{ useWebsite?.webInfo?.headerNotification || "公告" }}
        <!-- <GradientText :text=" useWebsite?.webInfo?.headerNotification || '公告'" :mode="'static'"/> -->
      </div>
      <!-- 搜索：上层，可展开覆盖公告 -->
      <div class="hc-search" v-if="!isOnline">
        <SearchByPagefind  />
      </div>
      <!-- <RecommendArticle /> -->
    </div>

    <div>
      <Gallery />
    </div>
    <div>
      <Pagination />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useDemotion } from "@/composables/useDemotion";
import {
  registerHomeItems,
  unregisterHomeItems,
} from "@/components/FloatingMenu/registerGlobal";

const useWebsite = useWebsiteStore();
const { isOnline } = useDemotion();
onMounted(() => {
  registerHomeItems();
});

onUnmounted(() => {
  unregisterHomeItems();
});
</script>

<style lang="scss" scoped>
.home-content {
  @media screen and (max-width: 900px) {
  }
}

// 重叠容器：相对定位，搜索层叠于公告之上
.hc-header {
  position: relative;
  margin-bottom: 20px;
  // align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hc-notice {
  @include surface-card;
  border-radius: 50px; // 胶囊形覆盖 mixin 默认 12px
  display: flex;
  height: 50px;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  width: 100%;
}

.hc-search {
  border-radius: 50px;
  display: flex;
  height: 50px;
  align-items: center;
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
}
</style>
