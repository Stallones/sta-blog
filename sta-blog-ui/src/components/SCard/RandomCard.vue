<script setup lang="ts">
import { getArticleListByVisitCount, getArticleListByCategoryId } from "@/api/AppArticleController";
import { readArticleListByVisitCount, readArticleListByCategoryId } from "@/utils/file-reader";
import { useDemotion } from "@/composables/useDemotion";
import { dayjs } from "element-plus";
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "随机文章",
  },
  prefixIcon: {
    type: String,
    default: "random_essay",
  },
  // 分类id
  categoryId: {
    type: [String, Number],
    default: "",
  },
  // 文章id
  articleId: {
    type: [String, Number],
    default: "",
  },
});

const randomArticles = ref<any[]>([]);
const { requestOrRead } = useDemotion();

function randomArticleBtn() {
  imgRefresh.value = true;
  getRandomArticleData();
}

async function getRandomArticleData() {
  const res: any = await requestOrRead(
    getArticleListByVisitCount,
    readArticleListByVisitCount,
    { limit: 5 }
  );
  const list = Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [];
  formatDate(list);
  randomArticles.value = list;
}

// 监听参数变化
watch(
  () => props.articleId,
  () => {
    if (props.categoryId && props.articleId) {
      relatedRecommendBtn(Number(props.categoryId), Number(props.articleId));
    }
  }
);

// 相关推荐
async function relatedRecommendBtn(categoryId: number, articleId: number) {
  const res: any = await requestOrRead(
    getArticleListByCategoryId,
    readArticleListByCategoryId,
    { categoryId, articleId }
  );
  const list = Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [];
  formatDate(list);
  randomArticles.value = list;
}

// 格式化日期，去掉时分秒
function formatDate(date: any[]) {
  date.forEach((item: any) => {
    if (item.createTime) {
      item.createTime = dayjs(item.createTime).format("YYYY-MM-DD");
    }
  });
  return date;
}

const imgRefresh = ref(false);

function loadContent() {
  if (props.title === "随机文章") {
    getRandomArticleData();
  }
  if (props.title === "相关推荐") {
    relatedRecommendBtn(Number(props.categoryId), Number(props.articleId));
  }
}

onMounted(() => {
  loadContent();
});
</script>

<template>
  <!-- 随机文章 -->
  <Card
    variant="refresh"
    :title="title"
    :prefix-icon="prefixIcon"
    :suffix-icon="title === '相关推荐' ? '' : 'rotate'"
    @invoke="randomArticleBtn"
    v-view-request="{ callback: loadContent }"
  >
    <div class="random_container" v-for="randomArticle in randomArticles" :key="randomArticle.id">
      <div
        class="random_image"
        @click="$router.push('/article/' + randomArticle.id)"
      >
        <img
          v-if="randomArticle.coverPath"
          :src="imgRefresh ? randomArticle.coverPath : ''"
          :data-src="randomArticle.coverPath"
          v-lazy="true"
          alt="文章封面"
        />
      </div>
      <div class="random_text" :key="randomArticle.id">
        <div>{{ randomArticle.title }}</div>
        <div>{{ randomArticle.createTime }}</div>
      </div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.random_container {
  display: flex;
  align-items: center;
  margin: 10px 0;

  .random_image {
    width: 45%;
    height: 70px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 0.5rem;

    img {
      width: 100%;
      height: 100%;
      transition: transform 0.3s linear;
      object-fit: cover;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .random_text {
    width: 55%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    line-height: 30px;

    :first-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      margin-left: 1rem;
      font-size: 1em;
      color: var(--text-regular);
    }

    :last-child {
      margin-left: 1rem;
      font-size: 0.8em;
    }
  }
}
</style>
