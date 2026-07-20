/**
 * BackgroundParallax — 视口滚动引擎
 *
 * 职责：管理 offscreen 画布 + 滚动 blit。
 * 内容由外部 DrawFn 注入：默认使用 ribbonDrawFn（飘带）。
 */

import { watch } from "vue";
import { useDark } from "@vueuse/core";
import { useCanvasEffects } from "@/composables/useCanvasEffects";
import { useGlassMode } from "@/composables/useGlassMode";
import canvBgUrl from "@/assets/images/canv-bg.png";

const { canvasHeaderH, canvasImageUrl } = useCanvasEffects();
const { glassEnabled } = useGlassMode();
const isDark = useDark();

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
let stopGlassWatcher: (() => void) | null = null;
let stopDarkWatcher: (() => void) | null = null;
let isGlass = false;
let phase = 0;

/** 当前活跃的绘制函数 */
let solidDraw: DrawFn | null = null;
let glassDraw: DrawFn | null = null;
let activeDraw: DrawFn | null = null;

function detectGlass() {
  isGlass = glassEnabled.value;
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
      .getPropertyValue("--bg-page")
      .trim() || "hsl(210, 17%, 98%)"
  );
}

/**
 * 飘带绘制 — 基于 hustcc/ribbon.js 三角形链算法
 * 连续三角形共享边，锐角转折处自然产生折叠重叠效果
 * 路径仅在 resize 时重新生成
 */

/** 缓存的飘带点序列 */
let ribbonPoints: { x: number; y: number }[] | null = null;
/** 飘带点序列对应的画布尺寸（用于 scale 缩放） */
let ribbonBaseW = 0;
let ribbonBaseH = 0;
/** 飘带尺寸因子 */
const RIBBON_SIZE = 120;
/**
 * 生成飘带点序列（三角形链）
 * 从左侧中下段出发，向右上方向延伸，终点在中上段
 */
function generateRibbonPoints(w: number, h: number): { x: number; y: number }[] {
  const f = RIBBON_SIZE;
  const pts: { x: number; y: number }[] = [];

  // 起点：左侧中下段（Y: 60%~80%）
  const startY = h * 0.6 + Math.random() * h * 0.2;
  pts.push({ x: 0, y: startY - f * 0.5 });
  pts.push({ x: 0, y: startY + f * 0.5 });

  let cx = 0;
  let cy = startY + f * 0.5;

  while (cx < w + f) {
    const nx = cx + (Math.random() * 2 - 0.25) * f;
    // Y 偏移偏向上（最终到达中上段 20%~40%）
    let ny = cy + (Math.random() * 2 - 1.3) * f;
    let attempts = 0;
    while ((ny > h + f || ny < -f) && attempts < 20) {
      ny = cy + (Math.random() * 2 - 1.3) * f;
      attempts++;
    }
    pts.push({ x: nx, y: ny });
    cx = nx;
    cy = ny;
  }

  return pts;
}

export function ribbonDrawFn(ctx: CanvasRenderingContext2D, w: number, h: number, _p: number) {
  // 纯色底
  ctx.fillStyle = getCanvasBg();
  ctx.fillRect(0, 0, w, h);

  // 路径缓存：仅在首次生成（后续 resize 通过 scale 等比缩放，不重建点序列）
  if (!ribbonPoints) {
    ribbonPoints = generateRibbonPoints(w, h);
    ribbonBaseW = w;
    ribbonBaseH = h;
  }

  const pts = ribbonPoints;

  // 等比缩放：画布尺寸变化时，像图片一样整体压缩/拉伸
  const scaleX = w / ribbonBaseW;
  const scaleY = h / ribbonBaseH;

  ctx.save();
  ctx.scale(scaleX, scaleY);
  ctx.globalAlpha = 0.55;

  // 三角形链绘制（同 ribbon.js 算法）
  for (let i = 0; i < pts.length - 2; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const c = pts[i + 2];

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();

    // 颜色：粉红(340) → 蓝(200) 宽域渐变
    const t = i / Math.max(1, pts.length - 3);
    const hue = 360 - t * 240;
    ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
    ctx.fill();
  }

  ctx.restore();
}

// ══════════════════════════════════════
// 暗色模式背景图
// ══════════════════════════════════════

let darkBgImage: HTMLImageElement | null = null;
let darkBgLoaded = false;

function ensureDarkBgImage() {
  if (darkBgImage) return;
  darkBgImage = new Image();
  darkBgImage.onload = () => { darkBgLoaded = true; };
  darkBgImage.src = canvBgUrl;
}

/** 暗色模式：极光图 cover fit 绘制 */
function darkBgDrawFn(ctx: CanvasRenderingContext2D, w: number, h: number, _p: number) {
  ensureDarkBgImage();

  if (darkBgLoaded && darkBgImage) {
    const imgW = darkBgImage.naturalWidth;
    const imgH = darkBgImage.naturalHeight;
    const scale = Math.max(w / imgW, h / imgH);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (imgW - sw) / 2;
    const sy = (imgH - sh) / 2;
    ctx.drawImage(darkBgImage, sx, sy, sw, sh, 0, 0, w, h);
  } else {
    ctx.fillStyle = "hsl(240, 25%, 6%)";
    ctx.fillRect(0, 0, w, h);
  }
}

/** 模式感知绘制：暗色用图，亮色用飘带 */
export function modeDrawFn(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  if (isDark.value && glassEnabled.value) {
    darkBgDrawFn(ctx, w, h, p);
    // ribbonDrawFn(ctx, w, h, p);
  } else {
    ribbonDrawFn(ctx, w, h, p);
  }
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

      // 玻璃模式切换 → 重绘
      stopGlassWatcher = watch(glassEnabled, () => {
        detectGlass();
        if (offscreen && offCtx) {
          fillOffscreen(offscreen.width, offscreen.height);
          blit();
        }
      });

      // 亮/暗模式切换 → 重绘
      stopDarkWatcher = watch(isDark, () => {
        if (offscreen && offCtx) {
          fillOffscreen(offscreen.width, offscreen.height);
          blit();
        }
      });

      if (canvasImageUrl.value) {
        loadImage(canvasImageUrl.value).then(() => {
          if (mainCanvas) this.resize(mainCanvas.width, mainCanvas.height);
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
      stopGlassWatcher?.();
      stopGlassWatcher = null;
      stopDarkWatcher?.();
      stopDarkWatcher = null;
      mainCanvas = null;
      mCtx = null;
      offscreen = null;
      offCtx = null;
      loadedImage = null;
      darkBgImage = null;
      darkBgLoaded = false;
      ribbonPoints = null;
      ribbonBaseW = 0;
      ribbonBaseH = 0;
      solidDraw = null;
      glassDraw = null;
      activeDraw = null;
    },
  };
}
