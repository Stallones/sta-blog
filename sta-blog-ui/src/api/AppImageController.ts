// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获得图片列表（按类型） GET /app-api/blog/image/list */
export async function getImageList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getImageListParams,
  options?: { [key: string]: any }
) {
  return request<API.AppImageRespVO[]>("/app-api/blog/image/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 上传图片 POST /app-api/blog/image/upload */
export async function uploadImage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadImageParams,
  options?: { [key: string]: any }
) {
  return request<API.AppImageUploadRespVO>("/app-api/blog/image/upload", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
