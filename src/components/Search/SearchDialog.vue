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
import { getArticleListByTitleAndContent } from "@/api/AppArticleController";
import { searchLocalArticles } from "@/utils/file-reader";
import type { AppArticleRespVO } from "@/types";
import router from "@/router";

const searchStore = useSearchStore();
const isOnline = useDemotion().isOnline;

// ── 搜索状态 ──
const query = ref("");
const loading = ref(false);
const resultList = ref<AppArticleRespVO[]>([]);
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
    if (isOnline.value) {
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
  try {
    const res = await getArticleListByTitleAndContent({ keyword: q });
    resultList.value = (res || []).map((item: AppArticleRespVO) => ({
      ...item,
      summary: highlightKeyword(item.summary || "", q),
      title: highlightKeyword(item.title || "", q),
    }));
  } catch {
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
    resultList.value = pageResult.list || [];
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
function clickResult(articleId: number | undefined) {
  if (!articleId) return;
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
      <div class="search-dialog"v-slide-in>
        <!-- 搜索条 -->
        <div class="search-bar" >
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
                <div class="search-result-item__title" v-html="item.title" />
                <div class="search-result-item__meta">
                  <el-tag size="small">{{ item.categoryName }}</el-tag>
                  <span
                    v-if="item.summary"
                    class="search-result-item__content"
                    v-html="item.summary"
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

        <!-- 底部快捷键 -->
        <div class="search-footer">
          <span><kbd>↵</kbd> 搜索</span>
          <span><kbd>Esc</kbd> 关闭</span>
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
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12vh;

  /* ── 统一搜索容器（始终实体黑白底，不随玻璃切换） ── */
  .search-dialog {
    width: min(640px, 92vw);
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.06) inset;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* ── 搜索条 ── */
    .search-bar {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 20px;
      gap: 12px;
      border-bottom: 1px solid var(--border-lighter);

      &__icon {
        font-size: 22px;
        color: var(--accent-primary);
        flex-shrink: 0;
        opacity: 0.8;
      }

      &__input {
        flex: 1;
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
        color: var(--text-primary);
        font-size: 16px;
        letter-spacing: 0.3px;

        &::placeholder {
          color: var(--text-placeholder);
        }
      }

      &__clear {
        font-size: 18px;
        color: var(--text-placeholder);
        cursor: pointer;
        flex-shrink: 0;
        transition: color 0.2s, transform 0.2s;

        &:hover {
          color: var(--text-secondary);
          transform: scale(1.1);
        }
      }

      &__close {
        font-size: 14px;
        color: var(--text-placeholder);
        cursor: pointer;
        flex-shrink: 0;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid var(--border-lighter);
        transition: all 0.2s;

        &:hover {
          color: var(--text-primary);
          border-color: var(--border-color);
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
          padding: 14px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;

          &:hover {
            background-color: var(--bg-hover);
            border-left-color: var(--accent-primary);
          }

          &__main {
            flex: 1;
            min-width: 0;
          }

          &__title {
            font-size: 0.92rem;
            font-weight: 500;
            color: var(--text-primary);
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &__meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 6px;
          }

          &__content {
            font-size: 0.78rem;
            color: var(--text-secondary);
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
            color: var(--text-secondary);
            flex-shrink: 0;
            margin-left: 12px;
          }
        }
      }

      /* 搜索历史 */
      .search-history {
        padding: 18px 20px;

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        &__clear {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.2s;

          &:hover {
            color: var(--status-danger);
            background-color: var(--bg-hover);
          }
        }

        &__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
      }

      /* 空状态 / 加载中 */
      .search-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 48px 20px;
        font-size: 0.85rem;
        color: var(--text-placeholder);

        .is-loading {
          font-size: 24px;
          animation: spin 1s linear infinite;
        }
      }
    }

    /* ── 底部快捷键提示 ── */
    .search-footer {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 10px 20px;
      border-top: 1px solid var(--border-lighter);
      font-size: 0.72rem;
      color: var(--text-placeholder);

      kbd {
        display: inline-block;
        padding: 2px 6px;
        font-size: 0.7rem;
        font-family: inherit;
        border: 1px solid var(--border-lighter);
        border-radius: 4px;
        background-color: var(--bg-hover);
        margin-right: 4px;
      }
    }
  }
}

/* ── 高亮 ── */
:deep(.search-hl) {
  background-color: var(--color-warning-light);
  border-radius: 3px;
  padding: 1px 3px;
}

/* ── 过渡动画 ── */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.25s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── 移动端适配 ── */
@media screen and (max-width: 650px) {
  .search-overlay {
    padding-top: 8vh;

    .search-dialog {
      width: 94vw;
      max-height: 75vh;
      border-radius: 12px;
    }

    .search-bar {
      height: 50px;
      padding: 0 16px;
    }

    .search-body {
      max-height: 60vh;
    }

    .search-footer {
      display: none;
    }
  }
}
</style>
