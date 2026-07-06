/**
 * useCanvasEffects — Canvas 视觉效果状态中心
 * 合并 useBackgroundParallax + useMouseTrail + useParticles
 */
import { ref, reactive } from 'vue';

// ── 统一颜色常量（消除 useMouseTrail / useParticles 中的重复）──
export const COLORS = [
  'hsl(30, 92%, 59%)',  /* #f79533 */
  'hsl(12, 87%, 59%)',  /* #f37055 */
  'hsl(336, 80%, 62%)', /* #ef4e7b */
  'hsl(280, 39%, 55%)', /* #a166ab */
  'hsl(218, 39%, 52%)', /* #5073b8 */
  'hsl(186, 83%, 37%)', /* #1098ad */
  'hsl(167, 90%, 37%)', /* #07b39b */
  'hsl(137, 42%, 58%)', /* #6fba82 */
];

// ── 背景视差（from useBackgroundParallax）──
const canvasHeaderH = ref(0);
const canvasImageUrl = ref('');

// ── 鼠标拖尾（from useMouseTrail）──
const mouseTrailEnabled = ref(true);
const mouseTrailConfig = reactive({
  maxPoints: 50,
  sizeRange: [5, 20] as [number, number],
  lifetime: 50,
  colors: COLORS,
} as { maxPoints: number; sizeRange: [number, number]; lifetime: number; colors: string[] });

// ── 漂浮粒子（from useParticles）──
const particlesEnabled = ref(true);
const particleConfig = reactive({
  count: 50,
  sizeRange: [1, 4] as [number, number],
  speedRange: [0.15, 0.5] as [number, number],
  mouseRepelRadius: 100,
  linkDistance: 100,
  lineWidth: 0.5,
  damping: 0.99,
});

export function useCanvasEffects() {
  // ── 背景视差 setters ──
  function setHeaderH(h: number) {
    canvasHeaderH.value = h;
  }

  function setImageUrl(url: string) {
    canvasImageUrl.value = url;
  }

  // ── 鼠标拖尾 setter ──
  function setTrailEnabled(v: boolean) {
    mouseTrailEnabled.value = v;
  }

  // ── 粒子效果 setter ──
  function setParticlesEnabled(v: boolean) {
    particlesEnabled.value = v;
  }

  return {
    // 背景视差
    canvasHeaderH,
    canvasImageUrl,
    setHeaderH,
    setImageUrl,
    // 鼠标拖尾
    mouseTrailEnabled,
    mouseTrailConfig,
    setTrailEnabled,
    // 漂浮粒子
    particlesEnabled,
    particleConfig,
    setParticlesEnabled,
  };
}
