// 使用 vue-router 配置路由
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import { GET_TOKEN } from "@/utils/auth";
import { constantRouter } from "@/router/routers.ts";

/** 记录进入 /user/* 前的来源路径（用于返回按钮） */
export const beforeLoginPath = ref<string>("");

let router = createRouter({
  // 路由模式 History
  history: createWebHistory(),
  routes: constantRouter,
});

// 全局：进入文章详情页/留言详情页后回到顶部（注册一次，幂等）
router.afterEach((to) => {
  const toName = String(to.name);
  if (toName === "article" || toName === "messageDetail") {
    window.scrollTo(0, 0);
  }
});

router.beforeEach((to, from, next) => {
  // 进入 /user/* 页面时，记录来源路径（用于返回按钮）
  if (to.path.startsWith("/user/") && !from.path.startsWith("/user/")) {
    beforeLoginPath.value = from.fullPath;
  }

  // 需要登录的页面：未登录则重定向到首页
  if (to.meta.requiresAuth && !GET_TOKEN()) {
    next("/");
    return;
  }

  const toName = String(to.name);

  // 查看文章详情页，滚动条回到顶部（幂等：由顶层 afterEach 统一处理）
  window.document.title = to.meta.title as string;
  next();
});

export default router;
