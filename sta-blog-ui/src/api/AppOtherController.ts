// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取一言 GET /app-api/blog/other/yiyan */
export async function getYiyan(options?: { [key: string]: any }) {
  return request<string>("/app-api/blog/other/yiyan", {
    method: "GET",
    ...(options || {}),
  });
}
