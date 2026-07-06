<template>
  <!-- 底层：背景视差 -->
  <canvas ref="bgRef" class="canvas-layer canvas-bg"></canvas>
  <!-- 中层：粒子效果 -->
  <canvas v-if="particlesEnabled" ref="particlesRef" class="canvas-layer canvas-particles"></canvas>
  <!-- 顶层：鼠标拖尾 -->
  <canvas v-if="mouseTrailEnabled" ref="trailRef" class="canvas-layer canvas-trail"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { createParallax } from "./layers/BackgroundParallax";
import { createMouseTrail } from "./layers/MouseTrail";
import { createParticlesEffect } from "./layers/Particles";
import { useCanvasEffects } from "./index";

const { canvasHeaderH, setImageUrl, mouseTrailEnabled, particlesEnabled } = useCanvasEffects();

const props = defineProps<{
  /** 背景图片 URL（可选） */
  imageUrl?: string;
}>();

// ---- refs ----
const bgRef = ref<HTMLCanvasElement>();
const trailRef = ref<HTMLCanvasElement>();
const particlesRef = ref<HTMLCanvasElement>();

// ---- 实例 ----
let parallax: ReturnType<typeof createParallax> | null = null;
let trail: ReturnType<typeof createMouseTrail> | null = null;
let particles: ReturnType<typeof createParticlesEffect> | null = null;

// ---- 动画循环 ----
let rafId: number;

function animate() {
  parallax?.tick();
  trail?.tick();
  particles?.tick();
  rafId = requestAnimationFrame(animate);
}

// ---- resize 统一处理 ----
function handleResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  parallax?.resize(w, h);
  trail?.resize(w, h);
  particles?.resize(w, h);
}

onMounted(() => {
  if (props.imageUrl) {
    setImageUrl(props.imageUrl);
  }

  if (bgRef.value) {
    parallax = createParallax();
    parallax.init(bgRef.value);
  }
  if (trailRef.value && mouseTrailEnabled.value) {
    trail = createMouseTrail();
    trail.init(trailRef.value);
  }
  if (particlesRef.value && particlesEnabled.value) {
    particles = createParticlesEffect();
    particles.init(particlesRef.value);
  }

  handleResize();
  animate();

  window.addEventListener("resize", handleResize);
});

watch(canvasHeaderH, () => {
  parallax?.resize(window.innerWidth, window.innerHeight);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("resize", handleResize);

  parallax?.destroy();
  parallax = null;
  trail?.destroy();
  trail = null;
  particles?.destroy();
  particles = null;
});
</script>

<style scoped lang="scss">
.canvas-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.canvas-bg {
  z-index: -1;
}
.canvas-particles {
  z-index: -1;
}
.canvas-trail {
  z-index: 5;
}
</style>
