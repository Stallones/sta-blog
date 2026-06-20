<script setup lang="ts">
import EmojiPicker from "./EmojiPicker.vue";
import { heo } from "@/utils/O.o/heo.ts";
import { addComment, getComment } from "@/apis/article";
import { cancelLike, isLike, userLike } from "@/apis/like";
import { ElMessage, ElNotification } from "element-plus";
import { usePaginationStore } from "@/store/usePaginationStore";
import { CommentVO } from "@/types";
import Replies from "./Replies.vue";
import ReplyBox from "./ReplyBox.vue";
import CommentContent from "./CommentContent.vue";
import { ChatDotRound, Star } from "@element-plus/icons-vue";

const usePagination = usePaginationStore();
const commentPagination = usePagination.commentPagination;

const props = defineProps({
  serverOn: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: Number,
    default: 0,
  },
  isShowHeader: {
    type: Boolean,
    default: true,
  },
  commentType: {
    type: Number,
    default: 1,
  },
  commentPId: {
    type: Number,
    default: 0,
  },
  likeType: {
    type: Number,
  },
});

const placeholderText = ref("留下你的精彩评论吧！");
if (props.serverOn === false) {
  placeholderText.value = "服务离线，评论不可用";
}

// 主输入框状态
const textarea = ref("");
const preview = ref("");
const myInput = ref();
const isLoading = ref(false);
const isPreview = ref(false);

// 评论列表
const comments = ref<any[]>([]);
const commentsTotal = ref(0);

// 每个一级评论组的子评论分页状态（commentId => pagination）
const childPageMap = ref<
  Record<number, { current: number; expanded: boolean }>
>({});
const CHILD_PAGE_SIZE = 10;
const DEFAULT_SHOW = 1;

// 获取某个一级评论的子评论分页状态
function getChildPage(commentId: number) {
  if (!childPageMap.value[commentId]) {
    childPageMap.value[commentId] = { current: 1, expanded: false };
  }
  return childPageMap.value[commentId];
}

// 子评论展开/收起
function toggleExpand(commentId: number) {
  const page = getChildPage(commentId);
  page.expanded = !page.expanded;
  page.current = 1;
}

function getChildCurrentPage(commentId: number) {
  return getChildPage(commentId).current;
}

function setChildCurrentPage(commentId: number, page: number) {
  getChildPage(commentId).current = page;
}

function isExpanded(commentId: number) {
  return getChildPage(commentId).expanded;
}

// ── 回复目标状态（每个一级评论组独立） ──
interface ReplyTarget {
  id: number;
  nickname: string;
  parentId: number | null;
  parentUserId: number;
  replyUserId: number;
}

// 以 commentId 为 key 存储每个一级评论组的 replyTarget
const replyTargetMap = ref<Record<number, ReplyTarget | null>>({});

function getReplyTarget(commentId: number): ReplyTarget | null {
  return replyTargetMap.value[commentId] || null;
}

