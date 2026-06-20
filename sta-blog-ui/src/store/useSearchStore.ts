import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { ArticleVO, Page } from '@/types'

export const useSearchStore = defineStore('search', () => {
  // ── Dialog 可见性（全局通信）──
  const dialogVisible = ref(false)

  function openDialog() {
    dialogVisible.value = true
  }

  function closeDialog() {
    dialogVisible.value = false
  }

  // ── 搜索结果 ──
  const searchResults = ref<Page<ArticleVO> | null>(null)

  function setSearchResults(results: Page<ArticleVO>) {
    searchResults.value = results
  }

  function clearSearch() {
    searchResults.value = null
  }

  // ── 搜索历史（在线/离线共享）──
  const historyList = useLocalStorage<string[]>('searchHistoryList', [])

  const MAX_HISTORY = 20

  function addHistory(keyword: string) {
    const q = keyword.trim()
    if (!q) return
    // 去重：已存在的移到末尾
    const filtered = historyList.value.filter((h) => h !== q)
    filtered.push(q)
    // 超出上限则裁剪最早的
    if (filtered.length > MAX_HISTORY) {
      filtered.splice(0, filtered.length - MAX_HISTORY)
    }
    historyList.value = filtered
  }

  function removeHistory(keyword: string) {
    historyList.value = historyList.value.filter((h) => h !== keyword)
  }

  function clearHistory() {
    historyList.value = []
  }

  return {
    dialogVisible,
    openDialog,
    closeDialog,
    searchResults,
    setSearchResults,
    clearSearch,
    historyList,
    addHistory,
    removeHistory,
    clearHistory,
  }
})
