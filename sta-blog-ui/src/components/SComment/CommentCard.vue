<script setup lang="ts">
import CommentContent from "./CommentContent.vue";
import { useCommentReply } from "@/composables/useCommentReply";
import { dayjs } from "element-plus";

const props = withDefaults(
  defineProps<{
    item: any;
    authorId?: number;
    likeType?: number;
    rootId?: number;
    showReplyCount?: boolean;
  }>(),
  {
    authorId: 0,
    likeType: 20,
    rootId: 0,
    showReplyCount: true,
  }
);

const { openReply, toggleItemLike } = useCommentReply();

const nickname = computed(
  () => props.item.userNickname || ("用户" + (props.item.userId || ""))
);
const isAuthor = computed(
  () => props.item.userId === props.authorId && props.authorId > 0
);

function handleReply() {
  openReply(props.rootId || props.item.id, {
    id: props.item.id,
    nickname: nickname.value,
    parentId: props.item.id,
    parentUserId: props.item.id,
    replyUserId: props.item.userId || 0,
    isReplyToRoot: true,
  });
}

function handleLike() {
  toggleItemLike(props.item, props.likeType);
}
</script>

<template>
  <div class="s-comment__card">
    <el-avatar
      shape="square"
      :size="40"
      class="s-comment__avatar"
      :src="item.userAvatar"
    />
    <div class="s-comment__body">
      <!-- 元信息行：昵称 + 标签 -->
      <div class="s-comment__meta">
        <span class="s-comment__nickname">{{ nickname }}</span>
        <el-tag v-if="isAuthor" size="small" type="danger">作者</el-tag>
        <span v-if="item.ipLocation" class="s-comment__tag">{{ item.ipLocation }}</span>
        <span v-if="item.browser" class="s-comment__tag">{{ item.browser }}</span>
        <span v-if="item.os" class="s-comment__tag">{{ item.os }}</span>
      </div>
      <!-- 内容 -->
      <div class="s-comment__content">
        <CommentContent :content="item.content || ''" />
      </div>
      <!-- 底部操作栏 -->
      <div class="s-comment__footer">
        <span class="s-comment__time">{{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm") }}</span>
        <span
          :class="['s-comment__action', item.isLiked && 's-comment__action--liked']"
          @click="handleLike"
        >
          {{ item.isLiked ? '已赞同 ' : '赞同 ' }}{{ item.likeCount ? `(${item.likeCount})` : '(0)' }}
        </span>
        <span class="s-comment__action" @click="handleReply">
          回复
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-comment__card {
  display: flex;
  gap: 12px;
}

.s-comment__avatar {
  flex-shrink: 0;
}

.s-comment__body {
  flex: 1;
  min-width: 0;
}

.s-comment__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.s-comment__nickname {
  font-size: 14px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.s-comment__tag {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  padding: 1px 6px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 3px;
  background-color: var(--el-fill-color-lighter);
  white-space: nowrap;
}

.s-comment__content {
  margin: 10px 0;
  line-height: 1.6;
  word-break: break-word;
}

.s-comment__footer {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  margin: 10px 0;
}

.s-comment__time {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.s-comment__action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;

  &:hover {
    color: var(--el-color-primary);
  }
}

.s-comment__action--liked {
  color: var(--el-color-danger);
}
</style>
