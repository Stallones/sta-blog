<script setup lang="ts">
import { computed } from "vue";
import { useGalleryComponent } from "@/composables/useGalleryComponent";
import { useSearchStore } from "@/store/useSearchStore";

const { articlePagination } = useGalleryComponent();
const searchStore = useSearchStore();

/** 搜索联动 Gallery 时隐藏分页（搜索结果用自带的“显示更多”） */
const hidden = computed(() => !!searchStore.searchResults);
</script>

<template>
  <div v-if="!hidden" class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="articlePagination.total"
      :hide-on-single-page="true"
      :page-size="articlePagination.pageSize"
      @current-change="articlePagination.current = $event"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;

  // === 翻页器按钮：与卡片同色，按需高亮 ===

  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.el-pager li) {
    @include surface-card;
    width: 35px;
    height: 35px;
    min-width: 35px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 15px;
    background-color: var(--surface-bg);
    // color: var(--text-secondary);
    color: var(--color-gray-300);
    transition: color 0.2s, background-color 0.2s;
  }

  :deep(.btn-prev:hover),
  :deep(.btn-next:hover) {
    color: var(--color-white);
    background-color: var(--brand-orange);
  }

  :deep(.el-pager li:hover) {
    color: var(--color-white);
    background-color: var(--brand-orange);
  }

  // 当前页码：绿松石色背景 + 白字
  :deep(.el-pager li.is-active) {
    background-color: var(--color-success);
    color: var(--color-white);
  }

  // 禁用态不展示
  :deep(.btn-prev:disabled),
  :deep(.btn-next:disabled),
  :deep(.btn-prev[disabled]),
  :deep(.btn-next[disabled]),
  :deep(button[disabled]) {
    display: none !important;
  }
}
</style>
