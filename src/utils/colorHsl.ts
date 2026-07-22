/**
 * HSL 等距色相采样颜色生成器
 *
 * 保持饱和度和明度一致，在色相环上等距采样 N 个颜色。
 * 适配半透明白底遮罩场景 —— S 略高以对抗稀释。
 *
 * 导出函数：
 *   getHslCircleColors(n)  → 随机起始色相，每次色组不同
 *   getHslCircleColorsFixed(n) → 固定从 0° 开始，每次同样色组
 */

export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);

  function f(n: number): number {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(clamp01(color) * 255);
  }

  const r = f(0);
  const g = f(8);
  const b = f(4);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * HSL 等距色相采样
 * @param n - 采样颜色数
 * @param s - 饱和度 (0-100)，默认 80（适配半透明白底）
 * @param l - 明度 (0-100)，默认 50
 * @param hueStart - 起始色相 (0-360)，不传则随机
 * @returns hex 颜色数组
 */
export function getHslColors(
  n: number,
  s: number = 80,
  l: number = 50,
  hueStart?: number
): string[] {
  const start = hueStart ?? Math.random() * 360;
  const step = 360 / n;
  const colors: string[] = [];

  for (let i = 0; i < n; i++) {
    const h = (start + i * step) % 360;
    colors.push(hslToHex(h, s, l));
  }

  return colors;
}

/**
 * 随机起始色相的等距采样（每次调用色组不同，和 OKLab 版行为一致）
 */
export function getHslCircleColors(n: number): string[] {
  return getHslColors(n);
}
