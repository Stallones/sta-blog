import { defineStore } from "pinia"
import { computed, shallowRef } from "vue"
import { GET_TOKEN, REMOVE_TOKEN } from "@/utils/auth.ts"
import { getUserInfo } from "@/api/AppBlogUserController"

export const useUserStore = defineStore("user", () => {
  const userInfo = shallowRef<API.AppUserInfoRespVO>()

  /** 是否已登录（userInfo 已加载） */
  const isLoggedIn = computed(() => !!userInfo.value)

  /** 是否已有本地 Token（每次重新读取 localStorage） */
  function hasToken(): boolean {
    return !!GET_TOKEN()
  }

  // 获取用户信息
  const getInfo = async () => {
    const token = GET_TOKEN()
    if (!token) {
      userInfo.value = undefined
      return
    }
    try {
      const res = await getUserInfo()
      userInfo.value = res as API.AppUserInfoRespVO
    } catch {
      // token 无效或过期 → 清除登录态
      userInfo.value = undefined
      REMOVE_TOKEN()
    }
  }

  // 清除登录态
  const clearUser = () => {
    userInfo.value = undefined
    REMOVE_TOKEN()
  }

  return {
    userInfo,
    isLoggedIn,
    hasToken,
    getInfo,
    clearUser,
  }
})
