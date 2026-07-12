/**
 * useGlassMode — 玻璃拟态开关
 * 与 useColorMode (light/dark) 独立，通过 html.glass 类控制
 * 组合出 4 种模式：纯色白 / 纯色黑 / 玻璃白 / 玻璃黑
 */
import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

const GLASS_STORAGE_KEY = 'sta-blog-glass-mode'

/** 是否启用玻璃模式 */
const glassEnabled = ref(false)

/** 初始化：从 localStorage 读取上次的玻璃模式偏好 */
function initGlassMode() {
  const stored = localStorage.getItem(GLASS_STORAGE_KEY)
  glassEnabled.value = stored === 'true'
  applyGlassClass()
}

/** 将 glass 类同步到 html 元素 */
function applyGlassClass() {
  const html = document.documentElement
  if (glassEnabled.value) {
    html.classList.add('glass')
  } else {
    html.classList.remove('glass')
  }
}

/** 切换玻璃模式 */
function toggleGlass() {
  glassEnabled.value = !glassEnabled.value
  localStorage.setItem(GLASS_STORAGE_KEY, String(glassEnabled.value))
  applyGlassClass()
}

/** 设置玻璃模式 */
function setGlass(enabled: boolean) {
  glassEnabled.value = enabled
  localStorage.setItem(GLASS_STORAGE_KEY, String(enabled))
  applyGlassClass()
}

export function useGlassMode() {
  return {
    glassEnabled,
    initGlassMode,
    toggleGlass,
    setGlass,
  }
}
