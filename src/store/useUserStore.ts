import { defineStore } from "pinia"
import { computed, shallowRef } from "vue"
import { useAccessStore } from "@/store/useAccessStore"
import { getUserInfo } from "@/api/AppBlogUserController"

export const useUserStore = defineStore("user", () => {
  const userInfo = shallowRef<API.AppUserInfoRespVO>()
  const accessStore = useAccessStore()

  /** 是否已登录 — 依赖 useAccessStore.accessToken（响应式 ref，自动追踪变化） */
  const isLoggedIn = computed(() => !!accessStore.accessToken)

  /** 是否已有本地 Token */
  function hasToken(): boolean {
    return !!accessStore.accessToken
  }

  // 获取用户信息
  const getInfo = async () => {
    if (!accessStore.accessToken) {
      userInfo.value = undefined
      return
    }
    try {
      const res = await getUserInfo()
      userInfo.value = res as API.AppUserInfoRespVO
    } catch {
      // token 无效或过期 → 清除登录态
      userInfo.value = undefined
      accessStore.clear()
    }
  }

  // 清除登录态
  const clearUser = () => {
    userInfo.value = undefined
    accessStore.clear()
  }

  return {
    userInfo,
    isLoggedIn,
    hasToken,
    getInfo,
    clearUser,
  }
})
