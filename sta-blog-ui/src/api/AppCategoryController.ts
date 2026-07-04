// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得分类 GET /app-api/blog/category/get */
export async function getCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.AppCategoryRespVO>("/app-api/blog/category/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得分类列表 GET /app-api/blog/category/list */
export async function getCategoryList(options?: { [key: string]: any }) {
  return request<API.AppCategoryRespVO[]>("/app-api/blog/category/list", {
    method: "GET",
    ...(options || {}),
  });
}
