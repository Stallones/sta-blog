// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得分类下的文章列表 GET /app-api/blog/article/category/${param0} */
export async function getArticleListByCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleListByCategoryParams,
  options?: { [key: string]: any }
) {
  const { categoryId: param0, ...queryParams } = params;
  return request<API.AppArticleRespVO[]>(
    `/app-api/blog/article/category/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获得文章详情 GET /app-api/blog/article/get */
export async function getArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleParams,
  options?: { [key: string]: any }
) {
  return request<API.AppArticleRespVO>("/app-api/blog/article/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得文章分页（仅公开文章） GET /app-api/blog/article/page */
export async function getArticlePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticlePageParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppArticleRespVO>("/app-api/blog/article/page", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得推荐文章 GET /app-api/blog/article/recommend */
export async function getArticleListByVisitCount(options?: {
  [key: string]: any;
}) {
  return request<API.AppArticleRespVO[]>("/app-api/blog/article/recommend", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获得相关文章（同分类） GET /app-api/blog/article/related */
export async function getArticleListByCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleListByCategoryIdParams,
  options?: { [key: string]: any }
) {
  return request<API.AppArticleRespVO[]>("/app-api/blog/article/related", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 搜索文章（按标题/内容） GET /app-api/blog/article/search-content */
export async function getArticleListByTitleAndContent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleListByTitleAndContentParams,
  options?: { [key: string]: any }
) {
  return request<API.AppArticleRespVO[]>(
    "/app-api/blog/article/search-content",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获得标签下的文章列表 GET /app-api/blog/article/tag/${param0} */
export async function getArticleListByTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleListByTagParams,
  options?: { [key: string]: any }
) {
  const { tagId: param0, ...queryParams } = params;
  return request<API.AppArticleRespVO[]>(
    `/app-api/blog/article/tag/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获得时间轴文章列表（全量） GET /app-api/blog/article/time-line */
export async function getArticleListByCreateTime(options?: {
  [key: string]: any;
}) {
  return request<API.AppArticleRespVO[]>("/app-api/blog/article/time-line", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获得时间轴文章分页 GET /app-api/blog/article/time-line/page */
export async function getArticlePageByCreateTime(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticlePageByCreateTimeParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppArticleRespVO>(
    "/app-api/blog/article/time-line/page",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 文章访问量+1 GET /app-api/blog/article/visit */
export async function addVisitCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addVisitCountParams,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/article/visit", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
