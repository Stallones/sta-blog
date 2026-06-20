# Architecture — 路由·组件树·依赖矩阵·DOM 层级

> 最后更新：2026-06-20（Header 精简为 2 种模式，移除 article/none）

---

## 1. 双布局系统

项目有两个根布局，通过 `router/routers.ts` 中的两组根路由区分：

| 布局 | 文件 | 特征 | 承载路由 |
|------|------|------|---------|
| **BaseLayout** | `Layout/BaseLayout.vue` | Header(含 Hero/Banner) + main-content + sidebar + Footer + FloatingMenu | 首页、归档、留言板、友链 |
| **CustomLayout** | `Layout/CustomLayout.vue` | 仅 Nav + 裸露内容区 + Footer(可选) + FloatingMenu。支持**阅读模式**(隐藏 Nav/Footer/FloatingMenu) | 文章、关于、树洞、音乐、相册、用户 |

### BaseLayout 结构

```
div.layout-shell
├── <Header :headerType :title :subtitle />     → §2
├── main.main-shell
│   └── div.main-wrapper  [flex, gap:$gap-desktop]
│       ├── div.main-content  [flex:0 0 74%]
│       │   └── <router-view />
│       └── div.main-sidebar  [flex:0 0 26%, v-if="sidebarType && sidebarVisible"]
│           └── <SideBar />
├── <Footer v-if="showFooter" />
└── <FloatingMenu />         ← 全局唯一，注册制按钮
```

### CustomLayout 结构

```
div.custom-layout  [min-height:100vh, flex column]
├── <Nav v-if="!isReadingMode" />
├── div.custom-content  [flex:1]
│   └── <router-view />
├── <Footer v-if="showFooter && !isReadingMode" />
└── <FloatingMenu v-if="!isReadingMode" />
```

---

## 2. Header 组件（2 种模式）

`components/Header/index.vue` 通过 `headerType` prop 决定内容。仅 BaseLayout 使用：

| headerType | 内容 | 高度 | 使用路由 |
|-----------|------|------|---------|
| `home` | Nav + `.h-full`(Images + Brand) | 100vh | `/` |
| `page` | Nav + `.h-banner`(森林背景 + 标题/副标题) | 40vh | 归档、留言板、友链 |

> **注意**：文章页已迁移到 CustomLayout，不再经过 Header 组件。`article`/`none` 两个 headerType 已从代码中移除。

### Header 内部组件

```
Header/index.vue
├── <Nav />                    ← 所有模式都渲染
├── <Images />                 ← home: 背景轮播 (fixed, z:-2)
├── <Brand />                  ← home: 品牌标题 (fixed, z:-1)
```

---

## 3. 路由表

### BaseLayout 路由组 (`layout`)

| Path | View | headerType | sidebar | showFooter |
|------|------|-----------|---------|-----------|
| `/` | `Home.vue` | `home` | `default` | ✅ |
| `/category/:id?` | `Archive/Category.vue` | `page` | — | ✅ |
| `/tags/:id?` | `Archive/Tags.vue` | `page` | — | ✅ |
| `/timeline` | `Archive/TimeLine.vue` | `page` | — | ✅ |
| `/message` | `Message/MessageList.vue` | `page` | — | ✅ |
| `/message/detail/:id?` | `Message/MessageDetail.vue` | `page` | — | ✅ |
| `/link` | `Link.vue` | `page` | — | ✅ |

### CustomLayout 路由组 (`custom-layout`)

| Path | View | showFooter | 特殊 |
|------|------|-----------|------|
| `/article/:id` | `Article.vue` | ✅ | 自含 header/sidebar/阅读模式 |
| `/about` | `About.vue` | — | — |
| `/user` | `User/index.vue` → redirect `/login` | ❌ | 嵌套子路由 |
| `/login` | `User/Login.vue` | ❌ | — |
| `/register` | `User/Register.vue` | ❌ | — |
| `/reset` | `User/Reset.vue` | ❌ | — |
| `/setting` | `User/Setting.vue` | ✅ | — |
| `/tree-hole` | `TreeHole.vue` | — | — |
| `/music` | `Music/index.vue` | — | — |
| `/photo` | `Photo/index.vue` | — | — |

