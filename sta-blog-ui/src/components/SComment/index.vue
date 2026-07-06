<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { createComment } from "@/api/AppCommentController";
import { createMessage } from "@/api/AppMessageController";
import { BlogType } from "@/const";
import { useCommentReply } from "@/composables/useCommentReply";
import { useUserStore } from "@/store/useUserStore";
import router from "@/router";
import CommentCard from "./CommentCard.vue";
import ReplySection from "./ReplySection.vue";
import ReplyBox from "./ReplyBox.vue";
import CommentInput from "./CommentInput.vue";

// ── Props ──
const props = withDefaults(
  defineProps<{
    mode?: "comment" | "message";
    articleId?: number;
    serverOn?: boolean;
    authorId?: number;
    isShowHeader?: boolean;
    likeType?: number;
  }>(),
  {
    mode: "comment",
    articleId: 0,
    serverOn: false,
    authorId: 0,
    isShowHeader: true,
    likeType: BlogType.COMMENT,
  }
);

const { isRootActive, onRefresh } = useCommentReply();

// ── 状态 ──
const items = ref<any[]>([]);
const totalCount = ref(0);
const currentPage = ref(0);
const pageSize = 10;
const loading = ref(false);
const hasMore = ref(true);
const sortType = ref("newest");

// ── API 选择 ──
const pageTitle = computed(() => (props.mode === "comment" ? "评论" : "留言"));
const likeTypeForItem = computed(() =>
  props.mode === "comment" ? BlogType.COMMENT : BlogType.MESSAGE
);

// 注册全局刷新回调 + IntersectionObserver 无限滚动
let unsubRefresh: (() => void) | null = null;
onMounted(() => {
  unsubRefresh = onRefresh(() => {
    currentPage.value = 0;
    hasMore.value = true;
    fetchPage();
  });
  if (props.serverOn && (props.articleId > 0 || props.mode === "message")) {
    fetchPage();
  }

  // 初始化 IntersectionObserver 无限滚动
  scrollObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore.value && !loading.value) {
        fetchPage(true);
      }
    },
    { rootMargin: "100px" }
  );
  nextTick(() => {
    if (sentinelRef.value) scrollObserver?.observe(sentinelRef.value);
  });
});
onUnmounted(() => {
  unsubRefresh?.();
  scrollObserver?.disconnect();
});

async function fetchPage(append = false) {
  if (loading.value || !props.serverOn) return;
  loading.value = true;
  try {
    const page = currentPage.value + 1;
    let res: any;

    if (props.mode === "comment") {
      const { getCommentPage } = await import("@/api/AppCommentController");
      res = await getCommentPage({
        articleId: props.articleId,
        orderBy: sortType.value,
        pageNo: page,
        pageSize,
      });
    } else {
      const { getMessagePage } = await import("@/api/AppMessageController");
      res = await getMessagePage({
        orderBy: sortType.value,
        pageNo: page,
        pageSize,
      });
    }

    if (res) {
      const list = res.list || [];
      if (append) {
        items.value.push(...list);
      } else {
        items.value = list;
      }
      totalCount.value = res.total || 0;
      currentPage.value = page;
      hasMore.value = items.value.length < totalCount.value;
    }
  } finally {
    loading.value = false;
  }
}

// ── 排序切换 ──
function handleSortChange(val: string) {
  sortType.value = val;
  currentPage.value = 0;
  hasMore.value = true;
  items.value = [];
  fetchPage();
}

// ── 无限滚动（IntersectionObserver，替换废弃的 v-infinite-scroll） ──
const sentinelRef = ref<HTMLElement | null>(null);
let scrollObserver: IntersectionObserver | null = null;

// ── 发布顶级评论/留言 ──
async function handleSubmit(content: string) {
  if (!content.trim()) {
    ElMessage.error(`${pageTitle.value}内容不能为空`);
    return;
  }
  // 未登录检查
  const userStore = useUserStore();
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再发表' + pageTitle.value);
    router.push('/user/login');
    return;
  }
  let res: any;
  if (props.mode === "comment") {
    res = await createComment({
      articleId: props.articleId,
      content,
      parentId: 0,
      toUserId: 0,
    });
  } else {
    res = await createMessage({
      content,
      parentId: 0,
      toUserId: 0,
    });
  }
  if (res) {
    ElMessage.success(`${pageTitle.value}成功`);
    currentPage.value = 0;
    hasMore.value = true;
    fetchPage();
  }
}

