<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import Card from "@/components/SCard/Card.vue";
import TocItem from "@/components/SCard/TocItem.vue";
import { useArticleView } from "@/composables/useArticleView";
import { useTocTree } from "@/composables/useTocTree";

const { tocList } = useArticleView();
const { tree } = useTocTree();

const activeId = ref("");
const tocRef = ref<HTMLElement | null>(null);

// ── IntersectionObserver 滚动高亮 ──
let observer: IntersectionObserver | null = null;
let clickLocked = false;
let clickLockTimer: ReturnType<typeof setTimeout> | null = null;
const HEADER_OFFSET = 80;
const CLICK_LOCK_DURATION = 1200; // 覆盖 smooth scroll 时长

function unlockAfterScroll() {
  if (clickLockTimer) clearTimeout(clickLockTimer);
  clickLockTimer = setTimeout(() => {
    clickLocked = false;
  }, CLICK_LOCK_DURATION);
}

function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    () => {
      // 点击跳转滚动期间，防止 observer 覆盖手动设置的 activeId
      if (clickLocked) return;

      // 实时查询所有 heading DOM，不依赖 Map 缓存
      const headings = document.querySelectorAll(
        "#preview-only-preview h2[id], #preview-only-preview h3[id], #preview-only-preview h4[id], #preview-only-preview h5[id], #preview-only-preview h6[id]"
      );

      // 找到当前激活的标题：视口中 top 最小且 >= -HEADER_OFFSET 的
      let closestId = "";
      let closestTop = Infinity;

      for (const h of headings) {
        const id = h.id;
        const rect = h.getBoundingClientRect();
        const top = rect.top;

        // 标题在有效视口区域内
        if (top >= -HEADER_OFFSET && top < window.innerHeight) {
          if (top < closestTop) {
            closestTop = top;
            closestId = id;
          }
        }
      }

      // 如果没有标题在视口内，找最接近顶部且已滚过的
      if (!closestId) {
        let bestTop = -Infinity;
        for (const h of headings) {
          const top = h.getBoundingClientRect().top;
          if (top <= HEADER_OFFSET && top > bestTop) {
            bestTop = top;
            closestId = h.id;
          }
        }
      }

      if (closestId) {
        activeId.value = closestId;
      }
    },
    {
      root: null,
      rootMargin: `0px 0px -50% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  nextTick(() => {
    const headings = document.querySelectorAll(
      "#preview-only-preview h2[id], #preview-only-preview h3[id], #preview-only-preview h4[id], #preview-only-preview h5[id], #preview-only-preview h6[id]"
    );
    for (const h of headings) {
      observer!.observe(h);
    }
  });
}

// ── 点击跳转 ──
function handleItemClick(id: string) {
  const target = document.getElementById(id);
  if (target) {
    activeId.value = id;
    // 锁定 observer，防止滚动期间覆盖 activeId
    clickLocked = true;
    const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    unlockAfterScroll();
  }
}

// ── 目录列表滚动时让激活项可见 ──
watch(activeId, () => {
  if (!tocRef.value) return;
  const activeEl = tocRef.value.querySelector(".toc-item--active");
  if (activeEl) {
    activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
});

onMounted(() => {
  setupObserver();
});

watch(tocList, () => {
  nextTick(() => setupObserver());
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <Card name="toc" variant="default" title="目录" prefix-icon="directory">
    <div ref="tocRef" class="toc-content">
      <TocItem
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :activeId="activeId"
        @click="handleItemClick"
      />
      <div v-if="tree.length === 0" class="toc-empty">暂无目录</div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.toc-content {
  min-height: 100px;
  overflow-y: auto;
  text-align: left;
}

.toc-empty {
  text-align: center;
  color: var(--text-placeholder);
  padding: 20px 0;
}
</style>
