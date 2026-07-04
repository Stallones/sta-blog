import { defineStore } from "pinia"
import { GET_TOKEN } from "@/utils/auth.ts"
import { getUserInfo } from "@/api/AppBlogUserController"

export const useUserStore = defineStore("user", () => {
  const token = GET_TOKEN()
  const userInfo = shallowRef<API.AppUserInfoRespVO>();

  /** 是否已登录 */
  const isLoggedIn = computed(() => !!userInfo.value)

  // 获取用户信息
  const getInfo = async () => {
    if (!token) return
    const res = await getUserInfo()
    userInfo.value = res as API.AppUserInfoRespVO
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    getInfo,
  }
})
