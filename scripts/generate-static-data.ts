/**
 * 静态数据生成脚本
 * 从后端快照接口获取全站数据，生成到 public/static-data/ 目录
 *
 * 用法: npx tsx scripts/generate-static-data.ts
 * 环境变量:
 *   BLOG_API_BASE_URL - 后端地址 (默认 http://127.0.0.1:48080)
 *   BLOG_SNAPSHOT_KEY - 快照密钥 (默认 sta-blog-snapshot-2026)
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ==================== 配置 ====================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const API_BASE_URL = (process.env.BLOG_API_BASE_URL || "http://127.0.0.1:48080").trim();
const SNAPSHOT_KEY = process.env.BLOG_SNAPSHOT_KEY || "sta-blog-snapshot-2026";
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "static-data");
const ARTICLES_DIR = path.join(OUTPUT_DIR, "articles");

// ==================== 工具函数 ====================

interface ApiResult<T> {
  code: number;
  msg: string;
  data: T;
}

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResult<T>;
  if (json.code !== 0) throw new Error(`API error: ${json.msg} (code=${json.code})`);
  return json.data;
}

interface SnapshotData {
  websiteInfo: any;
  articles: Array<{ id: number; title: string; [key: string]: any }>;
  categories: any[];
  tags: any[];
  images: any[];
  links: any[];
}

interface ArticleFull {
  id: number;
  content: string;
  [key: string]: any;
}

// ==================== 主流程 ====================

async function main(): Promise<void> {
  console.log("=== 开始生成静态数据 ===");
  console.log(`API: ${API_BASE_URL}`);
  console.log(`输出: ${OUTPUT_DIR}\n`);

  // 确保目录存在
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  // 清理旧 articles 目录（避免残留已删除文章）
  const existingFiles = fs.readdirSync(ARTICLES_DIR);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(ARTICLES_DIR, file));
  }

  // 1. 获取全站快照
  console.log("正在获取全站快照...");
  const snapshot = await fetchApi<SnapshotData>(
    `${API_BASE_URL}/app-api/blog/website-info/snapshot?key=${SNAPSHOT_KEY}`
  );

  console.log(`  网站统计: ${snapshot.websiteInfo?.articleCount ?? 0} 篇文章`);
  console.log(`  文章: ${snapshot.articles?.length || 0} 篇`);
  console.log(`  分类: ${snapshot.categories?.length || 0} 个`);
  console.log(`  标签: ${snapshot.tags?.length || 0} 个`);
  console.log(`  图片: ${snapshot.images?.length || 0} 张`);
  console.log(`  友链: ${snapshot.links?.length || 0} 个`);

  // 保存 snapshot.json
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "snapshot.json"),
    JSON.stringify(snapshot, null, 2)
  );
  console.log("  snapshot.json 已生成");

  // 2. 逐篇获取文章全文，只保存 {id, content}（最简模式）
  console.log(`\n正在获取文章全文 (${snapshot.articles.length} 篇)...`);
  let successCount = 0;
  let failCount = 0;

  for (const article of snapshot.articles) {
    try {
      const full = await fetchApi<ArticleFull>(
        `${API_BASE_URL}/app-api/blog/website-info/snapshot-article/${article.id}?key=${SNAPSHOT_KEY}`
      );
      // 只保留 id + content，其余元数据已在 snapshot.json 中
      fs.writeFileSync(
        path.join(ARTICLES_DIR, `${article.id}.json`),
        JSON.stringify({ id: article.id, content: full.content || "" }, null, 2)
      );
      successCount++;
    } catch (error: any) {
      console.warn(`  [WARN] 文章 ${article.id} 获取失败: ${error.message}`);
      failCount++;
    }
  }

  console.log(`  完成: ${successCount} 成功, ${failCount} 失败`);

  // 3. 清理旧目录（历史遗留）
  const oldDirs = ["public/apis", "public/articles"];
  for (const dir of oldDirs) {
    const oldPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(oldPath)) {
      console.log(`\n清理旧目录: ${dir}/`);
      fs.rmSync(oldPath, { recursive: true, force: true });
    }
  }

  console.log("\n=== 静态数据生成完成 ===");
}

main().catch((err) => {
  console.error("\n脚本执行失败:", err.message);
  process.exit(1);
});
