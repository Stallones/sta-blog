<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCategoryList } from "@/api/AppCategoryController";
import { getTagList } from "@/api/AppTagController";
import {
  getArticleListByCategory,
  getArticleListByTag,
} from "@/api/AppArticleController";
import Gallery from "@/components/Gallery/index.vue";

const route = useRoute();
const type = computed(() => route.params.type as string); // 'category' | 'tag'
const id = computed(() => Number(route.params.id));

const title = ref("");
const subTitle = ref("");
const articles = ref<any[]>([]);
const loading = ref(false);

async function fetchData() {
  loading.value = true;
  try {
    if (type.value === "category") {
      const res: any = await getCategoryList();
      const cats = Array.isArray(res) ? res : [];
      const cat = cats.find((c: any) => c.id === id.value);
      title.value = "分类";
      subTitle.value = cat?.categoryName || "";
      const artRes: any = await getArticleListByCategory({ categoryId: id.value });
      articles.value = Array.isArray(artRes) ? artRes : [];
    } else if (type.value === "tag") {
      const res: any = await getTagList();
      const tags = Array.isArray(res) ? res : [];
      const tag = tags.find((t: any) => t.id === id.value);
      title.value = "标签";
      subTitle.value = tag?.tagName || "";
      const artRes: any = await getArticleListByTag({ tagId: id.value });
      articles.value = Array.isArray(artRes) ? artRes : [];
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="common-archive-page">
    <div class="common-header">
      <h1 class="common-title">{{ title }} - {{ subTitle }}</h1>
      <div class="common-count" v-if="articles.length">
        共 {{ articles.length }} 篇文章
      </div>
    </div>

    <div v-if="loading" class="common-skeleton">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else-if="articles.length === 0" class="common-empty">
      <el-empty description="暂无文章" />
    </div>

    <Gallery v-else :articles="articles" />
  </div>
</template>

<style scoped lang="scss">
.common-archive-page {
  width: 100%;
}

.common-header {
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  box-shadow: var(--el-box-shadow-light);
  padding: 15px;
  border-radius: 8px;
  background-color: var(--el-fill-color-blank);

  .common-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin: 0;
  }

  .common-count {
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);
  }
}

.common-skeleton {
  padding: 1rem 0;
}

.common-empty {
  padding: 3rem 0;
  display: flex;
  justify-content: center;
}
</style>
