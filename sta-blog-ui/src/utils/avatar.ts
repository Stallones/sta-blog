/**
 * 头像回退工具
 *
 * 当用户无头像时，根据昵称生成固定 HSL 色块 + 首字符。
 */

/**
 * 为任意字符串生成固定 HSL 颜色
 * 使用 DJB2 hash 确保相同输入 → 相同输出
 */
export function stringToHSL(str: string): { h: number; s: number; l: number } {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  // 色调 0-360，饱和度 45-75%，亮度 45-65%
  const h = Math.abs(hash) % 360;
  const s = 55 + (Math.abs(hash >> 8) % 20); // 55-74%
  const l = 48 + (Math.abs(hash >> 16) % 18); // 48-65%
  return { h, s, l };
}

/**
 * 根据 HSL 亮度判断文字颜色（亮背景 → 深色字，暗背景 → 浅色字）
 */
export function textColorFromLightness(l: number): string {
  return l > 55 ? "#1a1a1a" : "#ffffff";
}

/**
 * 获取头像回退字符：取昵称首字符，英文大写，汉字原样
 */
export function fallbackChar(nickname: string): string {
  const char = nickname.trim()[0] || "?";
  return /[a-zA-Z]/.test(char) ? char.toUpperCase() : char;
}

/**
 * 生成完整的内联样式 background-color 字符串
 */
export function avatarFallbackStyle(nickname: string): string {
  const { h, s, l } = stringToHSL(nickname);
  return `background-color: hsl(${h}, ${s}%, ${l}%); color: ${textColorFromLightness(l)};`;
}
