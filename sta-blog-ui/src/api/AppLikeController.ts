// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 是否已点赞 GET /app-api/blog/like/is-like */
export async function isLike(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.isLikeParams,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/like/is-like", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 切换点赞/取消点赞（无记录创建，有记录切换status） POST /app-api/blog/like/toggle */
export async function toggleLike(
  body: API.AppLikeReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/like/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
