# Data Layer — Store·Composable·API·Utils

> 最后更新：2026-06-20（基于最新源码）

---

## 1. Pinia Store

| Store | 文件 | 语法 | 持久化 | 职责 |
|-------|------|------|--------|------|
| `useWebsiteStore` | `store/useWebsiteStore.ts` | Setup | — | 网站信息 (webInfo) + 搜索标题 (searchTitle) |
| `useArticleStore` | `store/useArticleStore.ts` | Setup | — | 文章详情 (articleVO) + 字数统计 + 封面 URL |
| `useUserStore` | `store/useUserStore.ts` | Setup | — | JWT Token + 用户信息 |
| `useSearchStore` | `store/useSearchStore.ts` | Setup | localStorage(historyList) | 搜索弹窗状态 + 搜索结果 + 搜索历史 |
| `usePaginationStore` | `store/usePaginationStore.ts` | Options | — | 文章分页 + 评论分页 |
| `useMusicAiStore` | `components/Music/musicStore.ts` | Setup | — | 音乐播放器完整状态（~360行，最复杂 store） |

### Store 数据流

```
App.vue onMounted
├── useDemotion().checkService()         → isOnline/isReady
└── useWebsiteStore().getInfo(requestOrRead)
    ├── Online:  getWebsiteInfo() (API)
    └── Offline: readWebsiteInfo() (file-reader)

Article.vue onMounted
└── useArticleStore().fetchArticle(id, { requestOrRead, isOnline })
    ├── Online:  getArticleDetail(id) (API)
    └── Offline: readArticleDetail(id) (file-reader)
```

---

## 2. Composables

| Composable | 文件 | 单例? | 被谁使用 | 职责 |
|-----------|------|-------|---------|------|
| `useDemotion` | `composables/useDemotion.ts` | ✅ | App.vue, Nav, Home, Article, SideBar, useArticleList | 离线降级管理：isOnline, isReady, checkService, requestOrRead |
| `useFloatingMenu` | `composables/useFloatingMenu.ts` | ✅ | FloatingMenu, BaseLayout, CustomLayout, Article, Home | 浮动菜单注册制：功能项列表、展开状态、侧边栏显隐、目录 popover |
| `useReadingMode` | `composables/useReadingMode.ts` | ✅ | CustomLayout, Article, FloatingMenu | 阅读模式：isReadingMode, toggleReadingMode（自动隐藏 sidebar） |
| `useReadingProgress` | `composables/useReadingProgress.ts` | — | Article, FloatingMenu | 阅读进度百分比：scrollPercentage |
| `useGalleryLayout` | `composables/useGalleryLayout.ts` | ✅ | Gallery, FloatingMenu | 首页画廊布局模式：1-7 种，cycleMode |
| `useArticleList` | `composables/useArticleList.ts` | — | Gallery | 文章列表 + 分页 + 搜索联动 |
| `useBackgroundParallax` | `composables/useBackgroundParallax.ts` | ✅ | Header, CanvasLayer | 画布 header 偏移量 + 背景图 URL |
| `useMouseTrail` | `composables/useMouseTrail.ts` | ✅ | CanvasLayer | 鼠标拖尾开关 |
| `useParticles` | `composables/useParticles.ts` | ✅ | CanvasLayer | 粒子效果开关 |
| `useTypewriter` | `composables/useTypewriter.ts` | — | Brand | 打字机效果 |
| `useLoading` | `composables/useLoading.ts` | ✅ | http.ts | NProgress 加载条控制 |

### Composable 依赖关系

```
useDemotion (核心，全局单例)
├── useArticleList 依赖 useDemotion + usePaginationStore + useSearchStore
├── useArticleStore.fetchArticle 接收 requestOrRead 参数
└── useWebsiteStore.getInfo 接收 requestOrRead 参数

useFloatingMenu (全局单例)
├── useReadingMode 依赖 useFloatingMenu (sidebarVisible)
└── registerGlobal/registerHome/registerArticle 注册功能项
```

---

## 3. API 模块

