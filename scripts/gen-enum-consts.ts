/**
 * gen-enum-consts.ts
 *
 * 从 OpenAPI JSON 的 components/schemas 中读取命名的枚举 Schema
 * （后端 BlogWebConfiguration 已注册 TypeEnum、ArchiveTypeEnum），
 * 根据 x-enum-varnames / x-enum-descriptions 自动生成 src/const/index.ts。
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const OPENAPI_URL = 'http://localhost:48080/v3/api-docs/blog-app';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/const/index.ts');

// 需要生成的枚举：schemaName → constName
const ENUM_DEFS: Record<string, string> = {
  TypeEnum: 'BlogType',
  ArchiveTypeEnum: 'ArchiveType',
};

const PRESERVED = `// Jwt 前缀常量
export const JWT_PREFIX_CONS = 'Bearer ';

// Token 名称常量（命名空间化，避免与 vben admin、ruoyi 系统用户冲突）
export const TOKEN_KEY = 'sta-blog-app-token';

// 文章访问量统计 前缀常量
export const ARTICLE_VISIT_PREFIX = 'article_visit_';
`;

interface SchemaObj {
  type?: string;
  enum?: (string | number)[];
  'x-enum-varnames'?: string[];
  'x-enum-descriptions'?: string[];
}

function toConstKey(name: string): string {
  return name.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
}

function generateConstCode(name: string, values: (string | number)[], varnames: string[], descs: string[]): string {
  const lines = [`export const ${name} = {`];
  for (let i = 0; i < varnames.length; i++) {
    const key = toConstKey(varnames[i]);
    const val = typeof values[i] === 'string' ? `'${values[i]}'` : String(values[i]);
    lines.push(`  /** ${descs[i] || ''} */`, `  ${key}: ${val},`);
  }
  lines.push('} as const;');
  return lines.join('\n');
}

async function main() {
  console.log('Fetching OpenAPI spec...');
  const res = await fetch(OPENAPI_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const doc = await res.json() as any;

  const schemas = doc?.components?.schemas;
  if (!schemas) throw new Error('No components.schemas found');

  const generated: string[] = [];
  for (const [schemaName, constName] of Object.entries(ENUM_DEFS)) {
    const s: SchemaObj = schemas[schemaName];
    if (!s) { console.warn(`  ${schemaName} not found, skipping`); continue; }
    if (!s.enum || !s['x-enum-varnames'] || !s['x-enum-descriptions']) {
      console.error(`  ${schemaName} missing enum/x-enum extensions`);
      continue;
    }
    console.log(`  Generating ${constName} (${s['x-enum-varnames'].length} values)...`);
    generated.push(generateConstCode(constName, s.enum, s['x-enum-varnames'], s['x-enum-descriptions']));
  }

  if (generated.length === 0) throw new Error('No enum schemas found');

  const header = '// 由 scripts/gen-enum-consts.ts 自动生成，请勿手动修改\n// 基于后端 OpenAPI 枚举元数据（x-enum-varnames / x-enum-descriptions）\n\n';
  const output = header + generated.join('\n\n') + '\n\n' + PRESERVED + '\n';

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log(`\nDone: ${OUTPUT_PATH}`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
