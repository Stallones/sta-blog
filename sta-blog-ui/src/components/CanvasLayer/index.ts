/**
 * CanvasLayer — 统一协调入口
 * 重新导出各 composable 的状态，供外部组件直接引用
 * 各层逻辑由 composable 管理，此处仅做协调
 */
export { useBackgroundParallax } from '@/composables/useBackgroundParallax';
export { useMouseTrail } from '@/composables/useMouseTrail';
export { useParticles } from '@/composables/useParticles';

// 便捷导出：常用状态（保持向后兼容）
import { useBackgroundParallax } from '@/composables/useBackgroundParallax';
import { useMouseTrail } from '@/composables/useMouseTrail';
import { useParticles } from '@/composables/useParticles';

const { canvasHeaderH, canvasImageUrl } = useBackgroundParallax();
const { mouseTrailEnabled } = useMouseTrail();
const { particlesEnabled } = useParticles();

export { canvasHeaderH, canvasImageUrl, mouseTrailEnabled, particlesEnabled };
