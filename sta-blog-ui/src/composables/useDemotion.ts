import { ref } from "vue";
import type { ApiResponse } from "@/types";

// ── 全局单例状态（启动后不再变化） ──
const isOnline = ref(false);
const isReady = ref(false);

// ── 独立服务状态（各自独立探测，不影响离线降级判定） ──
const yiyuanOnline = ref(false);
const imageOnline = ref(false);

/** App.vue onMounted 调用，初始探测后端是否可用（一次性判定，原生 fetch 绕过拦截器） */
async function checkService() {
  try {
    const res = await fetch("/api/app-api/blog/website-info/health", {
      signal: AbortSignal.timeout(5000),
    });
    isOnline.value = res.ok;
  } catch {
    isOnline.value = false;
  }
}

/** 所有初始化完成后调用，触发 router-view 渲染 */
function setReady() {
  isReady.value = true;
}

/** 探测一言服务是否可用 */
async function checkYiyuan() {
  const url = import.meta.env.VITE_YIYAN_API;
  if (!url) {
    yiyuanOnline.value = false;
    return;
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    yiyuanOnline.value = res.ok;
  } catch {
    yiyuanOnline.value = false;
  }
}

/** 探测图片服务（Minio）是否可用 */
async function checkImage() {
  const url = import.meta.env.VITE_MINIO_SERVE;
  if (!url) {
    imageOnline.value = false;
    return;
  }
  try {
    const res = await fetch(`${url}/minio/health/live`, {
      signal: AbortSignal.timeout(5000),
    });
    imageOnline.value = res.ok;
  } catch {
    imageOnline.value = false;
  }
}

/**
 * 降级请求：在线走网络，离线走本地读取
 *
 * - 在线模式下请求失败 → 直接 reload 页面（重新初始化）
 * - 离线模式下直接走 file-reader
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
    try {
      const result = await requestFn(...args);
      if (result && typeof result === "object" && "code" in result) {
        return result as unknown as ApiResponse<T>;
      }
      return { code: 0, msg: "success", data: result as T };
    } catch {
      // 在线请求失败 → 刷新页面重新初始化（等同于浏览器刷新）
      location.reload();
      // reload 后不会执行到这里，但 TS 需要返回值
      return { code: 500, msg: "服务不可用，正在刷新...", data: null as any };
    }
  } else {
    return readFn(...args);
  }
}

/**
 * 降级管理 composable（全局单例）
 *
 * - isOnline: 后端服务是否可用（启动后固化，不再切换）
 * - isReady: 所有初始化是否已完成（控制 router-view 渲染）
 * - yiyuanOnline: 一言服务是否可用
 * - imageOnline: 图片服务（Minio）是否可用
 * - checkService(): 后端初始探测
 * - setReady(): 所有初始化完成后触发
 * - checkYiyuan(): 一言服务探测
 * - checkImage(): 图片服务探测
 * - requestOrRead(): 降级请求（在线失败直接 reload）
 */
export function useDemotion() {
  return {
    isOnline,
    isReady,
    yiyuanOnline,
    imageOnline,
    checkService,
    setReady,
    checkYiyuan,
    checkImage,
    requestOrRead,
  };
}
