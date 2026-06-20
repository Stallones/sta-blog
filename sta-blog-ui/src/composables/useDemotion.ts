import { ref } from "vue";
import { healthCheck } from "@/apis/website";
import type { ApiResponse } from "@/types";

// ── 全局单例状态 ──
const isOnline = ref(false);
const isReady = ref(false);

/** 发起健康检查（App.vue onMounted 调用一次） */
async function checkService() {
  try {
    const res = await healthCheck();
    if (res.code === 200) {
      isOnline.value = true;
    }
  } catch {
    isOnline.value = false;
  } finally {
    isReady.value = true;
  }
}

/** 降级请求：在线走网络，离线走本地读取 */
function requestOrRead<T, Args extends any[]>(
  requestFn: (...args: Args) => Promise<ApiResponse<T>>,
  readFn: (...args: Args) => Promise<ApiResponse<T>>,
  ...args: Args
): Promise<ApiResponse<T>> {
  if (isOnline.value) {
    return requestFn(...args);
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
