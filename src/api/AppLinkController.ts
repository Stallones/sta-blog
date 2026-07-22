// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 申请友链 POST /app-api/blog/link/apply */
export async function applyForLink(
  body: API.AppLinkApplyReqVO,
  options?: { [key: string]: any }
) {
  return request<number>("/app-api/blog/link/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获得友链列表（已审核） GET /app-api/blog/link/list */
export async function getLinkList(options?: { [key: string]: any }) {
  return request<API.AppLinkRespVO[]>("/app-api/blog/link/list", {
    method: "GET",
    ...(options || {}),
  });
}
