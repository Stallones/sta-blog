// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 取消收藏（status置0） POST /app-api/blog/favorite/cancel */
export async function cancelFavorite(
  body: API.AppFavoriteReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/favorite/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 是否已收藏 GET /app-api/blog/favorite/is-favorite */
export async function isFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.isFavoriteParams,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/favorite/is-favorite", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得我的收藏列表 GET /app-api/blog/favorite/my-list */
export async function getFavoriteList(options?: { [key: string]: any }) {
  return request<API.AppFavoriteRespVO[]>("/app-api/blog/favorite/my-list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 切换收藏/取消收藏（无记录创建，有记录切换status） POST /app-api/blog/favorite/toggle */
export async function toggleFavorite(
  body: API.AppFavoriteReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/favorite/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
