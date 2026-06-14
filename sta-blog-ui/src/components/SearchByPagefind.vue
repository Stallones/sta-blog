<template>
  <div
    class="search-by-pagefind"
    :class="{
      focused: isExpanded,
      expanded: isExpanded,
    }"
  >
    <el-icon class="search-icon"><Search /></el-icon>
    <input
      ref="inputRef"
      v-model="query"
      type="text"
      placeholder="搜索文章..."
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <transition name="fade">
      <el-icon v-if="query" class="clear-icon" @mousedown.prevent="clearQuery">
        <CircleClose />
      </el-icon>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Search, CircleClose } from "@element-plus/icons-vue";
import { useSearchStore } from "@/store/useSearchStore";
import { searchLocalArticles } from "@/utils/file-reader";

const query = ref("");
/** 是否处于展开状态（有内容 或 聚焦中） */
const isExpanded = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const searchStore = useSearchStore();

// Pagefind 懒加载
let pagefindModule: any = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

async function ensurePagefind() {
  if (pagefindModule) return pagefindModule;
  try {
    if (import.meta.env.DEV) {
      pagefindModule = await import("@/pagefind/pagefind.js");
    } else {
      const resp = await fetch("/pagefind/pagefind.js");
      const text = await resp.text();
      const blobUrl = URL.createObjectURL(
        new Blob([text], { type: "text/javascript" })
      );
      pagefindModule = await import(/* @vite-ignore */ blobUrl);
    }
    return pagefindModule;
  } catch (e) {
    console.error("Pagefind 加载失败:", e);
    throw e;
  }
}

// 输入处理
function onInput() {
  const q = query.value.trim();
  if (!q) {
    searchStore.clearSearch();
    // 清空时不立即收回，等 blur 判断
    return;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => doSearch(q), 300);
}

async function doSearch(q: string) {
  try {
    const pf = await ensurePagefind();
    const searchResult = await pf.search(q);
    if (query.value.trim() !== q) return;
    const rawResults = searchResult.results || [];
    const ids = await Promise.all(
      rawResults.map(async (r: any) => {
        const data = await r.data();
        return Number(data.url?.split("/").pop()) || 0;
      })
    );
    const validIds = ids.filter(Boolean);
    if (validIds.length) {
      const pageResult = await searchLocalArticles(validIds);
      if (query.value.trim() === q) {
        searchStore.setSearchResults(pageResult);
      }
    }
  } catch (e) {
    console.error("搜索失败:", e);
  }
}

function onFocus() {
  isExpanded.value = true;
}

function onBlur() {
  // 延迟判断：给点击 clear 等操作留出时间
  setTimeout(() => {
    if (!query.value) {
      isExpanded.value = false;
    }
    // 有内容则保持展开
  }, 150);
}

function clearQuery() {
  query.value = "";
  searchStore.clearSearch();
  // clear 后立即收起（即使仍有焦点也收回）
  isExpanded.value = false;
  nextTick(() => {
    inputRef.value?.blur();
  });
}
</script>

<style scoped lang="scss">
.search-by-pagefind {
  display: flex;
  height: 50px;
  padding: 0 16px;
  border-radius: 50px;
  align-items: center;
  background: var(--el-fill-color-light);
  // border: 1px solid hsla(0, 0%, 100%, 0.1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: text;
  // 默认收缩态：窄宽度，靠左
  width: 50px;

  &:hover {
    // transform: scale(1);
    width: 140px;
    // box-shadow: 0 4px 20px hsla(0, 0%, 0%, 0.3);
  }

  // 展开态：撑满容器
  &.expanded {
    width: 100%;
    border: 2px solid var(--accent);

    input {
      width: auto;
      opacity: 1;
    }

    &.foucused {
      border: 2px solid var(--accent);
    }
  }

  .search-icon {
    font-size: 18px;
    margin-right: 10px;
    flex-shrink: 0;
    color: var(--el-text-color-secondary);
    transition: color 0.25s ease;
  }

  &.focused .search-icon,
  &:hover .search-icon {
    color: var(--el-text-color-primary);
  }

  input {
    flex: 1;
    height: 100%;
    min-width: 0; // 允许缩小到 0
    background: transparent;
    border: none;
    outline: none;
    color: var(--el-text-color-primary);
    font-size: 14px;
    transition: opacity 0.25s ease;

    &::placeholder {
      color: var(--el-text-color-placeholder);
    }
  }

  .clear-icon {
    color: var(--el-text-color-secondary);
    font-size: 16px;
    margin-left: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  // 展开态高亮边框
  &.expanded.focused {
    border-color: rgba(64, 158, 255, 0.6);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15),
      0 4px 20px hsla(0, 0%, 0%, 0.3);
  }
}

// clear 图标淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
