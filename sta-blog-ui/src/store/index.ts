import { createPinia } from 'pinia'

const pinia = createPinia()

/** 重置所有 Pinia stores（登出时使用，对齐 vben 的 resetAllStores） */
export function resetAllStores() {
  if (!pinia) return
  const allStores = (pinia as any)._s
  for (const [, store] of allStores) {
    if (typeof store.$reset === 'function') store.$reset()
  }
}

export default pinia