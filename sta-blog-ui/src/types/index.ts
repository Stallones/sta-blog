export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// ── 旧接口（已迁移至 API namespace，注释保留参考）──
// export interface Tag {
//   id: number | string;
//   name: string;
//   createTime?: string;
// }
// export interface Category {
//   id: number | string;
//   name: string;
//   createTime?: string;
// }
// export interface Article {
//   id: number | string;
//   title?: string;
//   content?: string;
//   summary?: string;
//   cover?: string;
//   createTime?: string;
//   updateTime?: string;
//   author?: string;
//   categoryId?: number | string;
//   tags?: Tag[];
//   viewCount?: number;
//   likeCount?: number;
//   favoriteCount?: number;
// }
// export interface TimeLineItem {
//   time: string;
//   articles: Article[];
// }
// export interface TreeHoleItem {
//   id: number | string;
//   content: string;
//   createTime?: string;
// }
// export interface LeaveWord {
//   id: number | string;
//   content: string;
//   nickname?: string;
//   email?: string;
//   createTime?: string;
// }
// export interface Comment {
//   id: number | string;
//   content?: string;
//   userId?: number | string;
//   createTime?: string;
// }

export interface Page<T = any> {
  list: T[],
  total: number
}

// ── 新 API 类型别名（对齐 src/api/typings.d.ts 中的 API namespace）──
export type TagVO = API.AppTagRespVO
export type ArticleVO = API.AppArticleRespVO
export type CommentVO = API.AppCommentRespVO

/** 文章内容（仅保留 id+content，详情页通过 ArticleVO.content 获取） */
export interface ArticleContentVO {
    id: number
    content: string
}

// ── 便捷导出，让组件可以直接从 @/types 引入 ──
export type AppArticleRespVO = API.AppArticleRespVO
export type AppCommentRespVO = API.AppCommentRespVO
export type AppMessageRespVO = API.AppMessageRespVO
export type AppTagRespVO = API.AppTagRespVO
export type AppLinkRespVO = API.AppLinkRespVO
export type AppImageRespVO = API.AppImageRespVO
export type AppCategoryRespVO = API.AppCategoryRespVO
