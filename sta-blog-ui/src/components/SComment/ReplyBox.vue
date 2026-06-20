<script setup lang="ts">
import { ElMessage, ElNotification } from "element-plus";
import { addComment } from "@/apis/article";
import EmojiPicker from "./EmojiPicker.vue";

export interface ReplyTarget {
  id: number;
  nickname: string;
  parentId: number | null;
  parentUserId: number;
  replyUserId: number;
}

const props = defineProps({
  target: {
    type: Object as () => ReplyTarget | null,
    default: null,
  },
  commentType: {
    type: Number,
    required: true,
  },
  parentId: {
    type: Number,
    required: true,
  },
  rootUserId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "submit", content: string): void;
  (e: "refresh"): void;
}>();

const route = useRoute();

// 输入状态
const replyText = ref("");
const myInput = ref();

// 动态 placeholder
const placeholder = computed(() => {
  if (!props.target) return "写下你的回复...";
  return `回复 @${props.target.nickname}：`;
});

onMounted(() => {
  // placeholder
});

// 表情
function handleEmojiSelect(emoji: string) {
  if (!myInput.value) return;
  const start = myInput.value.selectionStart ?? 0;
  const end = myInput.value.selectionEnd ?? 0;
  replyText.value =
    replyText.value.substring(0, start) +
    emoji +
    replyText.value.substring(end);
  nextTick(() => {
    myInput.value.focus();
    myInput.value.selectionStart = start + emoji.length;
    myInput.value.selectionEnd = start + emoji.length;
  });
}

function handleEmojiButtonClick(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  myInput.value?.focus();
}

// 发布
async function handleSubmit() {
  if (!replyText.value.trim()) {
    ElMessage.warning("评论内容不能为空");
    return;
  }
  const data = {
    type: props.commentType,
    typeId: props.target?.id ?? props.parentId,
    commentContent: replyText.value,
    parentId: props.target?.parentId ?? props.parentId,
    replyId: props.target?.id ?? props.parentId,
    replyUserId: props.target?.replyUserId ?? props.rootUserId,
  };
  const res: any = await addComment(data);
  if (res.code === 200) {
    ElMessage.success("回复成功");
    if (res.data) {
      ElNotification({
        title: "回复成功",
        duration: 4000,
        type: "warning",
        message: h("i", { style: "color: teal" }, res.data),
      });
    }
    replyText.value = "";
    emit("submit", replyText.value);
    emit("refresh");
  } else if (res.code === 1002) {
    ElMessage.error(res.msg);
  }
}
</script>

<template>
  <div class="s-reply-box">
    <el-avatar shape="square" :size="32" src="" class="s-reply-box__avatar">
      <img src="" alt="" />
    </el-avatar>
    <div class="sreply-box__input-wrap">
      <textarea
        ref="myInput"
        v-model="replyText"
        :placeholder="placeholder"
        class="s-reply-box__input"
        rows="2"
      />
      <div class="s-reply-box__actions">
        <EmojiPicker
          :popover-width="510"
          @select-emoji="handleEmojiSelect"
          @mousedown.stop.prevent
          @click.stop.prevent
        >
          <template #trigger>
            <div class="emoji-trigger-btn" @click.stop="handleEmojiButtonClick" @mousedown.stop.prevent>
              <svg-icon name="emojis" class="emoji-icon" />
            </div>
          </template>
        </EmojiPicker>
        <el-button type="primary" size="small" @click="handleSubmit">发布</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-reply-box {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;

  .s-reply-box__avatar {
    flex-shrink: 0;
    border-radius: 6px;
    margin-top: 4px;
  }

  .sreply-box__input-wrap {
    flex: 1;
    min-width: 0;
  }

  .s-reply-box__input {
    width: 100%;
    padding: 8px 10px;
    resize: none;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    outline: none;

    &::placeholder {
      color: var(--el-text-color-placeholder);
      font-weight: normal;
    }

    &:focus {
      border-color: var(--el-color-primary);
      background: #fff;
    }
  }

  .s-reply-box__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .emoji-trigger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .emoji-icon {
      font-size: 18px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
