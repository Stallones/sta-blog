<script setup lang="ts">
import CommentContent from "./CommentContent.vue";
import { useReply } from "@/composables/useReply";
import { dayjs } from "element-plus";

const props = withDefaults(
  defineProps<{
    item: any;
    rootId?: number;
    rootUserId?: number;
    authorId?: number;
    likeType?: number;
  }>(),
  {
    rootId: 0,
    rootUserId: 0,
    authorId: 0,
    likeType: 20,
  },
);

const { openReply, toggleItemLike } = useReply();

/** 是否显示 @mention 前缀 */
const showMention = computed(
  () => props.item.toUserId !== props.rootUserId && props.item.toUserId > 0,
);

/** 被回复人昵称，兜底避免占位值暴露 */
const toUserNickname = computed(() => {
  const name = props.item.toUserNickname;
  if (!name || name === "__" || name === "") {
    return "用户" + (props.item.toUserId || "");
  }
  return name;
});

const isAuthor = computed(
  () => props.item.userId === props.authorId && props.authorId > 0,
);

function handleReply() {
  openReply(props.rootId, {
    id: props.item.id,
    nickname: props.item.userNickname || ("用户" + (props.item.userId || "")),
    parentId: props.item.id,
    parentUserId: props.rootId,
    replyUserId: props.item.userId || 0,
    isReplyToRoot: false,
  });
}

function handleLike() {
  toggleItemLike(props.item, props.likeType);
}
</script>

<template>
  <div class="s-reply-item">
    <!-- 头像（方形，与 CommentCard 保持一致） -->
    <el-avatar
      shape="square"
      :size="35"
      :src="item.userAvatar"
      class="s-reply-item__avatar"
    />
    <!-- 内容区：三行布局 -->
    <div class="s-reply-item__body">
      <!-- Row 1: 元信息行（昵称 + [作者] + [IP] [浏览器] [OS]） -->
      <div class="s-reply-item__meta">
        <span class="s-reply-item__nickname">{{
          item.userNickname || "用户" + (item.userId || "")
        }}</span>
        <el-tag v-if="isAuthor" size="small" class="s-reply-item__author-tag"
          >作者</el-tag
        >
        <span v-if="item.ipLocation" class="s-reply-item__tag">{{
          item.ipLocation
        }}</span>
        <span v-if="item.browser" class="s-reply-item__tag">{{
          item.browser
        }}</span>
        <span v-if="item.os" class="s-reply-item__tag">{{ item.os }}</span>
      </div>
      <!-- Row 2: @mention + 正文（同行） -->
      <div class="s-reply-item__content">
        <template v-if="showMention">
          <span class="s-reply-item__reply-text">回复</span>
          <span class="s-reply-item__mention">@{{ toUserNickname }}</span>
        </template>
        <CommentContent :content="item.content || ''" font-size="14px" />
      </div>
      <!-- Row 3: 底部操作行（时间 + 赞同 + 回复） -->
      <div class="s-reply-item__footer">
        <span class="s-reply-item__time">{{
          dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
        }}</span>
        <div class="s-reply-item__actions">
          <span
            :class="[
              's-reply-item__action',
              item.isLiked && 's-reply-item__action--liked',
            ]"
            @click="handleLike"
          >
            {{ item.isLiked ? "已赞同 " : "赞同 "
            }}{{ item.likeCount ? `(${item.likeCount})` : "(0)" }}
          </span>
          <span class="s-reply-item__action" @click="handleReply">
            回复
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-reply-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.s-reply-item__avatar {
  flex-shrink: 0;
}

.s-reply-item__body {
  flex: 1;
  min-width: 0;
}

/* Row 1: 元信息行（昵称 + [作者] + [IP] [浏览器] [OS]） */
.s-reply-item__meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-weight: bold;

  .s-reply-item__nickname {
    font-size: 13px;
    font-weight: 500;
  }

  .s-reply-item__author-tag {
    margin-left: 2px;
  }
}

.s-reply-item__tag {
  font-size: 11px;
  color: var(--text-placeholder);
  padding: 0 4px;
  border: 1px solid var(--border-lighter);
  border-radius: 2px;
  background-color: var(--fill-color-lighter);
  white-space: nowrap;
}

/* Row 2: @mention + 正文（同行 inlinen-flex） */
.s-reply-item__content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.7;
  color: #555;

  .s-reply-item__reply-text {
    color: var(--text-regular);
    white-space: nowrap;
  }

  .s-reply-item__mention {
    color: var(--accent-primary);
    white-space: nowrap;
  }
}

/* Row 3: 操作行（时间 + 赞同 + 回复） */
.s-reply-item__footer {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  margin: 6px 0;
  flex-wrap: wrap;
}

.s-reply-item__time {
  font-size: 12px;
  color: var(--text-secondary);
}

.s-reply-item__actions {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.s-reply-item__action {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;

  &:hover {
    color: var(--accent-primary);
  }
}

.s-reply-item__action--liked {
  color: var(--status-danger);
}
</style>
