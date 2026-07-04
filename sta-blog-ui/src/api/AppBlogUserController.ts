// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得基本信息 GET /app-api/blog/user/get */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.AppUserInfoRespVO>("/app-api/blog/user/get", {
    method: "GET",
    ...(options || {}),
  });
}

/** 修改基本信息 PUT /app-api/blog/user/update */
export async function updateUser(
  body: API.AppUserUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
