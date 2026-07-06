import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'sta-blog-app-token'

/** 从 localStorage 恢复持久化数据 */
function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return {
        accessToken: (data.accessToken as string) || null,
        refreshToken: (data.refreshToken as string) || null,
        expiresTime: (data.expiresTime as string) || null,
      }
    }
  } catch { /* ignore corrupted data */ }
  return { accessToken: null, refreshToken: null, expiresTime: null }
}

/** 持久化到 localStorage */
function persist(data: { accessToken: string | null; refreshToken: string | null; expiresTime: string | null }) {
  if (data.accessToken || data.refreshToken) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * vben-aligned token 响应式存储 — 对齐 yudao-ui-admin-vben 的 useAccessStore
 *
 * 方案：Setup Store + 手动持久化（避免 pinia-plugin-persistedstate 的 TS 类型推断问题）
 */
export const useAccessStore = defineStore('access', () => {
  // 从 localStorage 恢复初始值
  const persisted = loadPersisted()

  // --- state ---
  const accessToken = ref<string | null>(persisted.accessToken)
  const refreshToken = ref<string | null>(persisted.refreshToken)
  const expiresTime = ref<string | null>(persisted.expiresTime)

  // --- getters ---
  const isAuthenticated = computed(() => !!accessToken.value)

  // --- 自动持久化（监听 state 变化 → 写入 localStorage）---
  watch(
    [accessToken, refreshToken, expiresTime],
    ([at, rt, et]) => {
      persist({ accessToken: at, refreshToken: rt, expiresTime: et })
    },
    { deep: false },
  )

  // --- actions ---
  function setToken(data: { accessToken: string; refreshToken: string; expiresTime: string }) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    expiresTime.value = data.expiresTime
  }

  function updateAccessToken(token: string, exp: string) {
    accessToken.value = token
    expiresTime.value = exp
  }

  function clear() {
    accessToken.value = null
    refreshToken.value = null
    expiresTime.value = null
  }

  return {
    // state
    accessToken,
    refreshToken,
    expiresTime,
    // getters
    isAuthenticated,
    // actions
    setToken,
    updateAccessToken,
    clear,
  }
})
