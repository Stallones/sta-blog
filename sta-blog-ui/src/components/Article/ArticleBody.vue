<template>
  <MdPreview
    :editorId="editorId"
    :theme="theme"
    :previewTheme="'default'"
    :modelValue="content"
    :onHtmlChanged="onHtmlChanged"
  />
</template>

<script setup lang="ts">
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

const props = withDefaults(
  defineProps<{
    content: string;
    editorId?: string;
    theme?: "light" | "dark";
  }>(),
  {
    editorId: "preview-only",
    theme: "light",
  }
);

const emit = defineEmits<{
  htmlChanged: [htmlText: string];
}>();

function onHtmlChanged(htmlText: string) {
  emit("htmlChanged", htmlText);
}
</script>

<!--
  md-editor-v3 的 MdPreview 是第三方组件，其根元素 .md-editor-previewOnly
  不会携带当前组件的 scoped data-v 属性，:::deep() 无法穿透。
  所有样式覆盖必须放在全局 <style> 中。
-->
<style lang="scss">
.md-editor {
  --md-bk-color: var(--mao-card-bg);
  // margin-bottom: $margin-bottom;
  border-radius: $border-radius;
  // box-shadow: var(--mao-box-shadow);
  // padding: 0 $padding-md ;
}

.md-editor-dark {
  .md-editor-preview {
    blockquote {
      background-color: var(--mao-md-preview-quote-bg);
    }
    .md-editor-code {
      .md-editor-code-head,
      code {
        background-color: var(--mao-md-preview-code-bg);
      }
    }
  }
}
</style>
