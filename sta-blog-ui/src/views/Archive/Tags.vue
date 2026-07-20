<script setup lang="ts">
import { getTagList } from "@/api/AppTagController";
import { readTagList } from "@/utils/file-reader";
import { useDemotion } from "@/composables/useDemotion";
import { getHslCircleColors, getHslColors } from "@/utils/colorHsl";
import { useCanvasEffects } from "@/composables/useCanvasEffects";

const { canvasHeaderH } = useCanvasEffects();
const { requestOrRead } = useDemotion();
const tags = ref<any[]>([]);

// 字体大小池（根据文章数量分级）
const FONT_SIZES = ["1.2em", "2.0em", "2.5em"];

// 动态生成颜色池 - 每次刷新页面颜色不同
let colorPool: string[] = [];

function getColor(index: number): string {
  // 如果颜色池为空或不够用，重新生成
  if (colorPool.length === 0 || index >= colorPool.length) {
    const needed = Math.max(tags.value.length, 5); // 至少生成13个颜色
    colorPool = getHslCircleColors(needed);
    // colorPool = getHslColors(needed)
  }
  return colorPool[index % colorPool.length];
}

function getTagStyle(index: number, articleCount: number) {
  const bgColor = getColor(index);
  // 根据文章数量决定字体大小
  let fontSize = FONT_SIZES[0];
  if (articleCount >= 7) fontSize = FONT_SIZES[2];
  else if (articleCount >= 3) fontSize = FONT_SIZES[1];

  return {
    "--tag-bg": bgColor,
    "--tag-text": "#fff",
    "--tag-font-size": fontSize,
  };
}

onMounted(async () => {
  const res: any = await requestOrRead(getTagList, readTagList);
  const list = res?.data ?? res;
  tags.value = Array.isArray(list) ? list : [];
  canvasHeaderH.value = window.innerHeight*0.6;
});
</script>

<template>
  <div class="tags-page" v-slide-in>
    <!-- 透明遮罩层 -->
    <div class="tag-overlay" />
    <div class="page-header">
      <h1 class="page-title">
        <svg class="page-title-icon" viewBox="0 0 1024 1024" width="1.4rem" height="1.4rem" fill="currentColor">
          <path d="M490.656 96.192l-368 0c-17.664 0-32 14.336-32 32l0 368c0 8.48 3.36 16.64 9.376 22.624l416 416c12.512 12.512 32.736 12.512 45.248 0l368-368c12.512-12.512 12.512-32.736 0-45.248l-416-416C507.296 99.552 499.136 96.192 490.656 96.192zM480 160.192l390.624 390.624-320 320L160 480.192 160 160.192 480 160.192zM336 384.192c35.36 0 64-28.64 64-64s-28.64-64-64-64-64 28.64-64 64S300.64 384.192 336 384.192z"/>
        </svg>
        标签
      </h1>
    </div>
    <div class="tag-cloud">
      <span
        v-for="(tag, idx) in tags"
        :key="tag.id"
        class="tag-chip"
        :style="getTagStyle(idx, tag.articleCount ?? 0)"
        @click="$router.push(`/archive/tag/${tag.id}`)"
      >
        {{ tag.tagName }}
        <sup class="tag-chip-count">{{ tag.articleCount ?? 0 }}</sup>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tags-page {
  position: relative;
  width: 100%;
  @include surface-card;
  padding: $page-padding;
}

.page-header {
  position: relative;
  margin-bottom: 1.5rem;
  z-index: 5;
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

.tag-cloud {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 2.5rem 0;
  align-items: center;
  overflow: hidden;
}

// 透明遮罩层 - 默认隐藏
.tag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--surface-inner-bg);
  opacity: 0;
  pointer-events: none; // 不阻挡鼠标事件
  transition: opacity 0.3s ease;
  z-index: 6; // 在标签之上
}

// 鼠标进入卡片时显示遮罩
.tags-page:hover .tag-overlay {
  opacity: 1;
}

.tag-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.4rem 0.9rem;
  font-size: var(--tag-font-size);
  font-weight: 500;
  border-radius: 8px;
  background: var(--tag-bg);
  color: var(--tag-text);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 5; // 默认在遮罩下方

  // 默认状态：跟随遮罩变淡
  opacity: 1;
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease,
    z-index 0s;

  &:hover {
    // hover 时使用强调色（橙色）并上浮，同时提升到遮罩之上
    background: var(--mao-orange) !important;
    color: #fff !important;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(230, 162, 60, 0.3);
    opacity: 1 !important; // 保持完全不透明
    z-index: 20; // 提升到遮罩之上
  }

  .tag-chip-count {
    font-size: 0.6em;
    opacity: 0.85;
    margin-left: 2px;
  }
}
</style>
