import { useCanvasEffects } from '@/composables/useCanvasEffects';

export { useCanvasEffects };

// 便捷导出：常用状态（保持向后兼容）
const { canvasHeaderH, canvasImageUrl, mouseTrailEnabled, particlesEnabled } = useCanvasEffects();

export { canvasHeaderH, canvasImageUrl, mouseTrailEnabled, particlesEnabled };
