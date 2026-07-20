<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { computed } from "vue";

const useWebsite = useWebsiteStore();

const differenceInDays = computed(() => {
  const start = useWebsite.webInfo?.startTime;
  if (!start) return 0;
  const ms = Date.now() - new Date(start).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
});

const lastUpdateTimeText = computed(() => {
  const t = useWebsite.webInfo?.lastUpdateTime;
  if (!t) return "—";
  const ms = Date.now() - new Date(t).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days === 0) return "今天";
  if (days === 1) return "1 天";
  return `${days} 天`;
});
</script>

<template>
  <Card
    name="website"
    variant="default"
    title="网站资讯"
    prefix-icon="statistics"
  >
    <div class="statistics">
      <div>
        文章数目：<span>{{ useWebsite.webInfo?.articleCount ?? 0 }}</span>
      </div>
      <div>
        运行时长：<span>{{ differenceInDays }} 天</span>
      </div>
      <div>
        访问总量：<span>{{ useWebsite.webInfo?.visitCount ?? 0 }}</span>
      </div>
      <div>
        最后更新：<span>{{ lastUpdateTimeText }}</span>
      </div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.statistics {
    display: flex;
    flex-direction: column;
    color: var(--accent-primary);

    div {
      margin: 5px 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
