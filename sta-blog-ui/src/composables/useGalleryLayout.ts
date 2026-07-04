import { ref, computed } from "vue";

/** 首页文章卡片布局模式（1-7） */
export type GalleryLayoutMode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const layoutMode = ref<GalleryLayoutMode>(3);

export function useGalleryLayout() {
  const mode = computed(() => layoutMode.value);

  function setMode(val: GalleryLayoutMode) {
    layoutMode.value = val;
  }

  /** 循环切换到下一个模式 (1→2→…→7→1) */
  function cycleMode() {
    layoutMode.value = ((layoutMode.value % 7) + 1) as GalleryLayoutMode;
  }

  return { mode, setMode, cycleMode };
}
