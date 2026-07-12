/**
 * BackgroundParallax — 视口滚动引擎
 *
 * 职责：管理 offscreen 画布 + 滚动 blit。
 * 内容由外部 DrawFn 注入：纯色模式传 ribbonDrawFn，玻璃模式传 lightDrawFn。
 */

import { useCanvasEffects } from "@/composables/useCanvasEffects";

const { canvasHeaderH, canvasImageUrl } = useCanvasEffects();

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  phase: number
) => void;

export interface ParallaxInstance {
  init(canvas: HTMLCanvasElement, solidDraw: DrawFn, glassDraw: DrawFn): void;
  tick(): void;
  resize(w: number, h: number): void;
  destroy(): void;
}

const SPEED = 1.0;

let mainCanvas: HTMLCanvasElement | null = null;
let mCtx: CanvasRenderingContext2D | null = null;
let offscreen: HTMLCanvasElement | null = null;
let offCtx: CanvasRenderingContext2D | null = null;
let loadedImage: HTMLImageElement | null = null;
let contentH = 0;
let classObserver: MutationObserver | null = null;
let isGlass = false;
let phase = 0;

/** 当前活跃的绘制函数 */
let solidDraw: DrawFn | null = null;
let glassDraw: DrawFn | null = null;
let activeDraw: DrawFn | null = null;

function detectGlass() {
  isGlass = document.documentElement.classList.contains("glass");
  activeDraw = isGlass ? glassDraw : solidDraw;
}

// ══════════════════════════════════════
// 图片模式（保留）
// ══════════════════════════════════════

function drawImage(w: number, h: number) {
  if (!offCtx || !loadedImage) return;
  const imgRatio = loadedImage.naturalWidth / loadedImage.naturalHeight;
  const tgtRatio = w / h;
  let sw: number, sh: number, sx: number, sy: number;
  if (imgRatio > tgtRatio) {
    sh = loadedImage.naturalHeight;
    sw = sh * tgtRatio;
    sy = 0;
    sx = (loadedImage.naturalWidth - sw) / 2;
  } else {
    sw = loadedImage.naturalWidth;
    sh = sw / tgtRatio;
    sx = 0;
    sy = (loadedImage.naturalHeight - sh) / 2;
  }
  offCtx.drawImage(loadedImage, sx, sy, sw, sh, 0, 0, w, h);
}

function fillOffscreen(w: number, h: number) {
  if (!offCtx) return;
  detectGlass();
  offCtx.clearRect(0, 0, w, h);

  if (loadedImage) {
    drawImage(w, h);
  } else if (activeDraw) {
    activeDraw(offCtx, w, h, phase);
  }
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { loadedImage = img; resolve(); };
    img.onerror = () => { resolve(); };
    img.src = url;
  });
}

// ══════════════════════════════════════
// 视口 blit
// ══════════════════════════════════════

function blit() {
  if (!mainCanvas || !mCtx || !offscreen) return;
  const vpH = mainCanvas.height;
  const hh = canvasHeaderH.value;
  const scrolled = window.scrollY * SPEED;

  mCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  if (hh > 0) {
    const maxSrc = Math.max(0, contentH - vpH);
    const srcY = Math.min(maxSrc, scrolled + hh);
    mCtx.drawImage(offscreen, 0, srcY, mainCanvas.width, vpH, 0, 0, mainCanvas.width, vpH);
    return;
  }

  if (scrolled <= 0) return;
  let srcY: number, dH: number, dstY: number;
  if (scrolled < vpH) {
    dH = scrolled;
    srcY = contentH - dH;
    dstY = vpH - dH;
  } else {
    srcY = Math.max(0, contentH - scrolled);
    dH = vpH;
    dstY = 0;
  }
  mCtx.drawImage(offscreen, 0, srcY, mainCanvas.width, dH, 0, dstY, mainCanvas.width, dH);
}

// ══════════════════════════════════════
// 彩带 DrawFn（纯色模式用）
// ══════════════════════════════════════

function getCanvasBg(): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--el-bg-color")
      .trim() || "hsl(210, 17%, 98%)"
  );
}

export function ribbonDrawFn(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  // 纯色底
  ctx.fillStyle = getCanvasBg();
  ctx.fillRect(0, 0, w, h);

  const ribbons = [
    { color: "hsla(330, 80%, 70%, 0.35)", offset: 0 },
    { color: "hsla(300, 70%, 68%, 0.30)", offset: 40 },
    { color: "hsla(270, 65%, 72%, 0.25)", offset: 80 },
  ];

  const ribbonW = 120;
  const startX = -w * 0.15;
  const startY = h * 0.95;
  const endX = w * 1.15;
  const endY = h * 0.15;
  const midX = w * 0.5;
  const midY = h * 0.55;

  ribbons.forEach((r) => {
    ctx.save();
    ctx.beginPath();
    const wo = Math.sin(p + r.offset * 0.02) * 20;

    ctx.moveTo(startX, startY - ribbonW + wo);
    ctx.quadraticCurveTo(midX - w * 0.18, midY - ribbonW * 1.5 + wo, endX, endY - ribbonW + wo);
    ctx.lineTo(endX, endY + ribbonW + wo);
    ctx.quadraticCurveTo(midX + w * 0.18, midY + ribbonW * 1.5 + wo, startX, startY + ribbonW + wo);
    ctx.closePath();
    ctx.fillStyle = r.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(startX, startY - ribbonW + 10 + wo);
    ctx.quadraticCurveTo(midX - w * 0.18, midY - ribbonW * 1.5 + 10 + wo, endX, endY - ribbonW + 10 + wo);
    ctx.strokeStyle = "hsla(0,0%,100%,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  });

  const bg = ctx.createLinearGradient(0, h * 0.7, 0, h);
  bg.addColorStop(0, "hsla(330,60%,70%,0)");
  bg.addColorStop(1, "hsla(330,60%,70%,0.08)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
}

// ══════════════════════════════════════
// 工厂
// ══════════════════════════════════════

export function createParallax(): ParallaxInstance {
  return {
    init(canvas: HTMLCanvasElement, _solid: DrawFn, _glass: DrawFn) {
      mainCanvas = canvas;
      mCtx = canvas.getContext("2d");
      offscreen = document.createElement("canvas");
      offCtx = offscreen.getContext("2d");

      solidDraw = _solid;
      glassDraw = _glass;
      detectGlass();

      classObserver = new MutationObserver(() => {
        detectGlass();
        if (offscreen && offCtx) {
          fillOffscreen(offscreen.width, offscreen.height);
          blit();
        }
      });
      classObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      if (canvasImageUrl.value) {
        loadImage(canvasImageUrl.value).then(() => {
          if (mainCanvas) resize(mainCanvas.width, mainCanvas.height);
        });
      }
    },

    tick() {
      phase += 0.005;
      if (activeDraw && offscreen && offCtx) {
        fillOffscreen(offscreen.width, offscreen.height);
      }
      blit();
    },

    resize(w: number, h: number) {
      if (!mainCanvas || !offscreen || !offCtx) return;
      mainCanvas.width = w;
      mainCanvas.height = h;
      contentH = h;
      offscreen.width = w;
      offscreen.height = h;
      fillOffscreen(w, h);
      blit();
    },

    destroy() {
      classObserver?.disconnect();
      classObserver = null;
      mainCanvas = null;
      mCtx = null;
      offscreen = null;
      offCtx = null;
      loadedImage = null;
      solidDraw = null;
      glassDraw = null;
      activeDraw = null;
    },
  };
}
