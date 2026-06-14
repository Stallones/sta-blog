export const constantRouter = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/Layout/BaseLayout.vue"),
    children: [
      // ── 首页：全屏 Hero
      {
        path: "",
        component: () => import("@/views/Home.vue"),
        name: "home",
        meta: {
          headerType: "home",
          sidebarType: "default",
          title: "marcus-blog | 不断追求完美的开源博客",
        },
      },
      // ── 文章详情 ──
      {
        path: "/article/:id",
        component: () => import("@/views/Article.vue"),
        name: "article",
        meta: {
          headerType: "article",
          sidebarType: "article",
          title: "文章详情",
        },
      },
      // ── 分类 ──
      {
        path: "/category/:id?",
        component: () => import("@/views/Archive/Category.vue"),
        name: "category",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "文章分类",
          subtitle: "Category",
        },
      },
      // ── 标签 ──
      {
        path: "/tags/:id?",
        component: () => import("@/views/Archive/Tags.vue"),
        name: "tags",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "文章标签",
          subtitle: "Tags",
        },
      },
      // ── 时间轴 ──
      {
        path: "/timeline",
        component: () => import("@/views/Archive/TimeLine.vue"),
        name: "timeline",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "时间轴",
          subtitle: "TimeLine",
        },
      },
      // ── 留言版 ──
      {
        path: "/message",
        component: () => import("@/views/LeaveMsg/Message/MessageList.vue"),
        name: "message",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "留言板",
        },
      },
      {
        path: "/message/detail/:id?",
        component: () =>
          import("@/views/LeaveMsg/Message/MessageDetail.vue"),
        name: "messageDetail",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "留言详情",
        },
      },

      // ── 友链 ──
      {
        path: "/link",
        component: () => import("@/views/Link.vue"),
        name: "link",
        meta: {
          headerType: "page",
          sidebarType: "default",
          title: "博客友链",
        },
      },
    ],
  },
  // ── 自定义布局（仅 Nav + 裸露内容区，无 wrapper/sidebar） ──
  {
    path: "/",
    name: "custom-layout",
    component: () => import("@/Layout/CustomLayout.vue"),
    children: [
      // ── 树洞 ──
      {
        path: "/tree-hole",
        component: () => import("@/views/LeaveMsg/TreeHole.vue"),
        name: "treeHole",
        meta: { title: "心灵树洞" },
      },
      // ── 音乐 ──
      {
        path: "/music",
        component: () => import("@/views/Music/index.vue"),
        name: "music",
        meta: { title: "音乐" },
      },
      // ── 关于 ──
      {
        path: "/about",
        component: () => import("@/views/About.vue"),
        name: "about",
        meta: { title: "关于网站" },
      },
      // ── 相册 ──
      {
        path: "/photo",
        component: () => import("@/views/Photo/index.vue"),
        name: "photo",
        meta: { title: "相册" },
      },
    ],
  },
  // ── 登录/注册/重置 ──
  {
    path: "/welcome",
    component: () => import("@/views/Welcome/index.vue"),
    name: "welcome",
    redirect: "/login",
    meta: {
      headerType: "none",
      showFooter: false,
    },
    children: [
      {
        path: "/login",
        component: () => import("@/views/Welcome/Login.vue"),
        name: "welcome-login",
        meta: { title: "用户登录", headerType: "none", showFooter: false },
      },
      {
        path: "/register",
        component: () => import("@/views/Welcome/Register.vue"),
        name: "welcome-register",
        meta: { title: "用户注册", headerType: "none", showFooter: false },
      },
      {
        path: "/reset",
        component: () => import("@/views/Welcome/Reset.vue"),
        name: "welcome-reset",
        meta: { title: "重置密码", headerType: "none", showFooter: false },
      },
    ],
  },
  // ── 设置 ──
  {
    path: "/setting",
    component: () => import("@/views/Welcome/Setting.vue"),
    name: "setting",
    meta: { title: "用户设置", headerType: "page", showFooter: true },
  },
  // ── 通配符重定向 ──
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    name: "any",
  },
];
