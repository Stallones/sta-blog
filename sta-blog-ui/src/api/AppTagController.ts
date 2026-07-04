// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得标签列表 GET /app-api/blog/tag/list */
export async function getTagList(options?: { [key: string]: any }) {
  return request<API.AppTagRespVO[]>("/app-api/blog/tag/list", {
    method: "GET",
    ...(options || {}),
  });
}
