import { ref, watch } from "vue";
import { useFloatingMenu } from "./useFloatingMenu";

/**
 * 阅读模式 composable（全局单例）
 * 激活时自动隐藏 sidebar
 */
const isReadingMode = ref(false);

watch(isReadingMode, (val) => {
  const { sidebarVisible } = useFloatingMenu();
  sidebarVisible.value = !val;
});

export function useReadingMode() {
  function toggleReadingMode() {
    isReadingMode.value = !isReadingMode.value;
  }

  return { isReadingMode, toggleReadingMode };
}
