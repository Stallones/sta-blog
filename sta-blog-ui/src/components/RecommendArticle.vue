<script setup lang="ts">
import { getArticleListByVisitCount } from "@/api/AppArticleController";
import { useDemotion } from "@/composables/useDemotion";
import { dayjs } from "element-plus";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { isOnline } = useDemotion();

const recommendArticles = ref<any[]>([]);

const modules = ref([Navigation, Pagination, Autoplay]);

async function loadContent() {
  const res: any = await getArticleListByVisitCount({});
  recommendArticles.value = Array.isArray(res) ? res : [];
}
</script>

<template>
  <div v-if="isOnline" class="recommend-article-container">
    <div v-view-request="{ callback: loadContent }">
      <swiper
        class="recommend recommend--h200"
        loop
        navigation
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 2500 }"
        :modules="modules"
        v-if="recommendArticles.length > 0"
      >
        <swiper-slide
          v-for="article in recommendArticles"
          :key="article.id"
          @click="$router.push(`/article/${article.id}`)"
        >
          <div class="item_text">
            <div>
              {{ article.title }}
            </div>
            <div >
              {{ dayjs(article.createTime).format("YYYY-MM-DD") }}
            </div>
            <div >
              {{ article.summary }}
            </div>
          </div>
          <el-image v-if="article.coverPath" :src="article.coverPath" />
        </swiper-slide>
        <div class="swiper-pagination"></div>
      </swiper>
    </div>
    <el-skeleton
      v-if="recommendArticles.length === 0"
      :rows="5"
      animated
    />
  </div>
</template>

<style scoped lang="scss">
.recommend--h200 {
  height: 200px;
}

.recommend {
  border-radius: $border-radius;

  .item_text {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    background-color: hsla(0, 0%, 0%, 0.1);
    padding: 0 20px;
    z-index: 1;
    line-height: 40px;
  }

  .el-image {
    @media screen and (min-width: 768px) {
      transform: translate(0, -20%);
    }
  }
}
</style>
