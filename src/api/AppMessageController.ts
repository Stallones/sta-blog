// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 创建留言/回复 POST /app-api/blog/message/create */
export async function createMessage(
  body: API.AppMessageCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<number>("/app-api/blog/message/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除自己的留言 DELETE /app-api/blog/message/delete */
export async function deleteMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMessageParams,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/message/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得留言分页（顶级留言，type=30） GET /app-api/blog/message/page */
export async function getMessagePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessagePageParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppMessageRespVO>("/app-api/blog/message/page", {
    method: "GET",
    params: {
      // orderBy has a default value: newest
      orderBy: "newest",

      ...params,
    },
    ...(options || {}),
  });
}

/** 获得留言回复分页（type=31，按 rootId） GET /app-api/blog/message/reply-page */
export async function getReplyPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReplyPageParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResultAppMessageRespVO>(
    "/app-api/blog/message/reply-page",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获得留言树（嵌套结构） GET /app-api/blog/message/tree */
export async function getMessageTree(options?: { [key: string]: any }) {
  return request<API.AppMessageRespVO[]>("/app-api/blog/message/tree", {
    method: "GET",
    ...(options || {}),
  });
}
