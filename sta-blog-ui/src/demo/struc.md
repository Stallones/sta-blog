# 离线降级策略分析

> 当前离线方案：API 层切分（`requestOrRead` 双数据源） + 渲染层切分（`v-if="isOnline"`）两套并存。

---

## 一、API 层切分（`requestOrRead` 双数据源）

这 8 处同时准备了在线 API 和本地 JSON 镜像，离线时走本地读取：

| # | 位置 | 在线源 | 离线源 |
|---|------|--------|--------|
| 1 | `useWebsiteStore.getInfo()` | `getWebsiteInfo` API | `readWebsiteInfo` JSON |
| 2 | `useArticleStore.fetchArticle()` | `getArticleDetail` API | `readArticleDetail` JSON |
| 3 | `useArticleList.fetchArticles()` | `getArticlePage` API | `readArticlePage` JSON |
| 4 | `TimeLine.vue` | `getTimeLine` API | `readTimeLine` JSON |
| 5 | `Category.vue` | `categoryList` + `whereArticleList` | `readCategoryList` + `readArchiveArticleList` |
| 6 | `Tags.vue` | `tagList` + `whereArticleList` | `readTagList` + `readArchiveArticleList` |
| 7 | `TagListCard.vue` | `tagList` API | `readTagList` JSON |
| 8 | `Images.vue` | `backGetBanners` API | `readBanners` JSON |

**特征**：核心数据（文章列表/详情/归档/标签/网站信息/Banner）走双数据源，离线时内容仍可展示。

---

## 二、渲染层切分（`v-if="isOnline"` / `if (isOnline)`）

这 11 处只判断在线状态，在线则渲染/加载，离线则跳过：

| # | 位置 | 控制方式 | 离线效果 |
|---|------|----------|----------|
| 1 | `ArticleFooter.vue` | `v-if="isOnline"` | 隐藏点赞/收藏/分享按钮 |
| 2 | `RecommendArticle.vue` | `v-if="isOnline"` | 整个推荐区域不渲染 |
| 3 | `ArticleSideBar.vue` | `if (isOnline)` | 不展示相关推荐卡片 |
| 4 | `Article.vue` | `if (isOnline)` | 不加载评论区 |
| 5 | `MessageList.vue` | `v-if="isOnline"` | 隐藏留言按钮 + 留言列表 |
| 6 | `Link.vue` | `if (isOnline)` | 不加载友链列表 |
| 7 | `Home.vue` | `v-if="!isOnline"` | 切到 Pagefind 离线搜索 |
| 8 | `UserLogin.vue` | `v-if="isOnline"` | 隐藏登录入口 |
| 9 | `SearchByDB.vue` | `v-if="isOnline"` | 隐藏在线搜索按钮 |
| 10 | `SideBar/index.vue` | `showRandom = isOnline.value` | 不展示随机推荐 |
| 11 | `SearchDialog.vue` | `if (isOnline)` | 在线搜文章 / 离线搜 Pagefind |

**特征**：交互功能（评论/点赞/登录/友链/搜索）只需判断在线状态，离线时直接不渲染，无需备用数据。

---

## 三、改进方向

当前 `requestOrRead` 让每个 API 调用方需维护两份数据源。如果改为**构建时生成静态数据**嵌入应用，所有 8 处 API 层切分可降为渲染层切分——调用方只调 API，离线时数据天然可用，无需运行时切换逻辑。
