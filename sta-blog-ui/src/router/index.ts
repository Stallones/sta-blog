// 使用 vue-router 配置路由
import { createRouter, createWebHistory } from "vue-router";
import { constantRouter } from "@/router/routers.ts";

let router = createRouter({
  // 路由模式 History
  history: createWebHistory(),
  routes: constantRouter,
});

router.beforeEach((to, _from, next) => {
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
