/**
 * Particles — 漂浮粒子+连线效果层
 * 从 composables 读取共享状态
 */
import { COLORS, useCanvasEffects } from '@/composables/useCanvasEffects';

const { particleConfig, particlesEnabled } = useCanvasEffects();

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number; color: string;
}

export interface ParticlesInstance {
  init(canvas: HTMLCanvasElement): void;
  tick(): void;
  resize(w: number, h: number): void;
  destroy(): void;
}

let canvasEl: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let mouseX = 0;
let mouseY = 0;

function createParticles(count: number, w: number, h: number): Particle[] {
  const list: Particle[] = [];
  const cfg = particleConfig;
  for (let i = 0; i < count; i++) {
    list.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]) + cfg.sizeRange[0],
      speedX: Math.random() * (cfg.speedRange[1] - cfg.speedRange[0]) + cfg.speedRange[0] - cfg.speedRange[0] / 2,
      speedY: Math.random() * (cfg.speedRange[1] - cfg.speedRange[0]) + cfg.speedRange[0] - cfg.speedRange[0] / 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return list;
}

function onGlobalMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

/** 创建粒子效果实例 */
export function createParticlesEffect(): ParticlesInstance {
  return {
    init(el: HTMLCanvasElement) {
      canvasEl = el;
      ctx = el.getContext("2d");
      window.addEventListener("mousemove", onGlobalMouseMove);
    },

    tick() {
      if (!ctx || !canvasEl || !particlesEnabled.value) return;

      const w = canvasEl.width;
      const h = canvasEl.height;
      const cfg = particleConfig;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > w) p.speedX *= -1;
        if (p.y < 0 || p.y > h) p.speedY *= -1;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.mouseRepelRadius && dist > 0) {
          const angle = Math.atan2(dy, dx);
          const force = (cfg.mouseRepelRadius - dist) / 1500;
          p.speedX += Math.cos(angle) * force;
          p.speedY += Math.sin(angle) * force;
        }

        p.speedX *= cfg.damping;
        p.speedY *= cfg.damping;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const o = particles[j];
          const ldx = p.x - o.x;
          const ldy = p.y - o.y;
          const ld = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ld < cfg.linkDistance) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 1 - ld / cfg.linkDistance;
            ctx.lineWidth = cfg.lineWidth;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    },

    resize(w: number, h: number) {
      if (!canvasEl) return;
      canvasEl.width = w;
      canvasEl.height = h;
      if (particles.length === 0) {
        particles = createParticles(particleConfig.count, w, h);
      } else {
        particles.forEach((p) => {
          if (p.x > w) p.x = Math.random() * w;
          if (p.y > h) p.y = Math.random() * h;
        });
      }
    },

    destroy() {
      window.removeEventListener("mousemove", onGlobalMouseMove);
      particles = [];
      canvasEl = null;
      ctx = null;
    },
  };
}
