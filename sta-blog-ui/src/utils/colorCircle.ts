/**
 * OKLab 大圆采样颜色生成器
 *
 * 在感知均匀的 OKLab 色彩空间中，随机取一个过球心的大圆，
 * 等距采样 N 个颜色 → 视觉上均匀分布且差异明显。
 */

// ── sRGB ↔ linear 转换 ──
function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(x: number): number {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// ── linear RGB ↔ OKLab (Björn Ottosson) ──

function linearRgbToOklab(
  lr: number, lg: number, lb: number
): [number, number, number] {
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

function oklabToLinearRgb(
  L: number, a: number, b: number
): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

// ── OKLab → hex ──
function oklabToHex(L: number, a: number, b: number): string {
  const [lr, lg, lb] = oklabToLinearRgb(L, a, b);
  const r = Math.round(clamp01(linearToSrgb(lr)) * 255);
  const g = Math.round(clamp01(linearToSrgb(lg)) * 255);
  const bVal = Math.round(clamp01(linearToSrgb(lb)) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`;
}

// ── 3D 向量工具 ──

function randomUnitVector(): [number, number, number] {
  // Marsaglia 球面均匀采样
  let x: number, y: number, z: number, len: number;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
    len = x * x + y * y + z * z;
  } while (len > 1 || len === 0);
  const inv = 1 / Math.sqrt(len);
  return [x * inv, y * inv, z * inv];
}

function dot(
  a: [number, number, number],
  b: [number, number, number]
): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(
  v: [number, number, number]
): [number, number, number] {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  return [v[0] / len, v[1] / len, v[2] / len];
}

// ── 大圆采样 ──

/** OKLab 空间中心（中灰） */
const CENTER: [number, number, number] = [0.5, 0, 0];
/** 大圆半径（覆盖大部分 sRGB 色域） */
const RADIUS = 0.45;

/**
 * 在 OKLab 大圆上等距采样 n 个颜色。
 *
 * 每次调用：
 * 1. 随机生成一对正交向量 → 确定过球心的平面
 * 2. 随机起始角 → 等距取 n 个角度
 * 3. OKLab → sRGB → hex
 *
 * @param n - 采样颜色数
 * @returns hex 颜色数组
 */
export function getCircleColors(n: number): string[] {
  // 1. 随机单位向量 u
  const u = randomUnitVector();

  // 2. Gram-Schmidt → v ⟂ u
  const w = randomUnitVector();
  const duw = dot(u, w);
  const v = normalize([
    w[0] - duw * u[0],
    w[1] - duw * u[1],
    w[2] - duw * u[2],
  ]);

  // 3. 随机起始角
  const t0 = Math.random() * 2 * Math.PI;
  const dt = (2 * Math.PI) / n;

  // 4. 圆上采样
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = t0 + i * dt;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);

    const L = CENTER[0] + RADIUS * (u[0] * ca + v[0] * sa);
    const a = CENTER[1] + RADIUS * (u[1] * ca + v[1] * sa);
    const b = CENTER[2] + RADIUS * (u[2] * ca + v[2] * sa);

    colors.push(oklabToHex(L, a, b));
  }

  return colors;
}
