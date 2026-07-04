import { toggleLike } from "@/api/AppLikeController";
import { createComment } from "@/api/AppCommentController";
import { createMessage } from "@/api/AppMessageController";

// ── Types ──
export interface ReplyTarget {
  id: number;
  nickname: string;
  parentId: number;
  parentUserId: number;
  replyUserId: number;
  isReplyToRoot: boolean;
}

// ── Module-level singleton state ──
const activeRootId = ref<number | null>(null);
const activeTarget = ref<ReplyTarget | null>(null);
const replyText = ref("");

// ── Refresh callback registry ──
type RefreshEntry = { cb: () => void; rootId?: number };
const refreshCallbacks = ref<RefreshEntry[]>([]);

export function useCommentReply() {
  // ── UI state (readonly for consumers) ──

  function isRootActive(rootId: number): boolean {
    return activeRootId.value === rootId;
  }

  // ── Reply box control ──

  function openReply(rootId: number, target: ReplyTarget) {
    // Toggle: click same target to close
    if (activeRootId.value === rootId && activeTarget.value?.id === target.id) {
      closeReply();
      return;
    }
    activeRootId.value = rootId;
    activeTarget.value = target;
    replyText.value = "";
  }

  function closeReply() {
    activeRootId.value = null;
    activeTarget.value = null;
    replyText.value = "";
  }

  // ── Like ──

  async function toggleItemLike(item: any, likeType: number) {
    const res: any = await toggleLike({
      type: likeType as any,
      typeId: item.id,
    });
    if (res !== undefined) {
      item.isLiked = res;
      item.likeCount = (item.likeCount || 0) + (res ? 1 : -1);
    }
  }

  // ── Submit reply ──

  async function submitReply(params: {
    mode: "comment" | "message";
    articleId: number;
  }): Promise<boolean> {
    if (!replyText.value.trim()) {
      ElMessage.warning("内容不能为空");
      return false;
    }
    if (!activeTarget.value) return false;

    const { mode, articleId } = params;
    let res: any;

    if (mode === "message") {
      res = await createMessage({
        content: replyText.value,
        parentId: activeTarget.value.parentId,
        toUserId: activeTarget.value.replyUserId,
      });
    } else {
      res = await createComment({
        articleId,
        content: replyText.value,
        parentId: activeTarget.value.parentId,
        toUserId: activeTarget.value.replyUserId,
      });
    }

    if (res) {
      ElMessage.success("回复成功");
      const rootId = activeRootId.value;
      closeReply();
      // Fire refresh callbacks
      fireRefresh(rootId);
      return true;
    }
    return false;
  }

  function fireRefresh(rootId: number | null) {
    for (const entry of refreshCallbacks.value) {
      if (entry.rootId === undefined || entry.rootId === rootId) {
        entry.cb();
      }
    }
  }

  // ── Refresh hook ──

  function onRefresh(cb: () => void, rootId?: number): () => void {
    const entry: RefreshEntry = { cb, rootId };
    refreshCallbacks.value.push(entry);
    return () => {
      const idx = refreshCallbacks.value.indexOf(entry);
      if (idx > -1) refreshCallbacks.value.splice(idx, 1);
    };
  }

  return {
    activeRootId,
    activeTarget,
    replyText,
    isRootActive,
    openReply,
    closeReply,
    toggleItemLike,
    submitReply,
    onRefresh,
  };
}
