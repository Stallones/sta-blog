// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得网站信息 GET /app-api/blog/website-info/get */
export async function getWebsiteInfo(options?: { [key: string]: any }) {
  return request<API.AppWebsiteInfoRespVO>("/app-api/blog/website-info/get", {
    method: "GET",
    ...(options || {}),
  });
}

/** 健康检查 GET /app-api/blog/website-info/health */
export async function healthCheck(options?: { [key: string]: any }) {
  return request<boolean>("/app-api/blog/website-info/health", {
    method: "GET",
    ...(options || {}),
  });
}
