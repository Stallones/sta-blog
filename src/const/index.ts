// 由 scripts/gen-enum-consts.ts 自动生成，请勿手动修改
// 基于后端 OpenAPI 枚举元数据（x-enum-varnames / x-enum-descriptions）

export const BlogType = {
  /** 文章 */
  ARTICLE: 10,
  /** 评论 */
  COMMENT: 20,
  /** 评论回复 */
  COMMENT_REPLY: 21,
  /** 留言 */
  MESSAGE: 30,
  /** 留言回复 */
  MESSAGE_REPLY: 31,
  /** 封面图 */
  IMG_COVER: 51,
  /** 轮播图 */
  IMG_HOME: 52,
  /** banner图 */
  IMG_PAGE: 53,
  /** 头像 */
  IMG_AVATAR: 54,
} as const;

// Jwt 前缀常量
export const JWT_PREFIX_CONS = 'Bearer ';

// Token 名称常量（命名空间化，避免与 vben admin、ruoyi 系统用户冲突）
export const TOKEN_KEY = 'sta-blog-app-token';

// 文章访问量统计 前缀常量
export const ARTICLE_VISIT_PREFIX = 'article_visit_';

