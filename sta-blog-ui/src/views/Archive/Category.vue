<script setup lang="ts">
import { getCategoryList } from "@/api/AppCategoryController";

const categorys = ref<any[]>([]);

onMounted(async () => {
  const res: any = await getCategoryList();
  categorys.value = Array.isArray(res) ? res : [];
});
</script>

<template>
  <div class="cat-page">
    <!-- <h2 class="cat-page-title">文章分类</h2> -->
    <div class="cat-list">
      <div
        v-for="cat in categorys"
        :key="cat.id"
        class="cat-item"
        @click="$router.push(`/archive/category/${cat.id}`)"
      >
        <span class="cat-dot" />
        <span class="cat-name">{{ cat.categoryName }}</span>
        <span class="cat-count">({{ cat.articleCount ?? 0 }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cat-page {
  width: 100%;
  background: var(--el-fill-color-blank);
  border-radius: $border-radius;
  box-shadow: var(--el-box-shadow-light);

  .cat-page-title {
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin: 0 0 1rem 0;
  }
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color-light);

    .cat-dot {
      transform: scale(1.3);
      background: #409eff;
    }

    .cat-name {
      color: #409eff;
    }
  }
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c0c4cc;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.cat-name {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
  transition: color 0.2s;
}

.cat-count {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
  margin-left: auto;
}
</style>
