<script setup lang="ts">
import { getCategoryList } from "@/api/AppCategoryController";
import { readCategoryList } from "@/utils/file-reader";
import { useDemotion } from "@/composables/useDemotion";
import { useCanvasEffects } from "@/composables/useCanvasEffects";

const categorys = ref<any[]>([]);
const { canvasHeaderH } = useCanvasEffects();
const { requestOrRead } = useDemotion();

onMounted(async () => {
  const res: any = await requestOrRead(getCategoryList, readCategoryList);
  const list = res?.data ?? res;
  categorys.value = Array.isArray(list) ? list : [];
  canvasHeaderH.value = window.innerHeight * 0.6;
});
</script>

<template>
  <div class="cat-page" v-slide-in>
    <div class="page-header">
      <h1 class="page-title">
        <svg class="page-title-icon" viewBox="0 0 1024 1024" width="1.4rem" height="1.4rem" fill="currentColor">
          <path d="M192 128v768h640V341.376L618.624 128H192z m0-64h448l256 256v640c0 17.664-14.336 32-32 32H160c-17.664 0-32-14.336-32-32V96c0-17.664 14.336-32 32-32h32z m384 64v224h224v64H544c-17.664 0-32-14.336-32-32V128h64z m-192 352h320v64H384v-64z m0 160h320v64H384v-64z m0 160h224v64H384v-64z"/>
        </svg>
        分类
      </h1>
    </div>
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
  @include surface-card;
  padding: var(--page-padding);
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &-icon {
    flex-shrink: 0;
    color: var(--accent-primary);
  }
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
    background: var(--surface-inner-bg);

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
  color: var(--text-primary);
  transition: color 0.2s;
}

.cat-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: auto;
}
</style>
