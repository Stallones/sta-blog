<template>
  <div class="archive-page">
    <div class="archive-header">
      <h1 class="archive-title">
        <span class="timeline-dot title-dot" />
        全部文章 - {{ total }}
      </h1>
    </div>

    <div v-if="loading" class="archive-skeleton">
      <div v-for="i in 3" :key="i" class="skeleton-year">
        <div class="skeleton-year-label" />
        <div v-for="j in 3" :key="j" class="skeleton-item">
          <div class="skeleton-thumb" />
          <div class="skeleton-body">
            <div class="skeleton-line short" />
            <div class="skeleton-line long" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="articles.length === 0" class="archive-empty">
      <el-empty description="暂无文章" />
    </div>

    <div v-else class="timeline-wrapper">
      <template v-for="[year, items] in groupedByYear" :key="year">
        <div class="year-label">
          <span class="timeline-dot year-dot" />
          {{ year }}
        </div>
        <div
          v-for="item in items"
          :key="item.id"
          class="timeline-item"
          @click="goArticle(item.id)"
        >
          <span class="timeline-dot" />
          <div class="timeline-card">
            <div class="tl-thumb">
              <img v-if="item.coverPath" :src="item.coverPath" alt="封面">
              <div v-else class="tl-thumb-empty">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="#ccc"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              </div>
            </div>
            <div class="tl-body">
              <span class="tl-date">
                <el-icon :size="13"><Calendar /></el-icon>
                {{ formatDate(item.createTime) }}
              </span>
              <h3 class="tl-title">{{ item.title }}</h3>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="total > pageSize" class="archive-pagination">
      <el-pagination
        v-model:current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getArticlePageByCreateTime } from '@/api/AppArticleController'
import { Calendar } from '@element-plus/icons-vue'

const router = useRouter()

interface ArticleItem {
  id: number
  coverPath?: string
  title: string
  createTime: string
}

const loading = ref(false)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const articles = ref<ArticleItem[]>([])

const groupedByYear = computed(() => {
  const groups: Record<string, ArticleItem[]> = {}
  for (const item of articles.value) {
    const year = formatDateYear(item.createTime)
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
})

async function fetchData() {
  loading.value = true
  const res: any = await getArticlePageByCreateTime({ pageNo: pageNo.value, pageSize })
  articles.value = (res?.list || []).map((item: any) => ({
    ...item,
    createTime: normalizeCreateTime(item.createTime),
  }))
  total.value = res?.total || 0
  loading.value = false
}

function normalizeCreateTime(value: string | number | undefined): string {
  if (!value) return ''
  if (typeof value === 'number') return new Date(value).toISOString()
  return value
}

function formatDateYear(value: string | number | undefined): string {
  const s = normalizeCreateTime(value)
  return s ? s.substring(0, 4) : '未知'
}

function formatDate(value: string | number): string {
  const s = normalizeCreateTime(value)
  return s ? s.substring(0, 10) : ''
}

function goArticle(id: number) {
  router.push(`/article/${id}`)
}

function handlePageChange(p: number) {
  pageNo.value = p
  fetchData()
  // 保持滚动位置不变
}

fetchData()
</script>

<style scoped lang="scss">
// ——— 统一轴线坐标 ———
$timeline-indent: 1.5rem;   // 时间线内容统一缩进
$axis-x: 0.55rem;          // 轴线/圆点在 wrapper 内的 x 坐标
$dot-size: 11px;
$year-dot-size: 8px;

.archive-page {
  width: 100%;
  @include glass-card;
  padding: $padding-lg $padding-lg $padding-sm;
}

// ===== 标题 =====
.archive-header {
  position: relative;
  padding-left: $timeline-indent;
  // margin-bottom: $margin-bottom;

  // 垂直轴线 — 用 translateX(-50%) 让中心对齐 $axis-x
  &::before {
    content: '';
    position: absolute;
    left: $axis-x;
    top: 5px;
    bottom: -35px;
    width: 2px;
    transform: translateX(-50%);
    background: #e0e0e0;
    border-radius: 1px;
  }
}

// ===== 时间线容器 =====
.timeline-wrapper {
  position: relative;
  padding-left: $timeline-indent;
  margin-bottom: $margin-bottom;

  // 垂直轴线 — 用 translateX(-50%) 让中心对齐 $axis-x
  &::before {
    content: '';
    position: absolute;
    left: $axis-x;
    top: 0;
    bottom: 10px;
    width: 2px;
    transform: translateX(-50%);
    background: #e0e0e0;
    border-radius: 1px;
  }
}

.archive-title {
  position: relative;
  padding-left: 1.0 rem;
  font-size: 22px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  padding-left: 10px;  // 圆点位置 + 文字间距
  margin-bottom: $margin-bottom;

  .title-dot {
    position: absolute;
    left: -$timeline-indent + $axis-x;;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 5px solid var(--mao-blue);
    background: var(--el-fill-color-blank);
    box-sizing: border-box;
    z-index: 1;
    
  }
}

// ===== 分页 =====
.archive-pagination {
  display: flex;
  justify-content: center;
  margin-bottom: $margin-bottom ;
}


// ===== 年份标签 =====
.year-label {
  position: relative;
  padding: $padding-sm;
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);

  display: flex;
  align-items: center;

  .year-dot {
    position: absolute;
    left: -$timeline-indent + $axis-x;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $dot-size;
    height: $dot-size;
    border-radius: 50%;
    border: 2px solid var(--mao-orange);
    background: var(--mao-orange);
    box-sizing: border-box;
    z-index: 1;
  }
}

