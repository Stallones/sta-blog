<script setup lang="ts">
import EmojiPicker from "./EmojiPicker.vue";
import { useReply } from "@/composables/useReply";

const props = withDefaults(
  defineProps<{
    mode?: "comment" | "message";
    articleId?: number;
  }>(),
  {
    mode: "comment",
    articleId: 0,
  }
);

const { activeTarget, replyText, submitReply } = useReply();
const myInput = ref<HTMLTextAreaElement>();

const placeholder = computed(() => {
  if (!activeTarget.value) return "写下你的回复...";
  if (activeTarget.value.isReplyToRoot) return "写下你的回复...";
  return `回复 @${activeTarget.value.nickname}：`;
});

function handleEmojiSelect(emoji: string) {
  if (!myInput.value) return;
  const start = myInput.value.selectionStart ?? 0;
  const end = myInput.value.selectionEnd ?? 0;
  replyText.value =
    replyText.value.substring(0, start) +
    emoji +
    replyText.value.substring(end);
  nextTick(() => {
    myInput.value!.focus();
    myInput.value!.selectionStart = start + emoji.length;
    myInput.value!.selectionEnd = start + emoji.length;
  });
}

async function handleSubmit() {
  await submitReply({ mode: props.mode, articleId: props.articleId });
}
</script>

<template>
  <div class="s-reply-box">
    <el-avatar shape="square" :size="35" src="" class="s-reply-box__avatar" />
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
          <template #trigger
            ><div class="emoji-trigger-btn">
              <svg-icon name="emojis" class="emoji-icon" /></div
          ></template>
        </EmojiPicker>
        <el-button type="primary" size="small" @click="handleSubmit"
          >发布</el-button
        >
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
}
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
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  background: var(--surface-bg);
  color: var(--text-primary);
  outline: none;
  &::placeholder {
    color: var(--text-placeholder);
    font-weight: normal;
  }
  &:focus {
    border-color: var(--accent-primary);
    background: var(--surface-inner-bg);
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
    background-color: var(--bg-hover);
  }
  .emoji-icon {
    font-size: 18px;
    color: var(--text-regular);
  }
}
</style>
