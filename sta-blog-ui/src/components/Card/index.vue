<script setup lang="ts">
import { computed } from "vue";

// ── 默认值 ──
const defaultProps = {
  prefixIcon: "",
  suffixIcon: "",
  isDithering: false,
  isScale: false,
  isArrow: false,
  isRotate: false,
  title: "",
  isCatalog: false,
};

// ── Variant 预设 ──
const VARIANT_PRESETS: Record<string, Partial<typeof defaultProps>> = {
  /** 默认样式：图标缩放呼吸 */
  default: { isScale: true },
  /** 可刷新样式：缩放 + 旋转按钮 + suffixIcon=rotate */
  refresh: { isScale: true, isRotate: true, suffixIcon: "rotate" },
  /** 公告样式：图标抖动 + 箭头 + suffixIcon=jt_y */
  announcement: { isDithering: true, isArrow: true, suffixIcon: "jt_y" },
};

const props = defineProps({
  // 预设变体：'default' | 'refresh' | 'announcement'
  // 传入后会合并同名 prop，显式 prop 可覆盖 preset
  variant: {
    type: String,
    default: "",
  },
  prefixIcon: String,
  suffixIcon: {
    type: String,
    default: undefined,
  },
  isDithering: {
    type: Boolean,
    default: undefined,
  },
  isScale: {
    type: Boolean,
    default: undefined,
  },
  isArrow: {
    type: Boolean,
    default: undefined,
  },
  isRotate: {
    type: Boolean,
    default: undefined,
  },
  title: String,
  isCatalog: {
    type: Boolean,
    default: undefined,
  },
});

// ── 合并 variant 预设与显式 prop ──
const merged = computed(() => {
  const preset = props.variant ? VARIANT_PRESETS[props.variant] ?? {} : {};
  const keys = Object.keys(defaultProps) as (keyof typeof defaultProps)[];
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    const explicit = (props as Record<string, unknown>)[key];
    result[key] = explicit !== undefined ? explicit : (preset[key] ?? defaultProps[key]);
  }
  return result;
});

const emit = defineEmits(["invoke"]);

function invoke() {
  emit("invoke");
}
</script>

<template>
  <!-- 封装侧边栏卡片 -->
  <div
    v-slide-in
    class="card"
    :style="merged.isCatalog ? 'position: relative;z-index: 9' : ''"
  >
    <div class="title" :style="merged.isCatalog ? 'position: sticky;top: 0' : ''">
      <div class="title_text">
        <SvgIcon
          :class="{ dithering: merged.isDithering, scale: merged.isScale }"
          :name="merged.prefixIcon"
          width="30"
          height="30"
        />
        <span style="margin-left: 10px">{{ merged.title }}</span>
      </div>
      <el-tooltip
        class="box-item"
        effect="light"
        content="刷新"
        placement="top"
        v-if="merged.suffixIcon == 'rotate'"
      >
        <div
          :class="{ arrow: merged.isArrow, rotate: merged.isRotate }"
          :style="merged.suffixIcon == 'rotate' ? 'cursor: pointer' : ''"
          @click="invoke"
        >
          <SvgIcon :name="merged.suffixIcon" width="30" height="30" />
        </div>
      </el-tooltip>
      <div
        v-else
        :class="{ arrow: merged.isArrow, rotate: merged.isRotate }"
        :style="merged.suffixIcon == 'rotate' ? 'cursor: pointer' : ''"
        @click="invoke"
      >
        <SvgIcon :name="merged.suffixIcon" width="30" height="30" />
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background-color: var(--el-bg-color);
  // width: $card-width;
  // margin: $card-margin;
  // border: 1px solid var(--el-border-color);
  border-radius: $border-radius;
  margin-top: 1.5em;
  // 添加阴影
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  .title {
    border-radius: $border-radius $border-radius 0 0;
    background-color: var(--el-bg-color);
    z-index: 2;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    // 文字跟图标对齐
    .title_text {
      display: flex;
      align-items: center;

      .dithering {
        animation: shake 0.3s infinite;
        transform-origin: center;

        // 喇叭根据中心点抖动效果
        @keyframes shake {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(10deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }

      // 放大缩小效果
      .scale {
        animation: scale 1s infinite;
        transform-origin: center;

        @keyframes scale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      }
    }

    // 箭头动画
    .arrow:hover {
      animation: move 1s infinite;

      @keyframes move {
        0% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(5px);
        }
        100% {
          transform: translateX(0);
        }
      }
    }

    // 随机旋转动画
    .rotate:hover {
      animation: rotate 1s infinite linear;
    }

    @keyframes rotate {
      // 306度是为了让箭头指向右边
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .content {
    min-height: 5em;
    text-align: center;
    line-height: 22px;
    padding: 10px;
    color: grey;
  }
}
</style>
