<template>
  <div class="fm-container" :class="{ 'fm--hidden-by-scroll': hiddenByScroll }">
    <!-- 展开区域（向上堆叠在 always 区之上） -->
    <transition name="fm-slide">
      <div v-if="isExpanded" class="fm-expand-list">
        <template v-for="btn in expandButtons" :key="btn.id">
          <!-- galleryLayout：展开区按钮 + popover 子菜单（选布局不关闭） -->
          <el-popover
            v-if="btn.id === 'galleryLayout'"
            placement="left"
            :width="220"
            trigger="click"
            :visible="layoutPopoverVisible"
            :popper-class="'layout-popper'"
          >
            <template #reference>
              <button
                class="fm-btn"
                :class="{ 'fm-btn--active': layoutPopoverVisible }"
                @click.stop="toggleLayoutPopover"
              >
                <svg-icon name="reading_mode" />
              </button>
            </template>

            <div class="layout-picker">
              <div class="layout-picker__title">卡片布局</div>
              <div
                v-for="opt in layoutOptions"
                :key="opt.value"
                class="layout-picker__item"
                :class="{
                  'layout-picker__item--active': galleryMode.mode.value === opt.value,
                }"
                @click.stop="selectLayout(opt.value)"
              >
                <span class="layout-picker__num">{{ opt.value }}</span>
                <span class="layout-picker__label">{{ opt.label }}</span>
                <span
                  v-if="galleryMode.mode.value === opt.value"
                  class="layout-picker__check"
                  >✓</span
                >
              </div>
            </div>
          </el-popover>

          <!-- 其他展开区按钮 -->
          <button v-else class="fm-btn" @click="handleButtonClick(btn.id)">
            <svg-icon v-if="btn.id === 'sidebarHide'" name="sidebar_toggle" />
            <svg-icon v-else-if="btn.id === 'readingMode'" name="reading_mode" />
            <svg-icon v-else-if="btn.id === 'toComment'" name="comment" />
          </button>
        </template>
      </div>
    </transition>

    <!-- 始终显示区域（底部锚定） -->
    <div class="fm-always-list">
      <button
        v-for="btn in alwaysButtons"
        :key="btn.id"
        class="fm-btn"
        :class="{
          'fm-btn--active': btn.id === 'settings' && isExpanded,
          'fm-btn--spinning': btn.id === 'settings' && !isExpanded,
          'fm-btn--mobile-only': btn.id === 'catalogDrawer',
        }"
        @click="handleButtonClick(btn.id)"
      >
        <!-- 设置齿轮 -->
        <svg-icon v-if="btn.id === 'settings'" name="settings" />
        <!-- 亮暗切换 -->
        <svg-icon
          v-else-if="btn.id === 'colorMode'"
          :name="isDark ? 'color_mode_moon' : 'color_mode_sun'"
        />
        <!-- 百分比 + ToTop 合并 -->
        <template
          v-else-if="btn.id === 'scrollPercentage'"
          @mouseenter="percentHovered = true"
        >
          <span v-show="!showArrowInsteadOfPercent" class="fm-percent">
            {{ Math.floor(readingProgress) }}
          </span>
          <svg-icon v-show="showArrowInsteadOfPercent" name="arrow_up" />
        </template>
        <!-- 目录抽屉（仅文章页 ≤900px 显示） -->
        <svg-icon v-else-if="btn.id === 'catalogDrawer'" name="directory" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useColorMode } from "@vueuse/core";
import { useFloatingMenu } from "@/composables/useFloatingMenu";
import { useReadingProgress } from "@/composables/useReadingProgress";
import { useReadingMode } from "@/composables/useReadingMode";
import { useGalleryLayout } from "@/composables/useGalleryLayout";

// ── 状态 ──
const {
  registeredItems,
  isExpanded,
  toggleExpanded,
  hiddenByScroll,
  setHiddenByScroll,
  toggleSidebar,
  toggleCatalogDrawer,
} = useFloatingMenu();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const { scrollPercentage: readingProgress } = useReadingProgress();
const { toggleReadingMode } = useReadingMode();
const galleryMode = useGalleryLayout();

// ── 布局浮层状态 ──
const layoutPopoverVisible = ref(false);

function toggleLayoutPopover() {
  layoutPopoverVisible.value = !layoutPopoverVisible.value;
}

function selectLayout(val: number) {
  galleryMode.setMode(val as any);
  // 不关闭 popover，让用户继续选择或点击外部关闭
}

/** 点击外部关闭 popover */
function onClickOutsideLayout(e: MouseEvent) {
  if (!layoutPopoverVisible.value) return;
  const target = e.target as HTMLElement;
  if (!target.closest(".layout-popper") && !target.closest(".fm-btn--active")) {
    layoutPopoverVisible.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutsideLayout, true);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutsideLayout, true);
});