| 模块 | 文件 | 关键函数 | 说明 |
|------|------|---------|------|
| article | `apis/article/index.ts` | `getArticleDetail`, `getArticlePage`, `addArticleVisit`, `getSearchTitleList` | 文章 CRUD |
| category | `apis/category/index.ts` | `categoryList` | 分类列表 |
| tag | `apis/tag/index.ts` | `tagList` | 标签列表 |
| home | `apis/home/index.ts` | `getArticlePage` | 首页文章分页 |
| leaveWord | `apis/leaveWord/index.ts` | `getLeaveWordList`, `addLeaveWord` | 留言板 |
| treeHole | `apis/treeHole/index.ts` | `getTreeHoleList`, `addTreeHole` | 树洞 |
| link | `apis/link/index.ts` | `linkList` | 友链 |
| user | `apis/user/index.ts` | `getUserInfo`, `login`, `register`, `resetPassword` | 用户认证 |
| email | `apis/email/index.ts` | `sendEmail` | 邮件 |
| like | `apis/like/index.ts` | `likeArticle` | 点赞 |
| favorite | `apis/favorite/index.ts` | `favoriteArticle` | 收藏 |
| photo | `apis/photo/index.ts` | `getPhotoList` | 相册 |
| music | `apis/music/index.ts` | `reqToplist`, `reqTopDetaliList`, `reqMusicDetail`, `reqMusicDescription`, `reqMusicLyricById` | 网易云音乐 API |
| website | `apis/website/index.ts` | `getWebsiteInfo`, `healthCheck` | 网站信息 + 健康检查 |
| thirdParty | `apis/thirdParty/index.ts` | — | 第三方集成 |

### API 类型

- `apis/article/type.ts` — `ArticleVO`, `ArticleSearch`, `ArticleContentVO`
- `apis/website/type.ts` — `WebsiteInfo`
- `types/index.ts` — 通用类型：`ApiResponse<T>`, `Page<T>`

---

## 4. Utils

| 文件 | 职责 |
|------|------|
| `http.ts` | Axios 封装：baseURL(VITE_APP_BASE_API)、Auth 注入、Loading 控制、错误拦截 |
| `file-reader.ts` | 离线降级读取：localResponse(path) 自动补 .enc/.json 后缀 |
| `crypto.ts` | AES 加解密：isCrypto() 判断模式、decrypt() 解密 |
| `auth.ts` | JWT Token 存取：GET_TOKEN, SET_TOKEN, REMOVE_TOKEN |
| `tool.ts` | 通用工具：returnTime 时间格式化 |
| `enum.ts` | 枚举常量：REQUEST_LOADING_PATH, IGNORE_ERROR_PATH |
| `optimize.ts` | 性能优化：防抖/节流 |
| `transform.ts` | 数据转换 |
| `banner-images.ts` | Banner 图片资源 |
| `colorCircle.ts` | 颜色圆环计算 |
| `colorHsl.ts` | HSL 颜色工具 |
| `base64-img/loading-img.ts` | 加载占位图 base64 |
| `O.o/emoji.ts` + `heo.ts` + `type.ts` | 表情包数据 |
| `generate-static-data.ts` | **Node.js 脚本**：从后端 API 拉取 → AES 加密 → 写入 public/ |
| `generate-article-pages.mjs` | **Node.js 脚本**：生成文章静态页 |

---

## 5. Directives

| 指令 | 文件 | 用途 |
|------|------|------|
| `v-slide-in` | `directives/vSlideIn.ts` | 卡片入场动画 |
| `v-lazy` | `directives/vLazy.ts` | 懒加载 |
| `v-view-request` | `directives/vViewRequest.ts` | 可视区域触发请求（Gallery 使用） |

---

## 6. Config / Const

### config/config.ts
项目配置常量。

### const/index.ts
| 常量 | 值 | 用途 |
|------|---|------|
| `JWT_PREFIX_CONS` | `'Bearer '` | JWT 前缀 |
| `TOKEN_KEY` | `'Token'` | localStorage Token 键名 |
| `ARTICLE_VISIT_PREFIX` | `'article_visit_'` | sessionStorage 访问统计前缀 |
| `ARCHIVE_CATEGORY_CONS` | `'Category'` | 归档类型标识 |
| `ARCHIVE_TAG_CONS` | `'Tag'` | 归档标签标识 |
| `COMMENT_ARTICLE_CONS` | `1` | 文章评论类型 |
| `COMMENT_MESSAGE_CONS` | `2` | 留言评论类型 |

---

## 7. 关键依赖包

| 包 | 用途 |
|---|------|
| Vue 3 | 框架核心 |
| Vue Router | SPA 路由 |
| Pinia | 状态管理 |
| Element Plus | UI 组件库 |
| @vueuse/core | useDark, useWindowSize, useTitle, useLocalStorage |
| axios | HTTP 客户端 |
| md-editor-v3 | Markdown 渲染 (MdPreview + MdCatalog) |
| crypto-js | AES 加密（离线数据） |
| nprogress | 顶部加载条 |
| @element-plus/icons-vue | 图标库 |
