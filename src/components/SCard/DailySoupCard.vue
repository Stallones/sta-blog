<script setup lang="ts">
import { useDemotion } from "@/composables/useDemotion";

const { yiyuanOnline } = useDemotion();
const soup = ref("");

async function soupSub() {
  const url = import.meta.env.VITE_YIYAN_API;
  if (!url) return;
  try {
    const res = await fetch(url);
    const data = await res.json();
    // 兼容 hitokoto 格式 { hitokoto: "..." } 和纯文本格式
    soup.value = data?.hitokoto ?? data?.sentence ?? "";
  } catch {
    soup.value = "";
  }
}

onMounted(async () => {
  if (yiyuanOnline.value) await soupSub();
});
</script>

<template>
  <Card
    v-if="yiyuanOnline"
    variant="refresh"
    title="每日鸡汤"
    prefix-icon="edit"
    @invoke="soupSub"
  >
    <div class="soup-container">
      <i class="soup-quote-left">"</i>
      <Transition name="fade" mode="out-in">
        <p class="soup-text" :key="soup">{{ soup }}</p>
      </Transition>
      <i class="soup-quote-right">"</i>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.soup-container {
  position: relative;
  padding: 10px 25px;
  margin: 10px 0;

  .soup-text {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-primary);
    text-align: center;
    font-style: italic;
    margin: 0;
    padding: 0 10px;
    transition: all 0.3s ease;
  }

  .soup-quote-left,
  .soup-quote-right {
    position: absolute;
    font-size: 32px;
    color: var(--color-blue-100);
    font-family: "Times New Roman", serif;
    opacity: 0.6;
  }

  .soup-quote-left {
    top: -5px;
    left: 5px;
  }

  .soup-quote-right {
    bottom: -15px;
    right: 5px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
