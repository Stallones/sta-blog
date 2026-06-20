<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import {
  Search,
  CircleClose,
  Delete,
  View,
  Loading,
} from "@element-plus/icons-vue";
import { useSearchStore } from "@/store/useSearchStore";
import { useDemotion } from "@/composables/useDemotion";
import { searchArticleContent } from "@/apis/article";
import { searchLocalArticles } from "@/utils/file-reader";
import type { ArticleVO } from "@/types";
import router from "@/router";

const searchStore = useSearchStore();
const isOnline = useDemotion().isOnline;

// ── 搜索状态 ──
const query = ref("");
const loading = ref(false);
const resultList = ref<ArticleVO[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);

// ── 防抖 ──
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let hasSearched = false;

function resetSearch() {
  query.value = "";
  resultList.value = [];
  loading.value = false;
  hasSearched = false;
}

// Dialog 打开时聚焦输入框
watch(
  () => searchStore.dialogVisible,
  (val) => {
    if (val) {
      nextTick(() => inputRef.value?.focus());
    } else {
      resetSearch();
    }
  }
);

function closeDialog() {
  searchStore.closeDialog();
}

// ── 输入处理：1s 防抖 ──
function onInput() {
  hasSearched = false;
  const q = query.value.trim();
  if (!q) {
    resultList.value = [];
    return;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    hasSearched = true;
    doSearch(q);
  }, 1000);
}

// ── 回车：立即搜索（防重复）──
function onEnter() {
  const q = query.value.trim();
  if (!q) return;
  if (hasSearched) return;
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  hasSearched = true;
  doSearch(q);
}

// ── 统一搜索入口 ──
async function doSearch(q: string) {
  loading.value = true;
  try {
    if (isOnline) {
      await doOnlineSearch(q);
    } else {
      await doOfflineSearch(q);
    }
    searchStore.addHistory(q);
  } catch (e) {
    console.error("搜索失败:", e);
  } finally {
    loading.value = false;
  }
}

// ── 在线搜索：后端 API ──
async function doOnlineSearch(q: string) {
  const res: any = await searchArticleContent(q);
  if (res.code === 200 && res.data) {
    resultList.value = res.data.map((item: ArticleVO) => ({
      ...item,
      articleContent: highlightKeyword(item.articleContent || "", q),
      articleTitle: highlightKeyword(item.articleTitle || "", q),
    }));
  } else {
    resultList.value = [];
  }
}

// ── 离线搜索：Pagefind ──
async function doOfflineSearch(q: string) {
  const pf = await ensurePagefind();
  const searchResult = await pf.search(q);
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
    resultList.value = pageResult.page || [];
  } else {
    resultList.value = [];
  }
}

// ── Pagefind 懒加载 ──
let pagefindModule: any = null;

