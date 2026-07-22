/**
 * @umijs/openapi 请求适配层
 *
 * http() 返回 { code, msg, data }，但 @umijs/openapi 的 TypeScript 类型
 * 期望直接拿到 data 内容。这里做一次解包。
 */
import http from '@/utils/http'

export default function request<T = any>(url: string, options?: any): Promise<T> {
  return http({ url, ...options }).then((res: any) => {
    // yudao 标准响应格式: { code: 0, msg: 'ok', data: ... }
    if (res.code !== undefined && res.code !== 0) {
      return Promise.reject(res)
    }
    return (res.data !== undefined ? res.data : res) as T
  })
}

