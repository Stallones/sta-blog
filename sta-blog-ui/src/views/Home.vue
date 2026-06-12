<template>
  <div class="home-content">
    <!-- 搜索 + 公告 重叠区域 -->
    <div class="hc-header">
      <!-- 公告：底层，被搜索展开后遮挡 -->
      <div class="hc-notice">
        <SvgIcon style="min-width: 30px" name="notice" color="#409EFF" />
        {{ useWebsite?.webInfo?.headerNotification || "公告" }}
        <!-- <GradientText :text=" useWebsite?.webInfo?.headerNotification || '公告'" :mode="'static'"/> -->
      </div>
      <!-- 搜索：上层，可展开覆盖公告 -->
      <div class="hc-search">
        <SearchByPagefind v-if="!useService.isServiceAvailable" />
      </div>
      <RecommendArticle />
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
import { useServiceStore } from "@/store/useServiceStore";
import { registerHomeItems, unregisterHomeItems } from "@/components/FloatingMenu/registerGlobal";


const useWebsite = useWebsiteStore();
const useService = useServiceStore();
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
}

.hc-notice {
  display: flex;
  height: 50px;
  padding: 0 16px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--mao-card-bg);
  // border: 1px solid var(--border-color-light);
  transition: all 0.3s ease;
  box-shadow: var(--mao-box-shadow);
  // 底层：被搜索展开后遮挡
  width: 100%;
}

.hc-search {
  display: flex;
  height: 50px;
  // padding: 0 16px;
  border-radius: 50px;
  align-items: center;
  // justify-content: center;
  // gap: 8px;
  // background: var(--mao-card-bg);
  // border: 1px solid var(--border-color-light);
  transition: all 0.3s ease;
  // box-shadow: var(--mao-box-shadow);
  // 底层：被搜索展开后遮挡
  // width: 50px;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 2; // 叠在公告之上
  // padding: 0;
  width: 100%;
}
</style>
