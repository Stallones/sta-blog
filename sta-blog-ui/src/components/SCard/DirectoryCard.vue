<script setup lang="ts">
import Card from "@/components/SCard/Card.vue";
import { MdCatalog } from "md-editor-v3";

const scrollElement = document.documentElement;
const id = "preview-only";
</script>

<template>
  <Card name="directory" variant="default" title="目录" prefix-icon="directory">
    <div class="catalog-content">
      <MdCatalog
        :editorId="id"
        :scrollElement="scrollElement"
        :scrollElementOffsetTop="300"
        :offsetTop="300"
      />
    </div>
  </Card>
</template>

<!--
  md-editor-v3 的 MdCatalog 是第三方组件，其根元素
  不会携带当前组件的 scoped data-v 属性，:::deep() 无法穿透。
  所有样式覆盖必须放在全局 <style> 中，用父级 class 限定作用域。
-->
<style scoped lang="scss">
.catalog-content {
  min-height: 100px;
  // max-height: 800px;
  overflow-y: auto;
}
</style>

<style lang="scss">
.md-editor-catalog {
  text-align: left;

  // 每个目录项容器（div.md-editor-catalog-link）
  // 注意：这个 div 包含 span(当前行文字) + div.wrapper(子级目录)
  // 所以 padding/background 不能加在这个 div 上，否则会连带子级一起高亮
  .md-editor-catalog-link {
    cursor: pointer;
    padding: 5px;
    line-height: 0.1;
    
    // 文字行样式 — 所有视觉样式都在 span 上
    span {
      // display: block;
      // // padding: 0;
      // // margin: 2px 0;
      border-radius: 5px;
      // color: var(--el-text-color-regular);
      font-size: 1em;
      line-height: 1;
      padding: 8px 0px;
      // transition: all 0.2s ease;
      
      // hover：强调色文字（只影响当前行 span）
      &:hover {
        color: var(--accent);
      }
    }
    
    // 左侧竖线
    .md-editor-catalog-wrapper {
      border-left: 1px solid var(--el-border-color);
      // margin-left: 8px;

      .md-editor-catalog-link span{
        padding: 8px 5px;
      }
    }

    // 激活项：强调色满宽背景 + 白字 + 粗体（只影响当前行 span）
    &.md-editor-catalog-active > span {
      background: var(--accent);
      color: #fff;
      // font-weight: bold;
    }
  }
}
</style>
