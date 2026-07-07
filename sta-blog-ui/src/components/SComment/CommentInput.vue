<script setup lang="ts">
import EmojiPicker from "./EmojiPicker.vue";
import CommentContent from "./CommentContent.vue";
import { parseHeoEmoji } from "@/utils/emoji-parser";

const props = withDefaults(
  defineProps<{
    serverOn?: boolean;
    disabled?: boolean;
  }>(),
  {
    serverOn: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "submit", content: string): void;
}>();

const textarea = ref("");
const preview = ref("");
const isPreview = ref(false);

function parsingCommentsFunc(value: string): string {
  return parseHeoEmoji(value);
}

function handleEmojiSelect(emoji: string) {
  const input = document.querySelector(".s-comment__textarea") as HTMLTextAreaElement;
  if (!input) return;
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  textarea.value =
    textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
  nextTick(() => {
    input.focus();
    input.selectionStart = start + emoji.length;
    input.selectionEnd = start + emoji.length;
  });
}

function handleSubmit() {
  if (!textarea.value.trim()) return;
  emit("submit", textarea.value);
  textarea.value = "";
  isPreview.value = false;
}

watch(
  () => textarea.value,
  (value) => {
    preview.value = value ? parsingCommentsFunc(value) : "";
  }
);
</script>

<template>
  <div class="s-comment__form">
    <textarea
      :disabled="!serverOn || disabled"
      class="s-comment__textarea"
      v-model="textarea"
      :placeholder="serverOn ? '留下你的精彩评论吧！' : '服务离线，评论不可用'"
    />
    <div v-if="serverOn && !disabled" class="s-comment__form-actions">
      <div class="s-comment__form-left">
        <EmojiPicker
          :popover-width="510"
          @select-emoji="handleEmojiSelect"
          @mousedown.stop
          @click.stop
        >
          <template #trigger>
            <div class="emoji-trigger-btn">
              <svg-icon name="emojis" class="emoji-icon" />
            </div>
          </template>
        </EmojiPicker>
      </div>
      <div class="s-comment__form-btns">
        <el-button type="info" plain size="small" @click="isPreview = !isPreview">
          预览
        </el-button>
        <el-button type="success" plain size="small" @click="handleSubmit">
          发布
        </el-button>
      </div>
    </div>
    <!-- Markdown 预览 -->
    <div v-if="isPreview && preview" class="s-comment__preview">
      <CommentContent :content="preview" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.s-comment__form {
  padding: 0.5rem 0;
}

.s-comment__textarea {
  resize: none;
  padding: 0.8rem;
  width: 100%;
  height: 7em;
  border-radius: 0.5em;
  line-height: 1.5em;
  border: 1px solid var(--el-border-color);
  font-size: 14px;
  font-family: inherit;
  background-color: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--el-color-primary);
  }

  &:disabled {
    background-color: var(--el-fill-color-light);
    cursor: not-allowed;
  }
}

.s-comment__form-actions {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
}

.s-comment__form-left {
  display: flex;
  align-items: center;
}

.s-comment__form-btns {
  display: flex;
  gap: 0.5rem;
}

.emoji-trigger-btn {
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

.s-comment__preview {
  margin-top: 0.8rem;
  padding: 0.8rem;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 0.5em;
  background-color: var(--el-fill-color-lighter);
  min-height: 3em;
}
</style>
