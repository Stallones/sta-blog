import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { AppArticleRespVO, Page } from '@/types'
import { getArticleListByCreateTime } from '@/api/AppArticleController'

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
  const searchResults = ref<Page<AppArticleRespVO> | null>(null)

  function setSearchResults(results: Page<AppArticleRespVO>) {
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

  // ── 文章标题列表（搜索联想用）──
  const searchTitle = shallowRef<AppArticleRespVO[]>()

  const getArticleTitleList = async () => {
    const res = await getArticleListByCreateTime()
    searchTitle.value = res as AppArticleRespVO[]
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
    searchTitle,
    getArticleTitleList,
  }
})