### 通配符

`/:pathMatch(.*)*` → redirect `/`

---

## 4. 关键页面组件树

### Home `/`

```
Home.vue
├── div.hc-header
│   ├── div.hc-notice (公告)
│   ├── div.hc-search → <SearchByPagefind v-if="!isOnline" />
│   └── <RecommendArticle />
├── <Gallery />                ← 文章卡片画廊（7种布局）
│   └── <HorizontalCard|VerticalCard|OverlayCard|WaterfallCard />
└── <Pagination />
```

Home 挂载时调用 `registerHomeItems()` → 向 FloatingMenu 注册 `galleryLayout` 按钮。

### Article `/article/:id`

```
Article.vue (CustomLayout 内)
├── div.article-cover (v-if="!isReadingMode")
│   └── <ArticleHeader />
├── div.article-flex (v-if="!isReadingMode")
│   ├── div.article-main
│   │   ├── div.article-scroll (阅读进度条, fixed, z:1032)
│   │   ├── <MdEditor />       ← async import
│   │   ├── <ArticleFooter />
│   │   └── <SComment />       ← async import
│   └── div.article-sidebar
│       └── <ArticleSideBar /> ← BloggerInfoCard + ClocksCard + DirectoryCard + RandomCard
└── div.reading-mode (v-if="isReadingMode")
    └── (简化版 ArticleHeader + MdEditor)
```

Article 挂载时调用 `registerArticleItems()` → 注册 `readingMode` + `toComment` + `catalogMob`。

---

## 5. 共享组件依赖矩阵

### 🔴 最高风险（全站影响）

| 组件 | 位置 | 被谁渲染 | 影响范围 |
|------|------|---------|---------|
| **Nav** | `components/Nav/index.vue` | Header(所有headerType) + CustomLayout | 全站导航 |
| **MenuList** | `components/Nav/MenuList.vue` | Nav (桌面) | 全站导航链接 |
| **NavMob** | `components/Nav/NavMob/index.vue` | Nav (≤900px 移动端) | 全站移动端导航 |
| **UserLogin** | `components/Nav/UserLogin.vue` | Nav | 全站登录入口 |
| **FloatingMenu** | `components/FloatingMenu/index.vue` | BaseLayout + CustomLayout | 全站浮动按钮 |
| **Header** | `components/Header/index.vue` | BaseLayout | 所有 BaseLayout 页面 |
| **CanvasLayer** | `components/CanvasLayer/index.vue` | App.vue | 全站背景(3层 canvas) |

### 🟡 中等风险

| 组件 | 位置 | 被谁渲染 | 影响范围 |
|------|------|---------|---------|
| **SearchDialog** | `components/Search/SearchDialog.vue` | App.vue | 全站搜索弹窗 |
| **Gallery** | `components/Gallery/index.vue` | Home | 首页文章列表 |
| **SComment** | `components/SComment/index.vue` | Article, MessageList | 文章评论 + 留言板 |
| **Footer** | `components/Footer/index.vue` | BaseLayout + CustomLayout | 页面底部 |
| **Loading** | `components/Loading.vue` | App.vue | 全站加载遮罩 |
| **RightClickMenu** | `components/RightClickMenu.vue` | App.vue | 全站右键菜单 |

### 🟢 低风险

