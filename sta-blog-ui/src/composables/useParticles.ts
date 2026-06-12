/**
 * useParticles — 漂浮粒子+连线效果层状态管理
 * 控制开关、粒子参数
 */
import { ref, reactive } from 'vue';

/** 粒子效果开关 */
const particlesEnabled = ref(true);

/** 粒子配置 */
const particleConfig = reactive({
  /** 粒子数量 */
  count: 50,
  /** 粒子尺寸范围 [min, max] */
  sizeRange: [1, 4] as [number, number],
  /** 移动速度范围 [min, max] */
  speedRange: [0.15, 0.5] as [number, number],
  /** 鼠标排斥半径 (px) */
  mouseRepelRadius: 100,
  /** 粒子连线距离阈值 (px) */
  linkDistance: 100,
  /** 线条粗细 */
  lineWidth: 0.5,
  /** 阻尼系数（每帧速度衰减） */
  damping: 0.99,
});

/** 粒子颜色序列 */
const PARTICLE_COLORS = [
  'hsl(30, 92%, 59%)',  /* #f79533 */
  'hsl(12, 87%, 59%)',  /* #f37055 */
  'hsl(336, 80%, 62%)', /* #ef4e7b */
  'hsl(280, 39%, 55%)', /* #a166ab */
  'hsl(218, 39%, 52%)', /* #5073b8 */
  'hsl(186, 83%, 37%)', /* #1098ad */
  'hsl(167, 90%, 37%)', /* #07b39b */
  'hsl(137, 42%, 58%)', /* #6fba82 */
];

export function useParticles() {
  function setEnabled(v: boolean) {
    particlesEnabled.value = v;
  }

  return {
    particlesEnabled,
    particleConfig,
    PARTICLE_COLORS,
    setEnabled,
  };
}
