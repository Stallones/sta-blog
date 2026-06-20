<script setup lang="ts">
export interface ReplyItem {
  id: number;
  commentUserAvatar: string;
  commentUserNickname: string;
  commentUserId: number;
  createTime: string;
  commentContent: string;
  likeCount: number;
  isLike: boolean;
  replyUserId: number;
  replyUserNickname?: string;
  typeId: number;
  parentId: number | null;
  childCommentCount?: number;
}

import CommentContent from "./CommentContent.vue";

const props = defineProps({
  items: {
    type: Array as () => ReplyItem[],
    required: true,
  },
  rootUserId: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  defaultShow: {
    type: Number,
    default: 1,
  },
  authorId: {
    type: Number,
    default: 0,
  },
  likeType: {
    type: Number,
  },
});

const emit = defineEmits<{
  (e: "like", item: ReplyItem): void;
  (e: "cancel-like", item: ReplyItem): void;
  (e: "reply", item: ReplyItem): void;
  (e: "toggle-expand"): void;
  (e: "page-change", page: number): void;
}>();

// 判断是否需要显示 @mention 前缀
function showMentionPrefix(item: ReplyItem): boolean {
  return item.replyUserId !== props.rootUserId;
}

function getMentionText(item: ReplyItem): string {
  return item.replyUserNickname || "";
}
</script>

<template>
  <div class="s-replies">
    <div class="s-replies__list">
      <div v-for="item in items" :key="item.id" class="s-replies__item">
        <!-- 头像 -->
        <el-avatar
          shape="circle"
          :size="24"
          :src="item.commentUserAvatar"
          class="s-replies__avatar"
        />
        <!-- 内容区 -->
        <div class="s-replies__body">
          <div class="s-replies__content">
            <span class="s-replies__nickname">{{
              item.commentUserNickname
            }}</span>
            <el-tag
              v-if="item.commentUserId === authorId"
              size="small"
              class="s-replies__author-tag"
              >作者</el-tag
            >
            <template v-if="showMentionPrefix(item)">
              <span>回复 </span>
              <span class="s-replies__mention">
                @{{ getMentionText(item) }}：
              </span>
            </template>
            <CommentContent :content="item.commentContent" font-size="15px" />
          </div>
          <!-- footer: 时间 + 点赞 + 回复 -->
          <div class="s-replies__footer">
            <span class="s-replies__time">{{ item.createTime }}</span>
            <div class="s-replies__actions">
              <span
                class="s-replies__action"
                v-show="!item.isLike"
                @click="$emit('like', item)"
              >
                <SvgIcon name="like" /> {{ item.likeCount }}
              </span>
              <span
                class="s-replies__action s-replies__action--liked"
                v-show="item.isLike"
                @click="$emit('cancel-like', item)"
              >
                <SvgIcon name="like-selected" /> {{ item.likeCount }}
              </span>
              <span class="s-replies__action" @click="$emit('reply', item)">
                回复
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- expander: 展开/收起 + 分页 -->
    <div class="s-replies__expander" v-if="total > defaultShow">
      <span class="s-replies__expander-text" @click="$emit('toggle-expand')">
        共 {{ total }} 条回复
        <span
          class="s-replies__expander-arrow"
          :class="{ 'is-expanded': expanded }"
          >▼</span
        >
      </span>
      <!-- 分页（仅展开时显示） -->
      <template v-if="expanded && totalPages > 1">
        <button
          class="s-replies__page-btn"
          :disabled="currentPage <= 1"
          @click="$emit('page-change', currentPage - 1)"
        >
          {{ "<" }}
        </button>
        <template v-for="p in totalPages" :key="p">
          <button
            v-if="
              p === 1 ||
              p === totalPages ||
              (p >= currentPage - 1 && p <= currentPage + 1)
            "
            class="s-replies__page-btn"
            :class="{ 'is-active': p === currentPage }"
            @click="$emit('page-change', p)"
          >
            {{ p }}
          </button>
          <span
            v-else-if="p === currentPage - 2 || p === currentPage + 2"
            class="s-replies__dots"
            >...</span
          >
        </template>
        <button
          class="s-replies__page-btn"
          :disabled="currentPage >= totalPages"
          @click="$emit('page-change', currentPage + 1)"
        >
          {{ ">" }}
        </button>
      </template>
      <!-- 收起按钮（展开后显示） -->
      <button
        v-if="expanded"
        class="s-replies__collapse"
        @click="$emit('toggle-expand')"
      >
        收起 ▲
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-replies {
  margin-top: 10px;
  padding-left: 60px; /* 48头像 + 12gap */

  .s-replies__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .s-replies__item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .s-replies__avatar {
    flex-shrink: 0;
  }

  .s-replies__body {
    flex: 1;
    min-width: 0;
  }
}

.s-replies__content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 5px;
  font-size: 15px;
  line-height: 22px;

  .s-replies__nickname {
    color: var(--el-text-color-placeholder);
  }

  .s-replies__mention {
    color: var(--el-color-primary);
  }
}

.s-replies__footer {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  margin: 10px 0px;
}

.s-replies__time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.s-replies__actions {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.s-replies__action {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;

  &:hover {
    color: var(--el-color-primary);
  }

  :deep(.svg-icon) {
    font-size: 13px;
  }
}

.s-replies__action--liked {
  color: var(--el-color-danger);
}

/* expander 展开器 */
.s-replies__expander {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  flex-wrap: wrap;
}

.s-replies__expander-text {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary);
  }
}

.s-replies__expander-arrow {
  display: inline-block;
  margin-left: 2px;
  font-size: 10px;
  transition: transform 0.3s;

  &.is-expanded {
    transform: rotate(180deg);
  }
}

.s-replies__collapse {
  padding: 2px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 3px;
  background: transparent;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 4px;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}

.s-replies__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 5px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: transparent;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color);
  }

  &.is-active {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    font-weight: bold;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.s-replies__dots {
  color: var(--el-text-color-placeholder);
  padding: 0 2px;
}
</style>
