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
          title: "marcus-blog | 不断追求完美的开源博客",
        },
      },
      // ── 分类 ──
      {
        path: "/category/:id?",
        component: () => import("@/views/Archive/Category.vue"),
        name: "category",
        meta: {
          headerType: "page",
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
          title: "文章标签",
          subtitle: "Tags",
        },
      },
      // ── 时间轴 ──
      {
        path: "/timeline",
        component: () => import("@/views/Archive/Timeline.vue"),
        name: "timeline",
        meta: {
          headerType: "page",
          title: "时间轴",
          subtitle: "TimeLine",
        },
      },
      // ── 归档通用页 ──
      {
        path: "/archive/:type/:id",
        component: () => import("@/views/Archive/Common.vue"),
        name: "archiveDetail",
        meta: {
          headerType: "page",
        },
      },
      {
        path: "/message",
        component: () => import("@/views/Message/MessageList.vue"),
        name: "message",
        meta: {
          headerType: "page",
          title: "留言板",
        },
      },
      {
        path: "/message/detail/:id?",
        component: () => import("@/views/Message/MessageDetail.vue"),
        name: "messageDetail",
        meta: {
          headerType: "page",
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
          title: "博客友链",
        },
      },
      // ── 用户设置 ──
      {
        path: "/setting",
        component: () => import("@/views/User/Setting.vue"),
        name: "setting",
        meta: {
          headerType: "page",
          title: "用户设置",
          subtitle: "Setting",
          sidebarType: "default",
          showFooter: true,
          requiresAuth: true,
        },
      },
    ],
  },
  // ── 自定义布局（仅 Nav + 裸露内容区，无 wrapper/sidebar） ──
  {
    path: "/",
    name: "custom-layout",
    component: () => import("@/Layout/CustomLayout.vue"),
    meta: { showFooter: false, showNav: false },
    children: [
      // ── 文章详情（自含 header + sidebar，完整自主布局）──
      {
        path: "article/:id",
        component: () => import("@/views/Article.vue"),
        name: "article",
        meta: { title: "文章详情", showFooter: true, showNav: true },
      },
      // ── 关于 ──
      {
        path: "about",
        component: () => import("@/views/About.vue"),
        name: "about",
        meta: { title: "关于", showNav: true },
      },
      // ── 用户认证（左右分栏包裹）──
      {
        path: "user",
        component: () => import("@/views/User/index.vue"),
        name: "user",
        redirect: "/user/login",
        children: [
          {
            path: "login",
            component: () => import("@/views/User/Login.vue"),
            name: "login",
            meta: { title: "用户登录" },
          },
          {
            path: "register",
            component: () => import("@/views/User/Register.vue"),
            name: "register",
            meta: { title: "用户注册" },
          },
          {
            path: "reset",
            component: () => import("@/views/User/Reset.vue"),
            name: "reset",
            meta: { title: "重置密码" },
          },
        ],
      },
      // ── 树洞 空──
      {
        path: "tree-hole",
        component: () => import("@/views/TreeHole.vue"),
        name: "treeHole",
        meta: { title: "树洞", showNav: true },
      },
      // ── 音乐 空──
      {
        path: "music",
        component: () => import("@/views/Music/index.vue"),
        name: "music",
        meta: { title: "音乐" },
      },
      // ── 相册 空──
      {
        path: "photo",
        component: () => import("@/views/Photo/index.vue"),
        name: "photo",
        meta: { title: "相册", showNav: true },
      },
    ],
  },
  // ── 通配符重定向 ──
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    name: "any",
  },
];
