<template>
  <div class="home-content">
    <!-- 搜索 + 公告 重叠区域 -->
    <div class="home-header">
      <!-- 公告：底层，被搜索展开后遮挡 -->
      <div class="announcement">
        <SvgIcon style="min-width: 30px" name="notice" color="#409EFF" />
        <GradientText :text=" useWebsite?.webInfo?.headerNotification || '公告'" />
      </div>
      <!-- 搜索：上层，可展开覆盖公告 -->
      <OfflineSearch
        v-if="!useService.isServiceAvailable"
        class="search-layer"
      />
    </div>
    <RecommendArticle />

    <div>
      <CardEssay />
    </div>
    <div>
      <Pagination />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecommendArticle from "@/components/RecommendArticle.vue";
import OfflineSearch from "@/components/OfflineSearch.vue";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useServiceStore } from "@/store/useServiceStore";

const useWebsite = useWebsiteStore();
const useService = useServiceStore();
</script>

<style lang="scss" scoped>
.home-content {
  @media screen and (max-width: 900px) {
  }
}

// 重叠容器：相对定位，搜索层叠于公告之上
.home-header {
  position: relative;
  margin-bottom: 16px;
  justify-content: center;
  // align-items: center;
}

.announcement {
  display: flex;
  height: 50px;
  padding: 0 16px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--mao-background-color);
  border: 1px solid var(--border-color-light);
  transition: all 0.3s ease;
  // 底层：被搜索展开后遮挡
  width: 100%;
}
</style>
