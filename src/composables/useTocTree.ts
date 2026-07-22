import { computed } from "vue";
import { useArticleView, makeHeadingId, type TocHeading } from "./useArticleView";
import type { TocNode } from "@/components/SCard/TocItem.vue";

/**
 * useTocTree — 目录树构建
 * 从 tocList（全局状态）构建 TocNode 树
 */
export function useTocTree() {
  const { tocList } = useArticleView();

  function buildTree(items: TocHeading[]): TocNode[] {
    const roots: TocNode[] = [];
    const stack: TocNode[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const node: TocNode = {
        text: item.text,
        level: item.level,
        index: item.index ?? i + 1,
        id: makeHeadingId(item.text),
        children: [],
      };

      // 跳过 h1
      if (item.level === 1) continue;

      // 找到父节点
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        roots.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }
      stack.push(node);
    }
    return roots;
  }

  const tree = computed(() => buildTree(tocList.value));

  return { tree };
}
