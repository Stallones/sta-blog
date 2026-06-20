<template>
  <!-- loading 占位：数据未就绪时显示骨架屏 -->
  <div v-if="!articleVO.id" class="sidebar-loading">
    <el-skeleton :rows="8" animated />
  </div>

  <!-- 数据就绪后渲染侧边栏内容 -->
  <div v-else class="article-sidebar__content">
    <BloggerInfoCard />
    <ClocksCard />
    <div class="sticky_layout">
      <DirectoryCard />

      <RandomCard
        :categoryId="articleVO.categoryId.toString()"
        :articleId="(route.params.id as string) || undefined"
        title="相关推荐"
        prefix-icon="query_tasks"
        v-if="showRandom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useDemotion } from "@/composables/useDemotion";
import { useArticleStore } from "@/store/useArticleStore";

import DirectoryCard from "@/components/SCard/DirectoryCard.vue";

const route = useRoute();
const { isOnline } = useDemotion();
const articleStore = useArticleStore();
const { articleVO } = storeToRefs(articleStore);


// 服务可用时展示相关推荐
const showRandom = ref(false);

onMounted(() => {
  if (isOnline) {
    showRandom.value = true;
  }
});
</script>

<style scoped lang="scss">
.article-sidebar__content {
  flex: 1; // 撑满父级 .main-sidebar（flex column），让 sticky 有旅行空间
}

.sticky_layout {
  top: 50px;
  position: sticky;
  transition: top 0.3s;
}

.sidebar-loading {
  padding: 1rem;
}
</style>
