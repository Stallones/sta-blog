// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取全站离线快照（构建专用） GET /app-api/blog/other/snapshot */
export async function getSnapshot(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSnapshotParams,
  options?: { [key: string]: any }
) {
  return request<API.AppSnapshotRespVO>("/app-api/blog/other/snapshot", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取单篇文章完整内容（构建专用） GET /app-api/blog/other/snapshot/article/${param0} */
export async function getSnapshotArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSnapshotArticleParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AppArticleRespVO>(
    `/app-api/blog/other/snapshot/article/${param0}`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
