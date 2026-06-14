<template>
  <div class="article-footer">
        <!-- ═══ 二、版权声明（原 ArticleFooter） ═══ -->
    <div class="af-copyright">
      <div class="af-copyright__item">
        <svg-icon name="article_author" />
        <strong>本文作者：{{ websiteStore.webInfo?.webmasterName }}</strong>
      </div>
      <div class="af-copyright__item">
        <svg-icon name="author_link" />
        <strong>本文链接：</strong>
        <a class="af-link" :href="env.VITE_FRONTEND_URL + route.path">
          {{ env.VITE_FRONTEND_URL + route.path }}
        </a>
      </div>
      <div class="af-copyright__item af-copyright__license">
        <span>
          <svg-icon name="author_copyright" />
          <strong>版权声明：</strong>
        </span>
        <span class="af-copyright__license-text">
          本站所有文章除特别声明外，均采用
          <a class="af-link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank">
            CC BY-NC-SA 4.0
          </a>
          许可协议。转载请注明文章出处！
        </span>
      </div>
    </div>
    <!-- <el-divider></el-divider> -->
    <!-- ═══ 一、文章交互区（原 ArticleOthers） ═══ -->
    <div class="af-interactions">
      <!-- 标签 + 点赞收藏分享 -->
      <div class="af-interactions__row">
        <div v-if="article.tags?.length" class="af-tags">
          <template v-for="tag in article.tags" :key="tag.id">
            <span class="af-tag" @click="router.push(`/tags/${tag.id}`)">
              # {{ tag.tagName }}
            </span>
          </template>
        </div>
        <div v-if="useService.isServiceAvailable" class="af-actions">
          <span class="af-action" @click="handleLike">
            <svg-icon :name="liked ? 'like-selected' : 'like'" />
            <span>{{ article.likeCount }}</span>
          </span>
          <span class="af-action" @click="handleCollection">
            <svg-icon :name="collected ? 'collection-selected' : 'collection'" />
            <span>{{ article.favoriteCount }}</span>
          </span>
          <span class="af-action" @click="copyToClipboard">
            <svg-icon name="share" />
            <span>分享</span>
          </span>
        </div>
      </div>

      <!-- 分类标签 -->
      <div v-if="article.categoryName" class="af-tags" style="justify-content: flex-start">
        <span class="af-tag" @click="router.push(`/category/${article.categoryId}`)">
          {{ article.categoryName }}
        </span>
      </div>

      <!-- 打赏 -->
      <div class="af-tipping">
        <el-tooltip effect="light" placement="top">
          <template #content>
            <div class="af-qrcode">
              <div>支付宝<el-image :src="payQr" /></div>
            </div>
          </template>
          <span class="af-tipping__btn">
            <svg-icon name="gift" />
            <span class="max-[540px]:hidden">ヾ(≧▽≦*)o！</span>
          </span>
        </el-tooltip>
      </div>

      <!-- 上下篇文章 -->
      <div class="af-prev-next">
        <span v-if="article.preArticleId > 0">
          <el-link @click="router.push(`/article/${article.preArticleId}`)">
            上一篇：{{ article.preArticleTitle }}
          </el-link>
        </span>
        <span v-if="article.nextArticleId > 0">
          <el-link @click="router.push(`/article/${article.nextArticleId}`)">
            下一篇：{{ article.nextArticleTitle }}
          </el-link>
        </span>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useServiceStore } from "@/store/useServiceStore";
import { cancelFavorite, userFavorite, isFavorite } from "@/apis/favorite";
import { cancelLike, isLike, userLike } from "@/apis/like";
import type { ArticleVO } from "@/types";
import payQr from "@/assets/pay/a77178025b790601a8a0a8361718b148.png";

const props = defineProps<{
  article: ArticleVO;
}>();

const router = useRouter();
const route = useRoute();
const websiteStore = useWebsiteStore();
const useService = useServiceStore();
const env = import.meta.env;

// ── 点赞/收藏状态 ──
const liked = ref(false);
const collected = ref(false);

watch(
  () => props.article.id,
  async () => {
    if (!useService.isServiceAvailable) return;
    liked.value = false;
    collected.value = false;
    await Promise.all([queryIsLike(), queryIsFavorite()]);
  },
  { immediate: true }
);

async function queryIsLike() {
  const res: any = await isLike(1, props.article.id.toString());
  liked.value = res.code === 200;
}