// ── 初始化 & 监听 ──
watch(
  () => props.articleId,
  () => {
    if (props.articleId > 0 && props.serverOn) {
      currentPage.value = 0;
      hasMore.value = true;
      items.value = [];
      fetchPage();
    }
  }
);

watch(
  () => props.serverOn,
  (val) => {
    if (val && (props.articleId > 0 || props.mode === "message")) {
      currentPage.value = 0;
      hasMore.value = true;
      items.value = [];
      fetchPage();
    }
  }
);
</script>

<template>
  <div class="s-comment">
    <!-- 头部：输入框 -->
    <div v-if="isShowHeader" class="s-comment__header">
      <div class="s-comment__title">
        <svg-icon name="comment" width="1.5em" height="1.5em" />
        <span>{{ pageTitle }}({{ totalCount }})</span>
      </div>
      <CommentInput :server-on="serverOn" @submit="handleSubmit" />
    </div>

    <!-- 排序栏 -->
    <div v-if="serverOn && items.length > 0" class="s-comment__sort-bar">
      <span class="s-comment__sort-label">{{ totalCount }} 条{{ pageTitle }}</span>
      <el-dropdown trigger="click" @command="handleSortChange">
        <span class="s-comment__sort-trigger">
          {{ sortType === 'newest' ? '最新' : '最热' }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="newest">最新</el-dropdown-item>
            <el-dropdown-item command="hottest">最热</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 列表（IntersectionObserver 实现无限滚动） -->
    <div v-if="serverOn" class="s-comment__list">
      <div
        v-for="item in items"
        :key="item.id"
        class="s-comment__item"
      >
        <!-- 评论卡片 -->
        <CommentCard
          :item="item"
          :author-id="authorId"
          :like-type="likeTypeForItem"
          :root-id="item.id"
        />

        <!-- 回复区（折叠/展开/分页） -->
        <ReplySection
          v-if="item.replyCount > 0"
          :root-id="item.id"
          :root-user-id="item.userId || 0"
          :total="item.replyCount"
          :author-id="authorId"
          :mode="mode"
          :like-type="likeTypeForItem"
        />

        <!-- 顶级回复输入框 -->
        <Transition name="s-reply-box-expand">
          <ReplyBox
            v-if="isRootActive(item.id)"
            :article-id="articleId"
            :mode="mode"
          />
        </Transition>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="s-comment__loading">加载中...</div>
      <div v-if="!hasMore && items.length > 0" class="s-comment__no-more">
        没有更多{{ pageTitle }}了
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && items.length === 0" class="s-comment__empty">
        暂无{{ pageTitle }}，来抢沙发吧~
      </div>

      <!-- IntersectionObserver 哨兵：监测靠近底部时加载更多 -->
      <div ref="sentinelRef" class="s-comment__sentinel"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-comment {
  padding: 1rem 0;
}

.s-comment__header {
  margin-bottom: 1.5rem;
}

.s-comment__title {
  display: flex;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;
  margin: 1.5rem 0;

  span {
    margin-left: 0.5rem;
  }
}

/* 排序栏 */
.s-comment__sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  margin-bottom: 8px;
}

.s-comment__sort-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.s-comment__sort-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--el-color-primary);
  user-select: none;
}

/* 列表 */
.s-comment__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.s-comment__item {
  padding: 1rem 0 1rem;
  border-top: 1px solid var(--el-border-color-lighter);
}

.s-comment__loading {
  text-align: center;
  padding: 1rem;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.s-comment__no-more {
  text-align: center;
  padding: 1rem;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}

.s-comment__empty {
  text-align: center;
  padding: 2rem;
  color: var(--el-text-color-placeholder);
  font-size: 14px;
}

/* 无限滚动哨兵（不可见，IntersectionObserver 监测用） */
.s-comment__sentinel {
  height: 1px;
}

/* 回复框展开动画 */
.s-reply-box-expand {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    padding-top: 0;
  }
  &-enter-to,
  &-leave-from {
    opacity: 1;
    max-height: 300px;
  }
}
</style>
