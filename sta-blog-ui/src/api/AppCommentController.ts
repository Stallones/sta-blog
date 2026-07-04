// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得文章评论总数（仅顶级评论） GET /app-api/blog/comment/count */
export async function getCommentCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentCountParams,
  options?: { [key: string]: any }
) {
  return request<number>("/app-api/blog/comment/count", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建评论/回复 POST /app-api/blog/comment/create */
export async function createComment(
  body: API.AppCommentCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<number>("/app-api/blog/comment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除自己的评论 DELETE /app-api/blog/comment/delete */
export async function deleteComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCommentParams,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/comment/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得文章评论分页（顶级评论，type=20） GET /app-api/blog/comment/page */
export async function getCommentPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentPageParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppCommentRespVO>("/app-api/blog/comment/page", {
    method: "GET",
    params: {
      // orderBy has a default value: newest
      orderBy: "newest",

      ...params,
    },
    ...(options || {}),
  });
}

/** 获得评论回复分页（type=21，按 rootId） GET /app-api/blog/comment/reply-page */
export async function getReplyPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReplyPageParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppCommentRespVO>(
    "/app-api/blog/comment/reply-page",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获得文章评论树（嵌套结构） GET /app-api/blog/comment/tree */
export async function getCommentTree(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentTreeParams,
  options?: { [key: string]: any }
) {
  return request<API.AppCommentRespVO[]>("/app-api/blog/comment/tree", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
