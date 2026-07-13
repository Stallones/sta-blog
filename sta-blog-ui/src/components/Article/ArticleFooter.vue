<script setup lang="ts">
import { BlogType } from "@/const";
import { toggleLike, isLike } from "@/api/AppLikeController";
import { toggleFavorite, isFavorite } from "@/api/AppFavoriteController";
import { GET_TOKEN } from "@/utils/auth";

const props = defineProps<{ article: any }>();

const liked = ref(false);
const favorited = ref(false);
const likeCount = ref(0);
const favoriteCount = ref(0);

onMounted(async () => {
  likeCount.value = props.article.likeCount || 0;
  favoriteCount.value = props.article.favoriteCount || 0;

  if (GET_TOKEN()) {
    const likeRes: any = await isLike({ type: BlogType.ARTICLE, typeId: props.article.id });
    liked.value = !!likeRes;
    const favRes: any = await isFavorite({ type: BlogType.ARTICLE, typeId: props.article.id });
    favorited.value = !!favRes;
  }
});

async function handleLike() {
  if (!GET_TOKEN()) {
    ElMessage.warning('请先登录');
    return;
  }
  const res: any = await toggleLike({ type: BlogType.ARTICLE, typeId: props.article.id });
  if (res !== undefined) {
    liked.value = res;
    likeCount.value += res ? 1 : -1;
  }
}

async function handleFavorite() {
  if (!GET_TOKEN()) {
    ElMessage.warning('请先登录');
    return;
  }
  const res: any = await toggleFavorite({ type: BlogType.ARTICLE, typeId: props.article.id });
  if (res !== undefined) {
    favorited.value = res;
    favoriteCount.value += res ? 1 : -1;
  }
}
</script>

<template>
  <div class="article-footer">
    <span class="action-btn" :class="{ active: liked }" @click="handleLike">
      👍 {{ likeCount }}
    </span>
    <span class="action-btn" :class="{ active: favorited }" @click="handleFavorite">
      ⭐ {{ favoriteCount }}
    </span>
  </div>
</template>

<style scoped>
.article-footer { display: flex; gap: 20px; padding: 16px 0; }
.action-btn { cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
.action-btn:hover { background: var(--color-blue-50); }
.action-btn.active { color: var(--accent-primary); font-weight: bold; }
</style>
