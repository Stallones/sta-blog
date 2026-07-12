/**
 * BackgroundLightSources — 玻璃模式背景绘制
 *
 * 加载 canv-bg.jpg 极光图，以 cover 方式适配画布，
 * 保留视口滚动引擎的 blit 逻辑，图片静止而视口上移展示。
 */

import type { DrawFn } from "./BackgroundParallax";
import canvBgUrl from "@/assets/images/canv-bg.png";
// import canvBgUrl from "@/assets/images/forest.jpg";

let bgImage: HTMLImageElement | null = null;
let imageLoaded = false;

/** 懒加载极光背景图（只加载一次） */
function ensureBgImage() {
  if (bgImage) return;
  bgImage = new Image();
  bgImage.onload = () => { imageLoaded = true; };
  bgImage.src = canvBgUrl;
}

export function lightDrawFn(ctx: CanvasRenderingContext2D, w: number, h: number, _phase: number) {
  const isGlass = document.documentElement.classList.contains("glass");
  if (!isGlass) return;

  const isDark = document.documentElement.classList.contains("dark");

  ensureBgImage();

  // 绘制极光图：图片铺满，亮色/暗色都不加底色填充
  if (imageLoaded && bgImage) {
    const imgW = bgImage.naturalWidth;
    const imgH = bgImage.naturalHeight;
    const scale = Math.max(w / imgW, h / imgH);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (imgW - sw) / 2;
    const sy = (imgH - sh) / 2;

    ctx.drawImage(bgImage, sx, sy, sw, sh, 0, 0, w, h);
  } else {
    // 图片未加载时的兜底
    const bg = isDark ? "hsl(240, 25%, 6%)" : "hsl(210, 20%, 96%)";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
}
