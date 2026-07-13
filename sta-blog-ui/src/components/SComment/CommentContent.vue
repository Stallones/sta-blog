<script setup lang="ts">
/**
 * CommentContent — 评论内容统一渲染组件
 *
 * 包裹 md-editor-v3 的 MdPreview，集中管理所有 :deep() 样式穿透。
 * 支持 heo 表情、代码块、列表等 markdown 内容。
 *
 * Props:
 *   content  - 原始文本内容（含 [表情名] 语法）
 *   fontSize - 内容字号，默认 16px
 */
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { computed } from "vue";
import { parseHeoEmoji } from "@/utils/emoji-parser";

const props = withDefaults(
  defineProps<{
    content: string;
    fontSize?: string;
  }>(),
  {
    fontSize: "16px",
  }
);

/** 渲染前解析 HEO 表情 */
const renderedContent = computed(() => parseHeoEmoji(props.content));
</script>

<template>
  <MdPreview class="comment-content" :modelValue="renderedContent" />
</template>

<style scoped lang="scss">
.comment-content {
  display: inline !important;
  width: auto !important;
  height: auto !important;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: visible !important;

  // 根元素 .md-editor 本身
  &.md-editor {
    display: inline !important;
    flex-direction: unset !important;
    height: auto !important;
    border: none !important;
    background: transparent;
  }

  // 内部内容容器
  :deep(.md-editor-content) {
    display: inline !important;
    height: auto;
  }

  // 预览包裹器
  :deep(.md-editor-preview-wrapper) {
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent;
    overflow: visible;
  }

  // 预览区
  :deep(.md-editor-preview) {
    display: inline !important;
    font-size: inherit;
    word-break: normal;
    overflow: visible;
  }

  // 根主题容器
  :deep(.default-theme) {
    display: inline !important;
  }

  // 段落
  :deep(.default-theme p) {
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: v-bind(fontSize);
    line-height: 1.6;
    color: var(--text-primary);
  }

  // 标题
  :deep(.default-theme h1),
  :deep(.default-theme h2),
  :deep(.default-theme h3),
  :deep(.default-theme h4),
  :deep(.default-theme h5),
  :deep(.default-theme h6) {
    display: inline !important;
    margin: 0 !important;
    line-height: 1.4;
  }

  // 代码块
  :deep(.default-theme pre) {
    display: inline !important;
    margin: 4px 0;
    overflow: auto;
  }

  // 列表
  :deep(.default-theme ol),
  :deep(.default-theme ul) {
    display: inline !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  :deep(.default-theme li) {
    display: inline !important;
    list-style: none;
  }

  // 图片（heo 表情）
  :deep(.default-theme img) {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    border-style: none;
    padding: 0;
    margin: 0 1px;
    pointer-events: none;
    max-width: 100%;
    height: auto;
    display: inline !important;
  }

  // span 包裹的表情
  :deep(.default-theme p span) {
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
