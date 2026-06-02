import { ref } from "vue";

/**
 * 阅读模式 composable（全局单例）
 * 管理 isReadingMode 状态，跨组件共享
 */
const isReadingMode = ref(false);

export function useReadingMode() {
  function toggleReadingMode() {
    isReadingMode.value = !isReadingMode.value;
  }

  return { isReadingMode, toggleReadingMode };
}
