<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import { useArticleView } from "@/composables/useArticleView";
import { useTocTree } from "@/composables/useTocTree";
import TocItem from "@/components/SCard/TocItem.vue";

// 从全局状态读取目录抽屉显隐
const { MobTocVisible, toggleMobToc } = useArticleView();
const { tree: tocTree } = useTocTree();

// 关闭抽屉
const handleClose = () => {
  toggleMobToc();
};

// 点击跳转
const HEADER_OFFSET = 80;
function handleItemClick(id: string) {
  const target = document.getElementById(id);
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    toggleMobToc();
  }
}
</script>

<template>
  <el-drawer
    v-model="MobTocVisible"
    :with-header="true"
    size="50%"
    direction="rtl"
    :show-close="false"
    :before-close="handleClose"
  >
    <template #header>
      <span style="font-size: 1.2rem">目录</span>
      <el-button
        :icon="Close"
        style="background: none; font-size: 1.5rem; width: 30px; border: none"
        @click="handleClose()"
      />
    </template>
    <template #default>
      <div class="move_toc">
        <template v-if="tocTree.length > 0">
          <TocItem
            v-for="node in tocTree"
            :key="node.id"
            :node="node"
            activeId=""
            @click="handleItemClick"
          />
        </template>
        <div v-else class="toc-empty">暂无目录</div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.move_toc {
  text-align: left;

  :deep(.toc-item) {
    padding: 6px 4px;

    &:hover {
      color: var(--accent-primary);
    }

    &--active {
      background-color: var(--color-blue-50);
      color: var(--accent-primary);
      font-weight: bold;
    }
  }

  :deep(.toc-children) {
    margin-left: 12px;
  }

  .toc-empty {
    text-align: center;
    color: var(--text-placeholder);
    padding: 20px 0;
    font-size: 0.9rem;
  }
}
</style>