// 点击回复按钮 — 互斥：同时只有一个 replyBox 展开
function handleReply(
  commentId: number,
  item: {
    id: number;
    commentUserNickname: string;
    parentId: number | null;
    commentUserId: number;
    replyUserId?: number;
  },
  rootUserId: number
) {
  const current = getReplyTarget(commentId);
  // 同一条：toggle 隐藏
  if (current?.id === item.id) {
    replyTargetMap.value[commentId] = null;
    return;
  }
  // 先关闭所有其他 comment 的 replyBox（互斥）
  Object.keys(replyTargetMap.value).forEach((key) => {
    if (Number(key) !== commentId) {
      replyTargetMap.value[Number(key)] = null;
    }
  });
  // 设置新的 replyTarget，下一帧 focus + scroll
  replyTargetMap.value[commentId] = {
    id: item.id,
    nickname: item.commentUserNickname,
    parentId: item.parentId ?? item.id,
    parentUserId: rootUserId,
    replyUserId: item.commentUserId,
  };
  nextTick(() => {
    const box = document.querySelector(`.reply-box-${commentId}`);
    if (box) {
      const input = box.querySelector("textarea") as HTMLElement;
      input?.focus();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

// 扁平化子评论（递归拍平嵌套结构）
interface FlatItem {
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
  // 原始字段供提交使用
  typeId: number;
  parentId: number | null;
  childCommentCount?: number;
}

function flattenChildren(children: any[], rootUserId: number): FlatItem[] {
  const result: FlatItem[] = [];
  function walk(items: any[]) {
    for (const item of items) {
      result.push({
        id: item.id,
        commentUserAvatar: item.commentUserAvatar,
        commentUserNickname: item.commentUserNickname,
        commentUserId: item.commentUserId,
        createTime: item.createTime,
        commentContent: item.commentContent,
        likeCount: item.likeCount || 0,
        isLike: item.isLike || false,
        replyUserId: item.replyUserId ?? rootUserId,
        replyUserNickname: item.replyUserNickname,
        typeId: item.typeId ?? item.id,
        parentId: item.parentId ?? null,
        childCommentCount: item.childCommentCount,
      });
      if (item.childComment?.length) {
        walk(item.childComment);
      }
    }
  }
  walk(children);
  return result;
}

// 获取某条评论的扁平化子评论（带分页截断）
function getFlatChildren(comment: any): FlatItem[] {
  if (!comment.childComment?.length) return [];
  const flat = flattenChildren(comment.childComment, comment.commentUserId);
  const state = getChildPage(comment.id);
  if (!state.expanded) {
    return flat.slice(0, DEFAULT_SHOW);
  }
  const start = (state.current - 1) * CHILD_PAGE_SIZE;
  return flat.slice(start, start + CHILD_PAGE_SIZE);
}

function getTotalChildCount(comment: any): number {
  if (!comment.childComment?.length) return 0;
  return flattenChildren(comment.childComment, comment.commentUserId).length;
}

function getChildTotalPages(comment: any): number {
  const total = getTotalChildCount(comment);
  if (!isExpanded(comment.id)) return 1;
  return Math.ceil(total / CHILD_PAGE_SIZE);
}

// ── 表情处理（主评论框） ──
function handleEmojiSelect(emoji: string) {
  const start = myInput.value.selectionStart;
  const end = myInput.value.selectionEnd;
  textarea.value =
    textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
  nextTick(() => {
    myInput.value.focus();
    myInput.value.selectionStart = start + emoji.length;
    myInput.value.selectionEnd = start + emoji.length;
  });
}

function handleParentEmojiButtonClick(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  myInput.value.focus();
}

// ── 评论解析 ──
watch(
  () => textarea.value,
  (value) => {
    preview.value = parsingCommentsFunc(value);
  }
);

function parsingCommentsFunc(value: string): string {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = value.match(codeBlockRegex);
  let protectedValue = value;
  if (codeBlocks) {
    codeBlocks.forEach((block, index) => {
      protectedValue = protectedValue.replace(block, `{{CODE_BLOCK_${index}}}`);
    });
  }
  const matches = protectedValue.match(/\[[^\]]+\]/g);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (heo[match]) {
        protectedValue = protectedValue.replace(
          match,
          `<span><img src="${heo[match]}" width="24" height="24" alt="emoji" /></span>`
        );
      }
    }
  }
  if (codeBlocks) {
    codeBlocks.forEach((block, index) => {
      protectedValue = protectedValue.replace(`{{CODE_BLOCK_${index}}}`, block);
    });
  }
  return protectedValue;
}

function parseCommentContent(item: any) {
  item.commentContent = parsingCommentsFunc(item.commentContent);
  if (item.childComment?.length) {
    item.childComment.forEach(parseCommentContent);
  }
}

// ── API ──
onMounted(() => {
  if (!props.commentPId || props.commentPId === 0) return;
  fetchComments(
    props.commentType,
    props.commentPId,
    commentPagination.current,
    commentPagination.pageSize
  );
});

watch(
  () => props.commentPId,
  (pid) => {
    fetchComments(
      props.commentType,
      pid,
      commentPagination.current,
      commentPagination.pageSize
    );
  }
);

async function fetchComments(
  type: number,
  pid: number,
  pageNum: number,
  pageSize: number
) {
  if (!props.serverOn) return;
  const res = await getComment(type, pid, pageNum, pageSize);
  if (res.code == 200) {
    isLoading.value = true;
    comments.value = res.data.page;
    commentsTotal.value = res.data.total;
    res.data.page.forEach(parseCommentContent);
    checkLikes();
  }
}

async function checkLikes() {
  const res = await isLike(<number>props.likeType);
  if (res.code === 200) {
    recursionCheckLike(comments.value, res.data);
  }
}

function recursionCheckLike(list: any[], likes: any[]) {
  list.forEach((comment) => {
    likes.forEach((like: any) => {
      if (comment.id === like.typeId) comment.isLike = true;
    });
    if (comment.childComment?.length) {
      recursionCheckLike(comment.childComment, likes);
    }
  });
}

async function likeBtn(comment: CommentVO) {
  const res = await userLike(<number>props.likeType, comment.id);
  if (res.code === 200) {
    comment.isLike = true;
    comment.likeCount += 1;
    ElMessage.success("点赞成功");
  } else {
    ElMessage.error(res.msg);
  }
}

async function cancelLikeBtn(comment: CommentVO) {
  const res = await cancelLike(<number>props.likeType, comment.id);
  if (res.code === 200) {
    comment.isLike = false;
    comment.likeCount -= 1;
    ElMessage.info("取消点赞");
  } else {
    ElMessage.error(res.msg);
  }
}

async function addParentComment() {
  if (textarea.value === "") {
    ElMessage.error("评论内容不能为空");
    return;
  }
  const data = {
    commentType: props.commentType,
    commentPId: props.commentPId,
    commentContent: textarea.value,
  };
  const res: any = await addComment(data);
  if (res.code === 200) {
    ElMessage.success("评论成功");
    if (res.data) {
      ElNotification({
        title: "评论成功",
        duration: 4000,
        type: "warning",
        message: h("i", { style: "color: teal" }, res.data),
      });
    }
    textarea.value = "";
    fetchComments(
      props.commentType,
      props.commentPId,
      commentPagination.current,
      commentPagination.pageSize
    );
  } else if (res.code === 1002) {
    ElMessage.error(res.msg);
  }
}

// 更多评论
function moreComment() {
  commentPagination.pageSize += 3;
  fetchComments(
    props.commentType,
    props.commentPId,
    commentPagination.current,
    commentPagination.pageSize
  );
}
</script>

<template>
  <div class="s-comment">
    <!-- 头部输入区 -->
    <div v-if="isShowHeader" class="s-comment__header">
      <div class="s-comment__title">
        <svg-icon name="comment" width="1.5em" height="1.5em" />
        <span>评论({{ commentsTotal }})</span>
      </div>
      <div class="s-comment__form">
        <textarea
          :disabled="!serverOn"
          ref="myInput"
          class="s-comment__textarea"
          v-model="textarea"
          :placeholder="placeholderText"
        />
        <div v-if="serverOn" class="s-comment__form-actions">
          <EmojiPicker
            :popover-width="510"
            @select-emoji="handleEmojiSelect"
            @mousedown.stop
            @click.stop
          >
            <template #trigger>
              <div
                class="emoji-trigger-btn"
                @click.stop="handleParentEmojiButtonClick"
                @mousedown.stop
              >
                <svg-icon name="emojis" class="emoji-icon" />
              </div>
            </template>
          </EmojiPicker>
          <div class="s-comment__form-btns">
            <el-button
              type="info"
              plain
              size="small"
              @click="isPreview = !isPreview"
              >预览</el-button
            >
            <el-button
              type="success"
              plain
              size="small"
              @click="addParentComment"
              >发布</el-button
            >
          </div>
        </div>
        <div class="s-comment__preview" v-if="isPreview">
          <div v-html="preview" class="s-comment__preview-content"></div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="serverOn" class="s-comment__list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="s-comment__item"
      >
        <!-- 一级评论卡片：头像 + 主内容 横向 -->
        <div class="s-comment__card">
          <el-avatar
            shape="circle"
            :size="48"
            :src="comment.commentUserAvatar"
            class="s-comment__avatar"
          />
          <div class="s-comment__body">
            <!-- header: 昵称 + 作者tag -->
            <div class="s-comment__meta">
              <span class="s-comment__nickname">{{
                comment.commentUserNickname
              }}</span>
              <el-tag
                v-if="comment.commentUserId === authorId"
                size="small"
                class="s-comment__author-tag"
                >作者</el-tag
              >
            </div>
            <!-- 内容 -->
            <div class="s-comment__content">
              <CommentContent :content="comment.commentContent" />
            </div>
            <!-- footer: 时间 + 点赞 + 回复 -->
            <div class="s-comment__footer">
              <span class="s-comment__time">{{ comment.createTime }}</span>
              <span
                class="s-comment__action"
                @click="likeBtn(comment)"
                v-show="!comment.isLike"
              >
                <SvgIcon name="like" /> {{ comment.likeCount }}
              </span>
              <span
                class="s-comment__action s-comment__action--liked"
                @click="cancelLikeBtn(comment)"
                v-show="comment.isLike"
              >
                <SvgIcon name="like-selected" /> {{ comment.likeCount }}
              </span>
              <span
                class="s-comment__action"
                @click="handleReply(comment.id, comment, comment.commentUserId)"
              >
                回复
              </span>
            </div>
          </div>
        </div>

        <!-- 子评论列表（独立区域） -->
        <Replies
          v-if="
            comment.childComment && comment.childComment.length && isLoading
          "
          :items="getFlatChildren(comment)"
          :root-user-id="comment.commentUserId"
          :total="getTotalChildCount(comment)"
          :current-page="getChildCurrentPage(comment.id)"
          :total-pages="getChildTotalPages(comment)"
          :expanded="isExpanded(comment.id)"
          :default-show="DEFAULT_SHOW"
          :author-id="authorId"
          :like-type="likeType"
          @like="(item) => likeBtn(item)"
          @cancel-like="(item) => cancelLikeBtn(item)"
          @reply="
            (item) => handleReply(comment.id, item, comment.commentUserId)
          "
          @toggle-expand="() => toggleExpand(comment.id)"
          @page-change="(page) => setChildCurrentPage(comment.id, page)"
        />

        <!-- 底部回复框（本楼独有，点回复才展开） -->
        <Transition name="s-reply-box-expand">
          <ReplyBox
            v-if="!!getReplyTarget(comment.id)"
            :class="`reply-box-${comment.id}`"
            :target="getReplyTarget(comment.id)"
            :comment-type="commentType"
            :parent-id="comment.id"
            :root-user-id="comment.commentUserId"
            @submit="
              (content) => {
                replyTargetMap.value[comment.id] = null;
              }
            "
            @refresh="
              fetchComments(
                commentType,
                commentPId,
                commentPagination.current,
                commentPagination.pageSize
              )
            "
          />
        </Transition>
      </div>
    </div>

    <!-- 加载更多 -->
    <div
      class="s-comment__more"
      v-if="
        isLoading &&
        comments.length < commentsTotal
      "
    >
      <el-button type="info" plain size="small" @click="moreComment"
        >查看更多</el-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-comment {
  .s-comment__header {
    margin-bottom: 1rem;

    .s-comment__title {
      display: flex;
      align-items: center;
      font-size: 1.5em;
      font-weight: bold;
      margin: 2rem 0;

      span {
        margin-left: 0.5rem;
      }
    }

    .s-comment__form {
      padding: 0.5rem 1rem;
    }

    .s-comment__textarea {
      resize: none;
      padding: 0.5rem;
      width: 100%;
      height: 7em;
      border-radius: 0.5em;
      line-height: 1.5em;
      border: 1px solid var(--el-border-color);

      &:focus {
        outline: none;
        border-color: var(--el-color-primary);
      }
    }

    .s-comment__preview {
      margin-top: 1rem;
      padding: 8px 12px;
      min-height: 4em;
      border-radius: 0.5em;
      border: 1px solid var(--el-border-color);
      font-size: 14px;
      line-height: 1.6;

      img {
        max-width: 100%;
        height: auto;
        vertical-align: middle;
        border-style: none;
        padding: 0;
        margin: 0 3px;
      }
    }

    .s-comment__form-actions {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }

    .s-comment__form-btns {
      display: flex;
      gap: 0.5rem;
    }
  }

  .emoji-trigger-btn {
    margin-right: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .emoji-icon {
      font-size: 1.25em;
      color: var(--el-text-color-regular);
    }
  }

  /* 一级评论 */
  .s-comment__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .s-comment__item {
    padding-top: 1rem;
    border-top: 1px solid var(--el-border-color);
  }

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
    gap: 6px;

    .s-comment__author-tag {
      :deep(.el-tag) {
        background-color: var(--mao-accent);
        border-color: var(--mao-accent);
        color: #fff;
      }
    }
  }

  .s-comment__nickname {
    font-size: 14px;
    font-weight: bold;
    color: var(--el-text-color-placeholder);
    transition: color 0.3s;

    &:hover {
      color: #cb829d;
    }
  }

  .s-comment__content {
    display: inline;
    margin: 10px 0px;
  }

  .s-comment__footer {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    margin: 10px 0px;
  }

  .s-comment__time {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  .s-comment__actions {
    display: flex;
    align-items: center;
    gap: 16px;
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

    :deep(.svg-icon) {
      font-size: 15px;
    }
  }

  .s-comment__action--liked {
    color: var(--el-color-danger);
  }

  .s-comment__more {
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    .el-button {
      width: 100%;
    }
  }
}

// ReplyBox 展开/收起动画
.s-reply-box-expand {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  &-enter-from {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    padding-top: 0;
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    max-height: 200px;
  }

  &-leave-to {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
