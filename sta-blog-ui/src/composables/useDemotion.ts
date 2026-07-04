import { ref } from "vue";
import { healthCheck } from "@/api/AppWebsiteInfoController";
import type { ApiResponse } from "@/types";

// ── 全局单例状态 ──
const isOnline = ref(false);
const isReady = ref(false);

/** 发起健康检查（App.vue onMounted 调用一次） */
async function checkService() {
  try {
    await healthCheck();
    // 新 API：请求成功（未 reject）即表示后端在线
    isOnline.value = true;
  } catch {
    isOnline.value = false;
  } finally {
    isReady.value = true;
  }
}

/**
 * 降级请求：在线走网络，离线走本地读取
 *
 * 新 API (request.ts) 返回解包后的 T（直接是 data，不是 ApiResponse<T>），
 * 此函数自动将其包装回 ApiResponse<T>，保持离线/在线调用方一致。
 */
async function requestOrRead<T, Args extends any[]>(
  requestFn: (...args: Args) => Promise<T>,
  readFn: (...args: Args) => Promise<ApiResponse<T>>,
  ...args: Args
): Promise<ApiResponse<T>> {
  if (isOnline.value) {
    const result = await requestFn(...args);
    if (result && typeof result === "object" && "code" in result) {
      return result as unknown as ApiResponse<T>;
    }
    return { code: 200, msg: "success", data: result as T };
  } else {
    return readFn(...args);
  }
}

/**
 * 降级管理 composable（全局单例）
 *
 * - isOnline: 后端服务是否可用
 * - isReady: 健康检查是否已完成
 * - checkService(): 发起健康检查
 * - requestOrRead(): 降级请求
 */
export function useDemotion() {
  return { isOnline, isReady, checkService, requestOrRead };
}
