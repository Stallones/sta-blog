/**
 * Pagefind 索引生成脚本（合并 dev + build）
 *
 * 数据源：
 *   - public/static-data/snapshot.json  → 文章 id + title
 *   - public/static-data/articles/{id}.json → content
 *
 * 用法:
 *   node scripts/generate-pagefind.mjs --dev     → 输出到 src/pagefind/（开发时）
 *   node scripts/generate-pagefind.mjs           → 输出到 dist/pagefind/（构建时）
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createIndex, close } from "pagefind";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const SNAPSHOT_JSON = join(PROJECT_ROOT, "public/static-data/snapshot.json");
const ARTICLES_DIR = join(PROJECT_ROOT, "public/static-data/articles");

const isDev = process.argv.includes("--dev");
const OUTPUT_PATH = join(PROJECT_ROOT, isDev ? "src/pagefind" : "dist/pagefind");
const LABEL = isDev ? "Dev" : "Build";

/**
 * 基础的 Markdown → 纯文本 剥离
 */
function stripMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^---+\s*$/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function main() {
  console.log(`[Pagefind ${LABEL}] 读取 snapshot.json...`);

  if (!existsSync(SNAPSHOT_JSON)) {
    console.error(`[Pagefind ${LABEL}] ❌ snapshot.json 不存在，请先运行 generate:data`);
    process.exit(1);
  }

  const snapshot = JSON.parse(readFileSync(SNAPSHOT_JSON, "utf-8"));
  const articles = snapshot.articles || [];
  console.log(`[Pagefind ${LABEL}] 共 ${articles.length} 篇文章`);

  const { index } = await createIndex();

  let indexed = 0;
  for (const article of articles) {
    const { id, title } = article;
    const articlePath = join(ARTICLES_DIR, `${id}.json`);

    if (!existsSync(articlePath)) {
      console.warn(`[WARN] articles/${id}.json 不存在，跳过`);
      continue;
    }

    const articleRaw = readFileSync(articlePath, "utf-8");
    const articleData = JSON.parse(articleRaw);
    const content = stripMarkdown(articleData.content || "");

    if (!content && !title) {
      console.warn(`[WARN] 文章 ${id} 内容为空，跳过`);
      continue;
    }

    await index.addCustomRecord({
      url: `/article/${id}`,
      content: `${title}\n${content}`,
      language: "zh",
      meta: {
        title: title,
      },
    });
    indexed++;
  }

  await index.writeFiles({ outputPath: OUTPUT_PATH });
  await close();
  console.log(`[Pagefind ${LABEL}] ✅ 索引已生成到 ${OUTPUT_PATH}（${indexed} 篇）`);
}

main().catch((err) => {
  console.error(`[Pagefind ${LABEL}] ❌ 失败:`, err);
  process.exit(1);
});