| 组件 | 位置 | 被谁渲染 | 影响范围 |
|------|------|---------|---------|
| **SideBar** | `components/SideBar/index.vue` | BaseLayout.main-sidebar | 首页 + 留言板侧边栏 |
| **ArticleSideBar** | `components/SideBar/ArticleSideBar.vue` | Article.vue | 文章页侧边栏 |
| **SCard/*** | `components/SCard/*.vue` | SideBar, ArticleSideBar | 各类卡片 |
| **Pagination** | `components/Pagination.vue` | Home | 首页分页 |
| **DevToolsBlocker** | `components/DevToolsBlocker.vue` | App.vue | 开发工具拦截 |

---

## 6. App.vue 全局层

```
App.vue
├── <router-view v-if="isReady" />     ← 健康检查完成后才渲染
├── <Loading />
├── <RightClickMenu />
├── <SearchDialog />
├── <DevToolsBlocker />
└── <CanvasLayer />                     ← 3层 canvas
```

**全局初始化**：
- `useDemotion().checkService()` → 健康检查
- `useWebsiteStore().getInfo(requestOrRead)` → 加载网站信息
- `useDark()` → 亮暗模式（html class: light/dark）

---

## 7. Z-Index 层级图

```
-2:           Images (Header > .h-full, 背景轮播)
-1:           CanvasLayer.canvas-bg, .canvas-particles (App 根级)
-1:           Brand.brand (Header 内)
 0 (auto):    layout-shell, main-wrapper, main-content, Footer
 5:           CanvasLayer.canvas-trail (鼠标拖尾)
10:          Nav (导航栏, fixed)
1032:        .article-scroll (阅读进度条)
9999:        FloatingMenu (固定右下角)
10000:       DevToolsBlocker, RightClickMenu
```

---

## 8. FloatingMenu 注册制

FloatingMenu 采用**注册制**，页面在 onMounted/onUnmounted 中注册/注销按钮：

| 注册函数 | 注册项 | 显示条件 |
|---------|--------|---------|
| `registerGlobalItems()` | settings, colorMode, scrollPercentage, sidebarHide | BaseLayout/CustomLayout onMounted |
| `registerHomeItems()` | galleryLayout (expand, order:-10) | Home onMounted |
| `registerArticleItems()` | readingMode (expand, order:-20), toComment (expand, order:-10), catalogMob (always, order:110, ≤900px) | Article onMounted |

按钮分两类：
- **global: true** → 始终显示（always 列表）
- **global: false** → 需点击设置齿轮展开（expand 列表）

---

## 9. Header 高度 → 内容区位移

```
headerType "home" (/)：
  .home-header { height: 100vh }
  → main-shell 起始 Y = 100vh + padding

headerType "page" (归档等)：
  .page-header { height: 40vh }
  → main-shell 起始 Y = 40vh + padding
```

> 文章页已迁移到 CustomLayout，不再经过 Header 组件，由 Article 自行管理布局。

### 对 CanvasLayer 的连锁影响

`canvasHeaderH` 由 Header 组件写入：`windowH - header.height`

- home: canvasHeaderH = 0 → 画布从内容区开始（hero 区域展示 Images 轮播）
- page: canvasHeaderH = 0.6*windowH → 画布从 banner 偏移处开始

---

## 10. 离线降级架构

```
useDemotion (composable, 全局单例)
├── isOnline: Ref<boolean>       ← 后端服务是否可用
├── isReady: Ref<boolean>        ← 健康检查是否完成
├── checkService()               ← App.vue onMounted 调用一次
└── requestOrRead(apiFn, readFn, ...args)
    ├── Online:  → apiFn()      (标准 API)
    └── Offline: → readFn()     (读取本地 .json/.enc)

file-reader.ts
├── localResponse<T>(path)
│   ├── isCrypto() → fetch .enc → AES decrypt → parse
│   └── !isCrypto() → fetch .json → parse
├── readArticleDetail(id)        ← 从 /apis/article-detail.json 按 id 查找
├── readArticlePage(page, size)  ← 从 /apis/article-detail.json 分页
├── readCategoryList()           ← /apis/category-with-article
├── readTagList()                ← /apis/tag-with-article
├── readTimeLine()               ← /apis/article-detail (全量)
├── readWebsiteInfo()            ← /apis/website-info
├── readSearchTitleList()        ← /apis/search-titles
├── readArchiveArticleList()     ← 归档文章列表
└── searchLocalArticles(ids)     ← Pagefind 结果 → 本地文章匹配
```

### 各页面离线策略

| 路由 | 策略 | 数据来源 | 离线 UX |
|------|------|---------|---------|
| `/` | requestOrRead | getArticlePage ↔ readArticlePage | 降级到 SearchByPagefind |
| `/article/:id` | requestOrRead | getArticleDetail ↔ readArticleDetail | 核心内容可用，评论/点赞隐藏 |
| `/category` `/tags` `/timeline` | requestOrRead | 各 API ↔ file-reader | 透明降级 |
| `/message` `/link` `/tree-hole` | 直接 API，无 fallback | — | 离线不可用 |
| `/music` `/photo` | 无离线处理 | — | — |
