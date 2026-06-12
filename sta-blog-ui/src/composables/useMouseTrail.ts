/**
 * useMouseTrail — 鼠标拖尾效果层状态管理
 * 控制开关、拖尾参数
 */
import { ref, reactive } from 'vue';

/** 鼠标拖尾效果开关 */
const mouseTrailEnabled = ref(true);

/** 拖尾配置 */
const mouseTrailConfig = reactive({
  /** 最大拖尾点数 */
  maxPoints: 50,
  /** 点尺寸范围 [min, max] */
  sizeRange: [5, 20] as [number, number],
  /** 点生命周期（帧数） */
  lifetime: 50,
  /** 拖尾颜色序列 */
  colors: [
    'hsl(30, 92%, 59%)',  /* #f79533 */
    'hsl(12, 87%, 59%)',  /* #f37055 */
    'hsl(336, 80%, 62%)', /* #ef4e7b */
    'hsl(280, 39%, 55%)', /* #a166ab */
    'hsl(218, 39%, 52%)', /* #5073b8 */
    'hsl(186, 83%, 37%)', /* #1098ad */
    'hsl(167, 90%, 37%)', /* #07b39b */
    'hsl(137, 42%, 58%)', /* #6fba82 */
  ],
} as { maxPoints: number; sizeRange: [number, number]; lifetime: number; colors: string[] });

export function useMouseTrail() {
  function setEnabled(v: boolean) {
    mouseTrailEnabled.value = v;
  }

  return {
    mouseTrailEnabled,
    mouseTrailConfig,
    setEnabled,
  };
}