async function ensurePagefind() {
  if (pagefindModule) return pagefindModule;
  try {
    if (import.meta.env.DEV) {
      // @ts-ignore — pagefind 无类型声明
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

// ── 关键词高亮 ──
function highlightKeyword(text: string, keyword: string): string {
  if (!text || !keyword) return text;
  const regex = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, '<mark class="search-hl">$1</mark>');
}

// ── 点击结果 ──
function clickResult(articleId: number) {
  closeDialog();
  router.push("/article/" + articleId);
}

// ── 点击历史 ──
function clickHistory(keyword: string) {
  query.value = keyword;
  hasSearched = false;
  doSearch(keyword);
  nextTick(() => inputRef.value?.focus());
}

// ── 清空输入 ──
function clearQuery() {
  query.value = "";
  resultList.value = [];
  hasSearched = false;
  nextTick(() => inputRef.value?.focus());
}

// ── ESC 关闭 / 点击遮罩关闭 ──
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeDialog();
}

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("search-overlay")) {
    closeDialog();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<template>
  <Transition name="search-fade">
    <div
      v-if="searchStore.dialogVisible"
      class="search-overlay"
      @click="onOverlayClick"
    >
      <div class="search-dialog">
        <!-- 搜索条 -->
        <div class="search-bar">
          <el-icon class="search-bar__icon"><Search /></el-icon>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="搜索文章..."
            class="search-bar__input"
            @input="onInput"
            @keyup.enter="onEnter"
          />
          <el-icon v-if="query" class="search-bar__clear" @click="clearQuery">
            <CircleClose />
          </el-icon>

        </div>

        <!-- 结果区域 -->
        <div class="search-body">
          <!-- 搜索历史（无输入时展示）-->
          <div v-if="!query && !loading && !hasSearched && searchStore.historyList.length" class="search-history">
            <div class="search-history__header">
              <span>搜索历史</span>
              <span class="search-history__clear" @click="searchStore.clearHistory()">
                <el-icon><Delete /></el-icon>
                清除记录
              </span>
            </div>
            <div class="search-history__tags">
              <el-check-tag
                v-for="item in searchStore.historyList"
                :key="item"
                checked
                style="margin: 4px"
                @click="clickHistory(item)"
              >
                {{ item }}
              </el-check-tag>
            </div>
          </div>

          <!-- 搜索结果 -->
          <div v-else-if="resultList.length" class="search-results">
            <div
              v-for="item in resultList"
              :key="item.id"
              class="search-result-item"
              @click="clickResult(item.id)"
            >
              <div class="search-result-item__main">
                <div class="search-result-item__title" v-html="item.articleTitle" />
                <div class="search-result-item__meta">
                  <el-tag size="small">{{ item.categoryName }}</el-tag>
                  <span
                    v-if="item.articleContent"
                    class="search-result-item__content"
                    v-html="item.articleContent"
                  />
                </div>
              </div>
              <div class="search-result-item__visits">
                <el-icon><View /></el-icon>
                <span>{{ item.visitCount }}</span>
              </div>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-else-if="loading" class="search-empty">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>搜索中...</span>
          </div>

          <!-- 无结果 -->
          <div v-else-if="query && !loading && hasSearched" class="search-empty">
            <span>未找到相关文章</span>
          </div>

          <!-- 空状态 -->
          <div v-else-if="query" class="search-empty">
            <span>输入关键词开始搜索</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
/* ── 全屏遮罩 ── */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15vh;

  /* ── 统一搜索容器 ── */
  .search-dialog {
    width: min(680px, 90vw);
    background-color: var(--el-bg-color);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* ── 搜索条 ── */
    .search-bar {
      display: flex;
      align-items: center;
      height: 52px;
      padding: 0 18px;
      gap: 10px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &__icon {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        flex-shrink: 0;
      }

      &__input {
        flex: 1;
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
        color: var(--el-text-color-primary);
        font-size: 16px;

        &::placeholder {
          color: var(--el-text-color-placeholder);
        }
      }

      &__clear {
        font-size: 17px;
        color: var(--el-text-color-secondary);
        cursor: pointer;
        flex-shrink: 0;
        transition: color 0.2s;

        &:hover {
          color: var(--el-text-color-primary);
        }
      }

      &__close {
        font-size: 16px;
        color: var(--el-text-color-placeholder);
        cursor: pointer;
        flex-shrink: 0;
        margin-left: 4px;
        transition: color 0.2s;

        &:hover {
          color: var(--el-text-color-primary);
        }
      }
    }

    /* ── 结果/历史面板 ── */
    .search-body {
      max-height: 50vh;
      overflow-y: auto;
      overflow-x: hidden;

      /* 搜索结果列表 */
      .search-results {
        .search-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--el-fill-color-light);
          }

          &__main {
            flex: 1;
            min-width: 0;
          }

          &__title {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--el-text-color-primary);
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &__meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
          }

          &__content {
            font-size: 0.78rem;
            color: var(--el-text-color-secondary);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
            min-width: 0;
          }

          &__visits {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: var(--el-text-color-secondary);
            flex-shrink: 0;
            margin-left: 12px;
          }
        }
      }

      /* 搜索历史 */
      .search-history {
        padding: 16px 20px;

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        &__clear {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 400;
          color: var(--el-text-color-secondary);
          cursor: pointer;

          &:hover {
            color: var(--el-color-danger);
          }
        }

        &__tags {
          display: flex;
          flex-wrap: wrap;
        }
      }

      /* 空状态 / 加载中 */
      .search-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 48px 20px;
        font-size: 0.85rem;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}

/* ── 高亮 ── */
:deep(.search-hl) {
  background-color: var(--el-color-warning-light-7);
  border-radius: 2px;
  padding: 0 2px;
}

/* ── 过渡动画 ── */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

/* ── 移动端适配 ── */
@media screen and (max-width: 650px) {
  .search-overlay {
    padding-top: 10vh;

    .search-dialog {
      width: 94vw;
      max-height: 70vh;
    }

    .search-bar {
      height: 48px;
    }

    .search-body {
      max-height: 60vh;
    }
  }
}
</style>
