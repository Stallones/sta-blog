/**
 * CanvasLayer — 统一协调入口
 * 重新导出 useCanvasEffects 的状态，供外部组件直接引用
 */
export { useCanvasEffects } from '@/composables/useCanvasEffects';

// 便捷导出：常用状态（保持向后兼容）
import { useCanvasEffects } from '@/composables/useCanvasEffects';

const { canvasHeaderH, canvasImageUrl, mouseTrailEnabled, particlesEnabled } = useCanvasEffects();

export { canvasHeaderH, canvasImageUrl, mouseTrailEnabled, particlesEnabled };
