/**
 * 离线数据读取模块
 *
 * 从 public/static-data/ 读取构建时生成的快照数据。
 * 返回格式统一为 ApiResponse<T>，与 requestOrRead 在线解包后的格式一致。
 */
import type { ApiResponse } from "@/types";

// ==================== 内部：快照缓存 ====================

interface SnapshotData {
  websiteInfo: API.AppWebsiteInfoRespVO;
  articles: any[];
  categories: any[];
  tags: any[];
  images: any[];
}

let snapshotCache: SnapshotData | null = null;

async function loadSnapshot(): Promise<SnapshotData> {
  if (!snapshotCache) {
    const res = await fetch("/static-data/snapshot.json");
    if (!res.ok) throw new Error("snapshot.json 加载失败");
    snapshotCache = (await res.json()) as SnapshotData;
  }
  return snapshotCache;
}

function wrap<T>(data: T): ApiResponse<T> {
  return { code: 0, msg: "success", data };
}

// ==================== 导出函数 ====================

/** 读取网站信息（离线） */
export async function readWebsiteInfo(): Promise<ApiResponse<API.AppWebsiteInfoRespVO>> {
  try {
    const s = await loadSnapshot();
    return wrap(s.websiteInfo);
  } catch {
    return { code: 500, msg: "读取失败", data: null as any };
  }
}

/** 读取文章详情 - 从独立 JSON 文件按需加载 content，与 snapshot 元数据合并（离线） */
export async function readArticleDetail(id: string): Promise<ApiResponse<any>> {
  try {
    // 1. 加载 {id, content} 最简文件
    const res = await fetch(`/static-data/articles/${id}.json`);
    if (!res.ok) throw new Error("文章不存在");
    const articleFile = await res.json();

    // 2. 从 snapshot 获取元数据
    const s = await loadSnapshot();
    const meta = s.articles.find((a: any) => a.id === Number(id));
    if (!meta) throw new Error("snapshot 中无此文章元数据");

    // 3. 合并：snapshot 元数据 + content 全文
    return wrap({ ...meta, content: articleFile.content || "" });
  } catch {
    return { code: 500, msg: "读取失败", data: null as any };
  }
}

/** 读取文章分页（离线） */
export async function readArticlePage(params: { pageNo: number; pageSize: number; summaryLength?: number }) {
  try {
    const s = await loadSnapshot();
    const { pageNo, pageSize, summaryLength } = params;
    const start = (pageNo - 1) * pageSize;
    const end = start + pageSize;
    // snapshot.articles 按时间排序（后端 getArticleListByStatus 返回顺序）
    let list = s.articles.slice(start, end);
    // 支持瀑布流模式的不同摘要长度截断
    if (summaryLength && summaryLength > 0) {
      list = list.map((a: any) => ({
        ...a,
        summary: (a.summary || "").slice(0, summaryLength),
      }));
    }
    return wrap({ list, total: s.articles.length });
  } catch {
    return { code: 500, msg: "读取失败", data: null as any };
  }
}

/** 读取分类列表（离线） */
export async function readCategoryList(): Promise<ApiResponse<any[]>> {
  try {
    const s = await loadSnapshot();
    return wrap(s.categories);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取标签列表（离线） */
export async function readTagList(): Promise<ApiResponse<any[]>> {
  try {
    const s = await loadSnapshot();
    return wrap(s.tags);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取轮播图列表（离线） - 从 images 中筛选 type=52 */
export async function readBanners(): Promise<ApiResponse<any[]>> {
  try {
    const s = await loadSnapshot();
    const banners = s.images.filter((img: any) => img.type === 52);
    return wrap(banners);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取时间轴数据（离线） - 使用文章列表（仅含元数据） */
export async function readTimeLine(): Promise<ApiResponse<any[]>> {
  try {
    const s = await loadSnapshot();
    return wrap(s.articles);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取分类下的文章列表（离线） */
export async function readArticleListByCategory(params: { categoryId: number }) {
  try {
    const s = await loadSnapshot();
    const list = s.articles.filter((a: any) => a.categoryId === params.categoryId);
    return wrap(list);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取标签下的文章列表（离线） */
export async function readArticleListByTag(params: { tagId: number }) {
  try {
    const s = await loadSnapshot();
    const list = s.articles.filter((a: any) => {
      const tagIds: number[] = a.tagIds || [];
      return tagIds.includes(params.tagId);
    });
    return wrap(list);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取推荐文章（离线） - 按 viewCount 降序取前 N 篇 */
export async function readArticleListByVisitCount(params?: { limit?: number }) {
  try {
    const s = await loadSnapshot();
    const limit = params?.limit || 5;
    const list = [...s.articles]
      .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
    return wrap(list);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 读取同分类相关文章（离线） */
export async function readArticleListByCategoryId(params: { categoryId: number; articleId: number }) {
  try {
    const s = await loadSnapshot();
    const list = s.articles.filter(
      (a: any) => a.categoryId === params.categoryId && a.id !== params.articleId
    );
    return wrap(list);
  } catch {
    return { code: 500, msg: "读取失败", data: [] };
  }
}

/** 搜索本地文章（离线搜索）- 支持关键词匹配或 ID 列表 */
export async function searchLocalArticles(input: string | number[]) {
  try {
    const s = await loadSnapshot();
    if (!s.articles) return { list: [] };

    // ID 列表模式（pagefind 搜索结果）
    if (Array.isArray(input)) {
      const list = s.articles.filter((a: any) => input.includes(a.id));
      return { list, total: list.length };
    }

    // 关键词匹配模式
    const keyword = input;
    const list = s.articles.filter(
      (a: any) =>
        (a.title || "").includes(keyword) || (a.summary || "").includes(keyword)
    );
    return { list, total: list.length };
  } catch {
    return { list: [], total: 0 };
  }
}
