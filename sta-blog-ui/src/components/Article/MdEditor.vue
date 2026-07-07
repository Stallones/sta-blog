<template>
  <MdPreview
    :editorId="editorId"
    :theme="theme"
    :previewTheme="'default'"
    :modelValue="content"
    :mdHeadingId="makeHeadingId"
    :onHtmlChanged="onHtmlChanged"
    :onGetCatalog="onGetCatalogHandler"
  />
</template>

<script setup lang="ts">
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { makeHeadingId, type TocHeading } from "@/composables/useArticleView";

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
  getToc: [list: TocHeading[]];
}>();

function onHtmlChanged(htmlText: string) {
  emit("htmlChanged", htmlText);
}

function onGetCatalogHandler(list: { text: string; level: number }[]) {
  const tocItems: TocHeading[] = list.map((item, index) => ({
    text: item.text,
    level: item.level,
    index: index + 1,
  }));
  emit("getToc", tocItems);
}
</script>

<!--
  md-editor-v3 的 MdPreview 是第三方组件，其根元素 .md-editor-previewOnly
  不会携带当前组件的 scoped data-v 属性，:::deep() 无法穿透。
  所有样式覆盖必须放在全局 <style> 中。
-->
<style lang="scss">
.md-editor {
  --md-bk-color: var(--el-fill-color-blank);
  border-radius: $border-radius;

  // 隐藏 h1：标题已在 ArticleHeader 展示
  .md-editor-preview h1 {
    display: none;
  }
}

.md-editor-dark {
   --md-bk-color: var(--el-fill-color-blank);
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
