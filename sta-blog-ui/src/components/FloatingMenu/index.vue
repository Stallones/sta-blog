<script setup lang="ts">
import { ref, computed } from "vue";
import { useColorMode } from "@vueuse/core";
import { useFloatingMenu } from "@/composables/useFloatingMenu";
import { useReadingProgress } from "@/composables/useReadingProgress";
import { useReadingMode } from "@/composables/useReadingMode";

// ── 状态 ──
const {
  registeredItems,
  isExpanded,
  toggleExpanded,
} = useFloatingMenu();

const mode = useColorMode();
const isDark = computed(() => mode.value === "dark");

const { scrollPercentage: readingProgress } = useReadingProgress();
const { toggleReadingMode } = useReadingMode();

// ── 百分比 → 上箭头切换逻辑 ──
// 规则：百分比 >= 90 或 hover 时显示箭头，否则显示百分比数字
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
  mode.value = isDark.value ? "light" : "dark";
}

// ── 按钮列表计算 ──
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
    // sidebarHide 暂留空
  }
}
</script>

<template>
  <div class="fm-container">
    <!-- 展开区域 -->
    <transition name="fm-slide">
      <div v-if="isExpanded" class="fm-expand-list">
        <button
          v-for="btn in expandButtons"
          :key="btn.id"
          class="fm-btn"
          :class="{ 'fm-btn--active': btn.id === 'settings' }"
          @click="handleButtonClick(btn.id)"
        >
          <svg-icon v-if="btn.id === 'sidebarHide'" name="sidebar_toggle" />
          <svg-icon v-else-if="btn.id === 'readingMode'" name="reading_mode" />
          <svg-icon v-else-if="btn.id === 'toComment'" name="comment" />
        </button>
      </div>
    </transition>

    <!-- 始终显示区域 -->
    <div class="fm-always-list">
      <button
        v-for="btn in alwaysButtons"
        :key="btn.id"
        class="fm-btn"
        :class="{
          'fm-btn--active': btn.id === 'settings' && isExpanded,
          'fm-btn--spinning': btn.id === 'settings' && !isExpanded,
        }"
        @click="handleButtonClick(btn.id)"
        @mouseenter="btn.id === 'scrollPercentage' && (percentHovered = true)"
        @mouseleave="btn.id === 'scrollPercentage' && (percentHovered = false)"
      >
        <svg-icon v-if="btn.id === 'settings'" name="settings" />
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.fm-container {
  position: fixed;
  bottom: 4rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;

  @media screen and (max-width: 768px) {
    bottom: 0.75rem;
    right: 0.625rem;
  }
}

/* ═══════ 统一按钮样式 ═══════ */
.fm-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.25s, transform 0.15s;
  background-color: var(--mao-br-bg, #4a9ff5);

  &:hover {
    background-color: #f97316;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.97);
  }

  :deep(.svg-icon) {
    width: 22px;
    height: 22px;
  }
}

.fm-btn--active {
  background-color: #f97316 !important;
}

.fm-btn--spinning {
  :deep(svg) {
    animation: fm-spin 3s linear infinite;
  }
}

@keyframes fm-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.fm-percent {
  line-height: 1;
}

/* ═══════ 展开区域滑入动画 ═══════ */
.fm-slide-enter-active,
.fm-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fm-slide-enter-from {
  opacity: 0;
  transform: translateX(80px);
}
.fm-slide-leave-to {
  opacity: 0;
  transform: translateX(80px);
}

.fm-expand-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}

.fm-always-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}
</style>
