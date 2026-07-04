import type { ApiResponse } from "@/types";

export interface ArticleVO {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  coverPath: string;
  content: string;
  summary: string;
  wordCount: number;
  visitCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  tagIds: number[];
  tagNames: string[];
  createTime: string;
}

export function localResponse<T>(path: string): Promise<T> {
  // 本地离线数据读取（用于 PWA/离线场景）
  return fetch(path).then(r => r.json()) as Promise<T>;
}

// 读取文章详情（离线）
export async function readArticleDetail(id: string): Promise<ApiResponse<ArticleVO>> {
  try {
    const data = await localResponse<ArticleVO>("/articles/" + id + ".json");
    return { code: 200, msg: "success", data };
  } catch {
    return { code: 500, msg: "读取失败", data: null as any };
  }
}

// 读取网站信息（离线）
export async function readWebsiteInfo(): Promise<API.AppWebsiteInfoRespVO | null> {
  try {
    return await localResponse<API.AppWebsiteInfoRespVO>("/apis/website-info");
  } catch {
    return null;
  }
}

// 读取分类列表（离线）
export async function readCategoryList() {
  try {
    return await localResponse<any[]>("/apis/categories.json");
  } catch {
    return [];
  }
}

// 读取标签列表（离线）
export async function readTagList() {
  try {
    return await localResponse<any[]>("/apis/tags.json");
  } catch {
    return [];
  }
}

// 读取轮播图列表（离线）
export async function readBanners() {
  try {
    return await localResponse<any[]>("/apis/banners.json");
  } catch {
    return [];
  }
}

// 读取时间轴数据（离线）
export async function readTimeLine() {
  try {
    return await localResponse<any[]>("/apis/timeline.json");
  } catch {
    return [];
  }
}

// 读取文章分页（离线）
export async function readArticlePage(params: { pageNo: number; pageSize: number }) {
  const { pageNo, pageSize } = params;
  try {
    return await localResponse<any>(`/apis/article-page-${pageNo}-${pageSize}.json`);
  } catch {
    return null;
  }
}

// 搜索本地文章（离线搜索）
export async function searchLocalArticles(keyword: string) {
  try {
    const all = await localResponse<any[]>("/apis/articles.json");
    if (!all) return [];
    return all.filter((a: any) =>
      (a.title || '').includes(keyword) || (a.summary || '').includes(keyword)
    );
  } catch {
    return [];
  }
}
