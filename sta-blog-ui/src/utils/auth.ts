// 获取token（适配 yudao 格式：{ accessToken, refreshToken, expiresTime }）
import {TOKEN_KEY} from "@/const";
import {ElMessage} from "element-plus";

export const GET_TOKEN = () => {
    const str = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    if (!str) return null
    try {
        const authObject = JSON.parse(str)
        // 判断 token 是否过期
        if (authObject.expiresTime && new Date(authObject.expiresTime) <= new Date()) {
            return null // 过期不删，留给 refreshToken 续期
        }
        return authObject.accessToken || null
    } catch {
        REMOVE_TOKEN()
        return null
    }
}

export const GET_REFRESH_TOKEN = () => {
    const str = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    if (!str) return null
    try {
        return JSON.parse(str).refreshToken || null
    } catch {
        return null
    }
}

// 设置token（yudao 格式）
export const SET_TOKEN = (data: { accessToken: string; refreshToken: string; expiresTime: string }, remember: boolean) => {
    const str = JSON.stringify(data);
    remember ? localStorage.setItem(TOKEN_KEY, str) : sessionStorage.setItem(TOKEN_KEY, str)
}

// 更新 token（refresh 后局部更新 accessToken）
export const UPDATE_ACCESS_TOKEN = (accessToken: string, expiresTime: string) => {
    const storage = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    if (!storage) return
    try {
        const obj = JSON.parse(storage)
        obj.accessToken = accessToken
        obj.expiresTime = expiresTime
        const str = JSON.stringify(obj)
        localStorage.getItem(TOKEN_KEY) ? localStorage.setItem(TOKEN_KEY, str) : sessionStorage.setItem(TOKEN_KEY, str)
    } catch { /* ignore */ }
}

// 移除token
export const REMOVE_TOKEN = () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
}
