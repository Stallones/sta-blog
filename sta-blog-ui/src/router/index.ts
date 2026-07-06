// 使用 vue-router 配置路由
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import { constantRouter } from "@/router/routers.ts";

/** 记录进入 /user/* 前的来源路径（用于返回按钮） */
export const beforeLoginPath = ref<string>("");

let router = createRouter({
  // 路由模式 History
  history: createWebHistory(),
  routes: constantRouter,
});

router.beforeEach((to, from, next) => {
  // 进入 /user/* 页面时，记录来源路径（用于返回按钮）
  if (to.path.startsWith("/user/") && !from.path.startsWith("/user/")) {
    beforeLoginPath.value = from.fullPath;
  }

  const toName = String(to.name);

  // 查看文章详情页，滚动条回到顶部
  if (toName === "article" || toName === "messageDetail") {
    router.afterEach(() => {
      window.scrollTo(0, 0);
    });
  }

  window.document.title = to.meta.title as string;
  next();
});

export default router;