// ===== 文章项（简化为纯列表，无卡片效果）=====
.timeline-item {
  position: relative;
  padding: 10px $padding-sm ;


  .timeline-dot {
    position: absolute;
    left: -$timeline-indent + $axis-x;  // 补偿元素 padding-left 造成的右偏
    top: 50%;
    transform: translate(-50%, -50%);
    width: $dot-size;
    height: $dot-size;
    border-radius: 50%;
    border: 2px solid var(--mao-blue);
    background: var(--el-fill-color-blank);
    box-sizing: border-box;
    z-index: 1;
    transition: all 0.3s ease;
  }

  &:hover .timeline-dot {
    border-color: var(--mao-orange);
  }
}

// ===== 文章内容（纯列表布局，无卡片背景）=====
.timeline-card {
  display: flex;
  gap: 12px;
  width: 100%;
  cursor: pointer;

  .tl-thumb {
    flex-shrink: 0;
    width: 140px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &:hover .tl-thumb img {
    transform: scale(1.03);
  }

  .tl-thumb-empty {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tl-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .tl-date {
    font-size: 15px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tl-title {
    font-size: 15px;
    color: var(--el-text-color-secondary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
  }

  &:hover .tl-title {
    color: #409EFF;
  }
}


// ===== 骨架屏 =====
.archive-skeleton {
  .skeleton-year { margin-bottom: 1rem; }
  .skeleton-year-label {
    width: 60px;
    height: 1.4rem;
    background: #eee;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  .skeleton-item {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #fafafa;
    border-radius: 10px;
  }
  .skeleton-thumb {
    width: 100px;
    height: 66px;
    background: #eee;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .skeleton-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    justify-content: center;
  }
  .skeleton-line {
    height: 0.85rem;
    background: #eee;
    border-radius: 4px;
    &.short { width: 40%; }
    &.long { width: 75%; }
  }
}

// ===== 移动端 =====
@media screen and (max-width: 768px) {
  $timeline-indent: 1.2rem;
  $axis-x: 0.35rem;
  $dot-size: 9px;
  $year-dot-size: 7px;

  .archive-title {
    padding-left: $timeline-indent + $axis-x + 0.5rem;
    font-size: 1.4rem;

    &::before {
      left: $timeline-indent + $axis-x;
      width: $dot-size;
      height: $dot-size;
    }
  }

  .timeline-wrapper {
    padding-left: $timeline-indent;

    &::before { left: $axis-x; }
  }

  .year-label {
    padding-left: $timeline-indent;
    font-size: 1.2rem;

    &::before {
      left: -$timeline-indent + $axis-x;
      width: $year-dot-size;
      height: $year-dot-size;
    }
  }

  .timeline-item {
    padding-left: $timeline-indent;

    .timeline-dot {
      left: -$timeline-indent + $axis-x;
      width: $dot-size;
      height: $dot-size;
    }
  }

  .timeline-card {
    .tl-thumb { width: 70px; height: 48px; }
    .tl-title { font-size: 0.9rem; }
  }
}
</style>
