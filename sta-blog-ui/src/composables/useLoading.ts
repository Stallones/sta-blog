import { shallowRef } from "vue";

/**
 * 全局 loading composable（全局单例）
 * 管理 isLoading 状态 + body overflow 锁定
 */
const isLoading = shallowRef(false);

export function useLoading() {
  function show() {
    document.body.style.overflow = "hidden";
    isLoading.value = true;
  }

  function hide() {
    document.body.style.overflow = "";
    isLoading.value = false;
  }

  return { isLoading, show, hide };
}
