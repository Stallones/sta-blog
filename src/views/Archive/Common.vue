<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCategoryList } from "@/api/AppCategoryController";
import { getTagList } from "@/api/AppTagController";
import {
  getArticleListByCategory,
  getArticleListByTag,
} from "@/api/AppArticleController";
import {
  readCategoryList,
  readTagList,
  readArticleListByCategory,
  readArticleListByTag,
} from "@/utils/file-reader";
import { useDemotion } from "@/composables/useDemotion";
import Gallery from "@/components/Gallery/index.vue";

const route = useRoute();
const type = computed(() => route.params.type as string); // 'category' | 'tag'
const id = computed(() => Number(route.params.id));
const { requestOrRead } = useDemotion();

const title = ref("");
const subTitle = ref("");
const articles = ref<any[]>([]);
const loading = ref(false);

async function fetchData() {
  loading.value = true;
  try {
    if (type.value === "category") {
      const res: any = await requestOrRead(getCategoryList, readCategoryList);
      const cats = Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [];
      const cat = cats.find((c: any) => c.id === id.value);
      title.value = "分类";
      subTitle.value = cat?.categoryName || "";
      const artRes: any = await requestOrRead(
        getArticleListByCategory,
        readArticleListByCategory,
        { categoryId: id.value }
      );
      const artList = artRes?.data ?? artRes;
      articles.value = Array.isArray(artList) ? artList : [];
    } else if (type.value === "tag") {
      const res: any = await requestOrRead(getTagList, readTagList);
      const tags = Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [];
      const tag = tags.find((t: any) => t.id === id.value);
      title.value = "标签";
      subTitle.value = tag?.tagName || "";
      const artRes: any = await requestOrRead(
        getArticleListByTag,
        readArticleListByTag,
        { tagId: id.value }
      );
      const artList = artRes?.data ?? artRes;
      articles.value = Array.isArray(artList) ? artList : [];
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
      <div class="common-count" v-if="articles.length" v-slide-in>
        共 {{ articles.length }} 篇文章
      </div>
    </div>

    <div v-if="articles.length === 0 && !loading" class="common-empty">
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
  @include surface-card;
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 15px;

  .common-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .common-count {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
}

.common-empty {
  padding: 3rem 0;
  display: flex;
  justify-content: center;
}
</style>
