import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";
import { readWebsiteInfo } from "@/utils/file-reader";
import { getWebsiteInfo } from "@/api/AppWebsiteInfoController";
import { useDemotion } from "@/composables/useDemotion";

// ==================== 静态站点配置（前端写死） ====================

const SITE_CONFIG = {
  webmasterAvatar: "https://avatars.githubusercontent.com/u/38835624?v=4",
  webmasterName: "Marcus",
  webmasterCopy:
    "专注于 Java 后端源码解析与技术分享，让每一行代码都有温度。",
  webmasterProfileBackground:
    "http://192.168.20.128:19000/blog/banners/6bb8aea3-f830-4f00-8503-aa1fd2149a3e.jpg",
  giteeLink: "https://gitee.com/zhijiantianya/ruoyi-vue-pro",
  githubLink: "https://github.com/YunaiV/ruoyi-vue-pro",
  headerNotification:
    "欢迎来到芋道源码 Blog！后端开发实战手册，持续更新中...",
  sidebarAnnouncement: "本站所有文章均为原创，如需转载请联系作者授权。",
  recordInfo: "粤ICP备xxxxxx号-1",
  /** 站点启动时间（写死） */
  startTime: 1704038400000,
} as const;

// ==================== 类型 ====================

/** 后端返回的纯统计字段 */
export interface SiteStats {
  articleCount?: number;
  commentCount?: number;
  messageCount?: number;
  likeCount?: number;
  favoriteCount?: number;
  categoryCount?: number;
  tagCount?: number;
  visitCount?: number;
  lastUpdateTime?: string;
}

/** 前端合并后的完整站点信息 */
export type SiteInfo = typeof SITE_CONFIG & {
  websiteName: string;
} & SiteStats;

// ==================== Store ====================

export const useSiteStore = defineStore("site", () => {
  const stats = shallowRef<SiteStats>();

  /** 合并静态配置 + 动态统计 */
  const webInfo = computed<SiteInfo | undefined>(() => {
    if (!stats.value) return undefined;
    return {
      ...SITE_CONFIG,
      websiteName: `${SITE_CONFIG.webmasterName} Blog`,
      ...stats.value,
    };
  });

  /** 获取全站统计（在线 API / 离线 snapshot） */
  const getInfo = async () => {
    const { requestOrRead } = useDemotion();
    const res = await requestOrRead(getWebsiteInfo, readWebsiteInfo);
    stats.value = (res?.data ?? undefined) as SiteStats | undefined;
  };

  return { webInfo, stats, getInfo };
});
