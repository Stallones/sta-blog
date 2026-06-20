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
            :visible="layoutPopoverVisible"
            :popper-class="'layout-popper'"
            :popper-options="{ strategy: 'fixed' }"
          >
            <template #reference>
              <button
                class="fm-btn"
                :class="{ 'fm-btn--active': layoutPopoverVisible }"
                @click.stop="toggleLayoutPopover"
              >
                <el-icon><Menu /></el-icon>
              </button>
            </template>

            <div class="layout-picker">
              <div class="layout-picker__title">卡片布局</div>
              <div
                v-for="opt in layoutOptions"
                :key="opt.value"
                class="layout-picker__item"
                :class="{
                  'layout-picker__item--active':
                    galleryMode.mode.value === opt.value,
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
            <el-icon v-if="btn.id === 'sidebarHide'"><Switch /></el-icon>
            <el-icon v-else-if="btn.id === 'readingMode'" name="reading_mode"
              ><reading
            /></el-icon>
            <el-icon v-else-if="btn.id === 'toComment'" name="comment"
              ><chat-line-round
            /></el-icon>
          </button>
        </template>
      </div>
    </transition>

    <!-- 始终显示区域（底部锚定） -->
    <div class="fm-always-list">
      <template v-for="btn in alwaysButtons" :key="btn.id">
        <!-- 目录 Popover（仅文章页 ≤900px 显示） -->
        <el-popover
          v-if="btn.id === 'catalogMob'"
          placement="left-start"
          :width="260"
          :visible="catalogPopoverVisible"
          :popper-class="'catalog-popper'"
          :popper-options="{ strategy: 'fixed' }"
        >
          <template #reference>
            <button
              class="fm-btn fm-btn--mobile-only"
              :class="{ 'fm-btn--active': catalogPopoverVisible }"
              @click.stop="toggleCatalogPopover"
            >
              <el-icon><Memo /></el-icon>
            </button>
          </template>

          <div class="catalog-picker">
            <div class="catalog-picker__title">目录</div>
            <div class="catalog-picker__list move_catalog">
              <MdCatalog
                v-if="catalogEditorId && catalogScrollElement"
                :editorId="catalogEditorId"
                :scrollElement="catalogScrollElement!"
              />
            </div>
          </div>
        </el-popover>

        <!-- 其他始终显示按钮 -->
        <button
          v-else
          class="fm-btn"
          :class="{
            'fm-btn--active': btn.id === 'settings' && isExpanded,
            'fm-btn--spinning': btn.id === 'settings' && !isExpanded,
          }"
          @click="handleButtonClick(btn.id)"
          @mouseover="btn.id === 'scrollPercentage' && (percentHovered = true)"
          @mouseleave="percentHovered = false"
        >
          <!-- 设置齿轮 -->
          <el-icon v-if="btn.id === 'settings'" name="settings"
            ><tools
          /></el-icon>

          <!-- 亮暗切换 -->
          <svg-icon
            v-else-if="btn.id === 'colorMode'"
            :name="isDark ? 'color_mode_moon' : 'color_mode_sun'"
          />
          <!-- 百分比 + ToTop 合并 -->
          <template v-else-if="btn.id === 'scrollPercentage'">
            <span v-show="!showArrowInsteadOfPercent" class="fm-percent">
              {{ Math.floor(readingProgress) }}
            </span>
            <svg-icon v-show="showArrowInsteadOfPercent" name="arrow_up" />
          </template>
        </button>
      </template>
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
import { MdCatalog } from "md-editor-v3";
import {
  Tools,
  Switch,
  Reading,
  ChatLineRound,
  Menu,
  Memo
} from "@element-plus/icons-vue";

// ── 状态 ──
const {
  registeredItems,
  isExpanded,
  toggleExpanded,
  hiddenByScroll,
  setHiddenByScroll,
  toggleSidebar,
  catalogPopoverVisible,
  toggleCatalogPopover,
  catalogEditorId,
  catalogScrollElement,
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

/** 点击外部关闭 layout popover */
function onClickOutsideLayout(e: MouseEvent) {
  if (!layoutPopoverVisible.value) return;
  const target = e.target as HTMLElement;
  if (!target.closest(".layout-popper") && !target.closest(".fm-btn--active")) {
    layoutPopoverVisible.value = false;
  }
}

/** 点击外部关闭 catalog popover */
function onClickOutsideCatalog(e: MouseEvent) {
  if (!catalogPopoverVisible.value) return;
  const target = e.target as HTMLElement;
  if (!target.closest(".catalog-popper") && !target.closest(".fm-btn--active")) {
    catalogPopoverVisible.value = false;
  }
}

/** 窗口宽度 >900px 时关闭 mob 目录 popover */
const MOBILE_BREAKPOINT = 900;
function checkMobileBreakpoint() {
  if (window.innerWidth > MOBILE_BREAKPOINT && catalogPopoverVisible.value) {
    catalogPopoverVisible.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutsideLayout, true);
  document.addEventListener("click", onClickOutsideCatalog, true);
  window.addEventListener("resize", checkMobileBreakpoint);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutsideLayout, true);
  document.removeEventListener("click", onClickOutsideCatalog, true);
  window.removeEventListener("resize", checkMobileBreakpoint);
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
  const shouldHide = st <= SCROLL_HIDE_THRESHOLD;
  setHiddenByScroll(shouldHide);
  // 触顶隐藏菜单时，关闭所有 popover
  if (shouldHide) {
    layoutPopoverVisible.value = false;
    catalogPopoverVisible.value = false;
  }
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
  background-color: var(--mao-fm-btn-color);

  &:hover {
    background-color: var(--mao-orange);
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
  background-color: var(--mao-orange) !important;
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
    color: var(--el-text-color-primary);
    margin-bottom: 6px;
    padding-bottom: 6px;
    // border-bottom: 1px solid var(--el-border-color-light);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.82rem;
    color: var(--el-text-color-secondary);
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: var(--mao-fm-layout-hover);
      color: var(--mao-accent);
    }

    &--active {
      background: var(--el-color-primary-light-9, rgba(64, 158, 255, 0.12));
      color: var(--mao-accent);
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
    color: var(--mao-accent, #409eff);
    flex-shrink: 0;
    font-weight: 700;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* ═══════ 目录浮层 ═══════ */
.catalog-picker {
  &__title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  &__list {
    max-height: 360px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.move_catalog {
  :deep(.md-editor-catalog-active) {
    & > span {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary-light-4);
      border-radius: $border-radius;
      font-weight: bold;
      padding: 0.5rem 0 0.5rem 0.5rem;
    }
  }

  :deep(.md-editor-catalog) {
    span:hover {
      color: var(--el-color-primary-light-5);
    }
  }

  :deep(.md-editor-catalog-link) {
    margin: 0;
    padding-top: 0;
    padding-bottom: 0;
    span {
    }
  }

  :deep(.md-editor-catalog-wrapper > .md-editor-catalog-link:first-of-type) {
    padding-top: 0;
  }
}
</style>
