<script setup lang="ts">
import ReplyItem from "./ReplyItem.vue";
import { useCommentReply } from "@/composables/useCommentReply";

type ReplyItemType = API.AppCommentRespVO & API.AppMessageRespVO;

const props = withDefaults(
  defineProps<{
    rootId: number;
    rootUserId: number;
    total: number;
    authorId?: number;
    mode?: "comment" | "message";
    likeType?: number;
  }>(),
  {
    authorId: 0,
    mode: "comment",
    likeType: 20,
  }
);

const { onRefresh } = useCommentReply();

// ── 状态 ──
const expanded = ref(false);
const replies = ref<ReplyItemType[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const REPLY_PAGE_SIZE = 5;

// 注册 scoped 刷新回调
let unsubRefresh: (() => void) | null = null;
onMounted(() => {
  unsubRefresh = onRefresh(() => {
    if (expanded.value && replies.value.length > 0) {
      fetchReplies(currentPage.value);
    }
  }, props.rootId);
});
onUnmounted(() => {
  unsubRefresh?.();
});

// ── API 调用 ──
async function fetchReplies(page: number) {
  loading.value = true;
  try {
    const { getReplyPage } =
      props.mode === "message"
        ? await import("@/api/AppMessageController")
        : await import("@/api/AppCommentController");
    const res: any = await getReplyPage({
      rootId: props.rootId,
      pageNo: page,
      pageSize: REPLY_PAGE_SIZE,
    });
    if (res) {
      replies.value = res.list || [];
      totalPages.value = Math.ceil((res.total || 0) / REPLY_PAGE_SIZE);
      currentPage.value = page;
    }
  } finally {
    loading.value = false;
  }
}

// ── 展开/折叠 ──
function toggleExpand() {
  expanded.value = !expanded.value;
  if (expanded.value && replies.value.length === 0) {
    fetchReplies(1);
  }
}

// ── 翻页 ──
function handlePageChange(page: number) {
  fetchReplies(page);
}

// 分页按钮列表（B站风格：当前页 ±1）
const pageButtons = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages: (number | string)[] = [];
  for (let p = 1; p <= total; p++) {
    if (
      p === 1 ||
      p === total ||
      (p >= current - 1 && p <= current + 1)
    ) {
      pages.push(p);
    } else if (p === current - 2 || p === current + 2) {
      pages.push("...");
    }
  }
  return pages;
});
</script>

<template>
  <div class="s-reply-section" v-if="total > 0">
    <!-- 折叠态：展开触发器（展开后隐藏，收起按钮位于底部 pager 区） -->
    <div v-if="!expanded" class="s-reply-section__toggle" @click="toggleExpand">
      <span class="s-reply-section__toggle-label">共 {{ total }} 条回复，</span>
      <span class="s-reply-section__toggle-text">点击查看</span>
    </div>

    <!-- 展开态 -->
    <Transition name="s-reply-expand">
      <div v-if="expanded" class="s-reply-section__body">
        <!-- 加载中 -->
        <div v-if="loading" class="s-reply-section__loading">加载中...</div>

        <template v-else>
          <!-- 回复列表 -->
          <div class="s-reply-section__list">
            <ReplyItem
              v-for="item in replies"
              :key="item.id"
              :item="item"
              :root-id="rootId"
              :root-user-id="rootUserId"
              :author-id="authorId"
              :like-type="likeType"
            />
          </div>

          <!-- 分页器 + 收起（B站风格紧凑布局） -->
          <div class="s-reply-section__pager" v-if="total > REPLY_PAGE_SIZE">
            <!-- 仅 >1 页时显示页码导航 -->
            <template v-if="totalPages > 1">
              <span class="s-reply-section__pager-info">共 {{ totalPages }} 页</span>
              <button
                class="s-reply-section__page-btn"
                :class="{ 'is-active': currentPage === 1 }"
                :disabled="currentPage <= 1"
                @click="handlePageChange(1)"
              >1</button>
              <template v-for="p in pageButtons" :key="p">
                <span v-if="p === '...'" class="s-reply-section__dots">...</span>
                <button
                  v-else-if="p !== 1 && p !== totalPages"
                  class="s-reply-section__page-btn"
                  :class="{ 'is-active': p === currentPage }"
                  @click="handlePageChange(p as number)"
                >{{ p }}</button>
              </template>
              <button
                v-if="totalPages > 1"
                class="s-reply-section__page-btn"
                :class="{ 'is-active': currentPage === totalPages }"
                :disabled="currentPage >= totalPages"
                @click="handlePageChange(totalPages)"
              >{{ totalPages }}</button>
              <button
                class="s-reply-section__next-btn"
                :disabled="currentPage >= totalPages"
                @click="handlePageChange(currentPage + 1)"
              >下一页</button>
            </template>
            <!-- 收起按钮（始终显示） -->
            <button class="s-reply-section__collapse" @click="toggleExpand">
              收起 
            </button>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.s-reply-section {
  margin: 10px 0 0;
  padding-left: 52px; /* 40头像 + 12gap，与父评论内容区对齐 */
}

/* 展开/折叠触发器（折叠态：带左侧装饰线） */
.s-reply-section__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  border-left: 2px solid var(--el-border-color-lighter);
  transition: color 0.2s;

  /* "共N条回复" 灰色 */
  .s-reply-section__toggle-label {
    color: #999;
    cursor:text;
  }

  /* "点击查看" 蓝色 */
  .s-reply-section__toggle-text {
    color: var(--el-color-primary);
  }


}



/* 展开动画 */
.s-reply-expand {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    max-height: 0;
  }
  &-enter-to,
  &-leave-from {
    opacity: 1;
    max-height: 2000px;
  }
}

/* 主体（左侧竖线缩进，区分层级） */
.s-reply-section__body {
  margin-top: 4px;
}

.s-reply-section__loading {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 1rem;
  font-size: 13px;
}

.s-reply-section__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 分页器 + 收起 */
.s-reply-section__pager {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 8px 0 4px;
  font-size: 13px;
  flex-wrap: wrap;
}

.s-reply-section__pager-info {
  color: #333;
}

.s-reply-section__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 2px;

  &:hover:not(:disabled) {
    color: var(--el-color-primary);
  }

  &.is-active {
    color: var(--el-color-primary);
    font-weight: 600;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.s-reply-section__next-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  height: 22px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: var(--el-color-primary);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
}

.s-reply-section__dots {
  color: var(--el-text-color-placeholder);
  padding: 0 2px;
}

.s-reply-section__collapse {
  padding: 0 4px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
