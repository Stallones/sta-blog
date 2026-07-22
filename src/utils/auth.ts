/**
 * Token 工具层 — 委托 useAccessStore（Pinia 响应式 state）
 *
 * vben-aligned：useAccessStore 是唯一数据源，持久化由 store 内部 watch 自动处理。
 * 所有 GET_* / SET_* / REMOVE_* 函数都是 thin wrapper，确保调用方无需感知 store 实现。
 */
import { useAccessStore } from '@/store/useAccessStore'

export const GET_TOKEN = (): string | null => {
  return useAccessStore().accessToken
}

export const GET_REFRESH_TOKEN = (): string | null => {
  return useAccessStore().refreshToken
}

/** 登录成功后设置完整 token（remember 参数保留兼容，持久化由插件统一处理） */
export const SET_TOKEN = (
  data: { accessToken: string; refreshToken: string; expiresTime: string },
  _remember?: boolean,
) => {
  useAccessStore().setToken(data)
}

/** token 刷新后局部更新 accessToken + expiresTime */
export const UPDATE_ACCESS_TOKEN = (accessToken: string, expiresTime: string) => {
  useAccessStore().updateAccessToken(accessToken, expiresTime)
}

/** 移除所有 token（登出 / 失效时调用） */
export const REMOVE_TOKEN = () => {
  useAccessStore().clear()
}
