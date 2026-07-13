<template>
  <span class="gradient-text" :class="modeClass" :style="gradientStyle">{{
    text
  }}</span>
</template>

<script setup lang="ts">
/**
 * GradientText — 多彩渐变文字
 *
 * mode:
 *   'static'    默认，左→右静态渐变
 *   'rainbow'   光谱循环动画
 *   'breathing' 呼吸灯，跟随主题文字色
 *
 * 用法：
 *   <GradientText text="Hello" />
 *   <GradientText text="Hello" mode="rainbow" />
 *   <GradientText text="Hello" mode="breathing" />
 *   <GradientText text="Hello" mode="rainbow" :colors="['#f00','#0f0','#00f']" />
 */
import { computed } from "vue";
import { getHslCircleColors } from "@/utils/colorHsl";

const props = withDefaults(
  defineProps<{
    text?: string;
    mode?: "static" | "rainbow" | "breathing";
    colors?: string[];
    duration?: number;
  }>(),
  {
    text: "Gradient Text",
    mode: "static",
    colors: () => [],
    duration: undefined,
  }
);

const modeClass = computed(() => `mode-${props.mode}`);

const palette = computed(() =>
  props.colors.length ? props.colors : getHslCircleColors(18)
);

const gradientStyle = computed(() => {
  const { mode, duration } = props;
  const c = palette.value;

  if (mode === "breathing") {
    return {
      "background-image": "none",
      "--duration": `${duration ?? 2}s`,
    };
  }

  if (mode === "rainbow") {
    // 单色板 + alternate 来回滑动，正反向色相连续无跳变
    return {
      "background-image": `linear-gradient(90deg, ${c.join(", ")})`,
      "background-size": "200% 100%",
      "--duration": `${duration ?? 6}s`,
    };
  }

  // static
  return {
    "background-image": `linear-gradient(90deg, ${c.join(", ")})`,
    "background-size": "100% 100%",
  };
});
</script>

<style scoped lang="scss">
.gradient-text {
  display: inline-block;
  font-weight: 700;

  /* 静态 & 光谱流动：渐变裁切 */
  &.mode-static,
  &.mode-rainbow {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* 光谱流动 */
  &.mode-rainbow {
    animation: rainbow-flow var(--duration, 6s) ease-in-out infinite alternate;
    will-change: background-position;
  }

  /* 呼吸灯：纯色跟随主题 */
  &.mode-breathing {
    -webkit-text-fill-color: unset;
    color: var(--text-primary);
    animation: breathe var(--duration, 2s) ease-in-out infinite;
  }
}

@keyframes rainbow-flow {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>