async function queryIsFavorite() {
  const res: any = await isFavorite(1, props.article.id.toString());
  collected.value = res.data === true;
}

async function handleLike() {
  if (liked.value) {
    const res: any = await cancelLike(1, props.article.id.toString());
    if (res.code === 200) {
      props.article.likeCount -= 1;
      liked.value = false;
      ElMessage.info("我会继续努力的");
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    const res: any = await userLike(1, props.article.id.toString());
    if (res.code === 200) {
      props.article.likeCount += 1;
      liked.value = true;
      ElMessage.success("感谢你的认可");
    } else {
      ElMessage.error(res.msg);
    }
  }
}

async function handleCollection() {
  if (collected.value) {
    const res: any = await cancelFavorite(1, props.article.id.toString());
    if (res.code === 200) {
      props.article.favoriteCount -= 1;
      collected.value = false;
      ElMessage.info("取消收藏");
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    const res: any = await userFavorite(1, props.article.id.toString());
    if (res.code === 200) {
      props.article.favoriteCount += 1;
      collected.value = true;
      ElMessage.success("收藏成功");
    } else {
      ElMessage.error(res.msg);
    }
  }
}

async function copyToClipboard() {
  try {
    const content = `欢迎访问博客文章：${props.article.articleTitle}\n通往地址：${env.VITE_FRONTEND_URL}${route.path}`;
    await navigator.clipboard.writeText(content);
    ElMessage.success("已复制分享链接");
  } catch (error) {
    ElMessage.error("复制失败，请联系网站管理员");
  }
}
</script>

<style scoped lang="scss">
@use "@/styles/mixin" as *;

.article-footer {
  display: flex;
  flex-direction: column;
  gap: $margin-bottom;
  padding: 0 $padding-lg;
 
}

/* ═══════ 交互区 ═══════ */
.af-interactions {
  font-size: 15px;

  &__row {
    display: flex;
    justify-content: space-between;
  }
}

.af-tags {
  display: flex;
  flex-wrap: wrap;
}

.af-tag {
  margin: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 5px;
  background-color: var(--el-bg-color);
  cursor: pointer;
  font-size: 0.8em;

  @media screen and (max-width: 450px) {
    padding: 0.25rem;
  }

  &:hover {
    background-color: var(--el-border-color);
  }
}

.af-actions {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8em;
}

.af-action {
  @include flex;
  margin: 0 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 5px;
  background-color: var(--el-background-color);
  cursor: pointer;

  @media screen and (max-width: 450px) {
    height: 3em;
    padding: 0.1rem 0.2rem;
    margin: 0 0.1rem;
  }

  span {
    margin-left: 0.5em;
  }

  &:hover {
    background-color: var(--el-border-color);
  }
}

.af-tipping {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  font-size: 0.86em;
  font-weight: bold;
}

.af-tipping__btn {
  @include flex;
  color: white;
  background-color: #c0a46b;
  width: 20%;
  border: 1px solid var(--el-border-color);
  height: 2.5em;
  border-radius: 5px;
  cursor: pointer;

  span {
    margin-left: 0.6em;
  }

  &:hover {
    background-color: #fc7444;
  }
}

.af-qrcode {
  @include flex;
  align-items: center;
  width: 100%;
  height: 100%;

  div {
    @include flex;
    flex-direction: column-reverse;
    margin: 0 0.5rem;
  }

  .el-image {
    width: 9em;
    height: 9em;
  }
}

.af-prev-next {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;

  span {
    @include flex;
    align-items: center;
    color: var(--el-text-color-secondary);
  }

  .el-link {
    font-size: 0.6em;
  }
}

/* ═══════ 版权声明 ═══════ */
.af-copyright {
  font-size: 0.8em;
  border: 1px solid var(--el-border-color);
  padding: 0 $padding-md;
 

  &__item {
    margin: 1rem 0;
    display: flex;
    align-items: center;

    strong {
      margin: 0 0.5rem;
      font-weight: bold;
    }
  }

  &__license {
    & > span:first-child {
      display: flex;

      @media screen and (max-width: 900px) {
        width: 100%;
      }
    }

    @media screen and (max-width: 900px) {
      flex-direction: column;
    }
  }

  &__license-text {
    display: flex;

    @media screen and (max-width: 900px) {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
}

.af-link {
  color: var(--el-text-color-secondary);

  &:hover {
    color: var(--el-color-primary);
    text-decoration: underline;
  }
}
</style>
