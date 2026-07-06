import { computed } from "vue";
import { useRoute } from "vue-router";
import { dayjs } from "element-plus";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useUserStore } from "@/store/useUserStore";

/**
 * 用户卡片数据结构
 */
export interface UserCardData {
  /** 头像 URL */
  avatar: string;
  /** 名称（博主名 / 用户昵称） */
  name: string;
  /** 描述文案 */
  description: string;
  /** 统计信息 */
  stats: { label: string; value: number | string }[];
  /** 社交链接 */
  links: { icon: string; url?: string }[];
  /** 是否为当前登录用户 */
  isUser: boolean;
}

/**
 * 共享用户/博主卡片数据 composable
 *
 * 根据当前路由与登录状态，自动切换数据源：
 * - `/setting` 且已登录 → 返回登录用户信息（从 useUserStore）
 * - 其他情况 → 返回博主信息（从 useWebsiteStore）
 */
export function useUserCard() {
  const route = useRoute();
  const userStore = useUserStore();
  const websiteStore = useWebsiteStore();

  const isSettingUser = computed(
    () => route.path === "/setting" && userStore.isLoggedIn
  );

  const cardData = computed<UserCardData>(() => {
    if (isSettingUser.value && userStore.userInfo) {
      const u = userStore.userInfo;
      return {
        avatar: u.avatar || "",
        name: u.nickname || "用户",
        description: u.email || "",
        stats: [
          { label: "性别", value: formatSex(u.sex) },
          ...(u.createTime
            ? [{ label: "注册时间", value: formatDate(u.createTime) }]
            : []),
        ],
        links: [],
        isUser: true,
      };
    }

    // 默认：博主信息（Pinia 自动解包 shallowRef）
    const w = websiteStore.webInfo;
    return {
      avatar: w?.webmasterAvatar || "",
      name: w?.webmasterName || "博主",
      description: w?.webmasterCopy || "",
      stats: [
        { label: "文章", value: w?.articleCount ?? 0 },
        { label: "分类", value: w?.categoryCount ?? 0 },
        { label: "评论", value: w?.commentCount ?? 0 },
      ],
      links: [
        ...(w?.githubLink ? [{ icon: "github_icon", url: w.githubLink }] : []),
        ...(w?.giteeLink ? [{ icon: "gitee_icon", url: w.giteeLink }] : []),
      ],
      isUser: false,
    };
  });

  return { cardData, isSettingUser };
}

// ========== 内部工具函数 ==========

function formatSex(sex?: number): string {
  if (sex === 1) return "男";
  if (sex === 2) return "女";
  return "保密";
}

function formatDate(dateStr: string | number): string {
  if (!dateStr && dateStr !== 0) return "";
  return dayjs(dateStr).format("YYYY-MM-DD");
}
