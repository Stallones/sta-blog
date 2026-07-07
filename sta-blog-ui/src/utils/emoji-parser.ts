import { heo } from "@/utils/O.o/heo";

/**
 * 将文本中的 [表情名] 转换为 <img> 标签
 * 保护代码块 ```...``` 不被误替换
 */
export function parseHeoEmoji(value: string): string {
  if (!value) return "";

  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = value.match(codeBlockRegex);
  let protectedValue = value;

  // 1. 保护代码块
  if (codeBlocks) {
    codeBlocks.forEach((block, index) => {
      protectedValue = protectedValue.replace(block, `{{CODE_BLOCK_${index}}}`);
    });
  }

  // 2. 替换 [表情名]
  const matches = protectedValue.match(/\[[^\]]+\]/g);
  if (matches) {
    for (const match of matches) {
      if (heo[match]) {
        protectedValue = protectedValue.replace(
          match,
          `<span><img src="${heo[match]}" width="24" height="24" alt="emoji" /></span>`
        );
      }
    }
  }

  // 3. 还原代码块
  if (codeBlocks) {
    codeBlocks.forEach((block, index) => {
      protectedValue = protectedValue.replace(`{{CODE_BLOCK_${index}}}`, block);
    });
  }

  return protectedValue;
}