/** 7 种布局选项 */
const layoutOptions = [
  { value: 1, label: "水平卡片 · 左" },
  { value: 2, label: "水平卡片 · 右" },
  { value: 3, label: "水平卡片 · 交替" },
  { value: 4, label: "垂直卡片" },
  { value: 5, label: "层叠卡片" },
  { value: 6, label: "瀑布流 · 垂直卡片" },
  { value: 7, label: "瀑布流 · 层叠卡片" },
];

// ── 滚动隐藏逻辑：scrollTop ≈ 0 时整组菜单右滑隐藏 ──
const SCROLL_HIDE_THRESHOLD = 80;

function checkScrollHide() {
  const st = window.scrollY || document.documentElement.scrollTop || 0;
  setHiddenByScroll(st <= SCROLL_HIDE_THRESHOLD);
}

onMounted(() => {
  window.addEventListener("scroll", checkScrollHide, { passive: true });
  checkScrollHide(); // 初始检查
});
onUnmounted(() => {
  window.removeEventListener("scroll", checkScrollHide);
});

// ── 百分比 → 上箭头切换逻辑 ──
const percentHovered = ref(false);

const showArrowInsteadOfPercent = computed(
  () => percentHovered.value || readingProgress.value >= 90
);

// ── 导航函数 ──
function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
}

function toggleColorMode() {
  colorMode.value = isDark.value ? "light" : "dark";
}

// ── 按钮列表计算（order 越小越靠上）──
const alwaysButtons = computed(() =>
  registeredItems.value
    .filter((item) => item.global)
    .sort((a, b) => a.order - b.order)
);

const expandButtons = computed(() =>
  registeredItems.value
    .filter((item) => !item.global)
    .sort((a, b) => a.order - b.order)
);

// ── 按钮点击处理 ──
function handleButtonClick(id: string) {
  switch (id) {
    case "settings":
      toggleExpanded();
      break;
    case "scrollPercentage":
      backToTop();
      break;
    case "colorMode":
      toggleColorMode();
      break;
    case "readingMode":
      toggleReadingMode();
      break;
    case "toComment":
      backToBottom();
      break;
    case "sidebarHide":
      toggleSidebar();
      break;
    case "catalogDrawer":
      toggleCatalogDrawer();
      break;
  }
}
</script>

<style scoped lang="scss">
.fm-container {
  position: fixed;
  bottom: 4rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column; /* 正常方向：从上到下 */
  gap: 6px;

  /* 滚动触顶时整组菜单右滑隐藏 — 独立于展开状态 */
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  &.fm--hidden-by-scroll {
    transform: translateX(100px);
    opacity: 0;
  }

  @media screen and (max-width: 768px) {
    bottom: 0.75rem;
    right: 0.625rem;
  }
}

/* ═══════ 统一按钮样式 ═══════ */
.fm-btn {
  width: 35px;
  height: 35px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: hsl(0, 0%, 100%);
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.25s, transform 0.15s;
  background-color: var(--mao-fm-btn-bg);

  &:hover {
    background-color: var(--orange);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  /* 图标更大更饱满 */
  :deep(.svg-icon) {
    width: 24px;
    height: 24px;
  }
}

/* 展开时设置按钮高亮橙色 */
.fm-btn--active {
  background-color: var(--orange) !important;
}

/* 未展开时设置按钮持续旋转 */
.fm-btn--spinning {
  :deep(svg) {
    animation: fm-spin 3s linear infinite;
  }
}

@keyframes fm-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 百分比数字 */
.fm-percent {
  line-height: 1;
  font-size: 14px;
}

/* ═══════ 展开区域滑入动画（从右侧）═══════ */
.fm-slide-enter-active,
.fm-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fm-slide-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.fm-slide-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

/* 子列表统一纵向排列 */
.fm-expand-list,
.fm-always-list {
  display: flex;
  flex-direction: column; /* 从上到下，与 order 排序一致 */
  gap: 6px;
}

/* 目录抽屉按钮：仅 ≤900px 时显示（文章页专属移动端按钮） */
.fm-btn--mobile-only {
  display: none;

  @media screen and (max-width: 900px) {
    display: flex;
  }
}

/* ═══════ 布局选择浮层 ═══════ */
.layout-picker {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border-color-light);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.82rem;
    color: var(--text-secondary);
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: var(--mao-fm-layout-hover);
      color: var(--text-primary);
    }

    &--active {
      background: var(--accent-color-alpha, rgba(64, 158, 255, 0.12));
      color: var(--accent-color, #409eff);
    }
  }

  &__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__label {
    flex: 1;
  }

  &__check {
    width: 16px;
    height: 16px;
    color: var(--accent-color, #409eff);
    flex-shrink: 0;
    font-weight: 700;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
