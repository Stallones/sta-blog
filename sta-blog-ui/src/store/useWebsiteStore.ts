import { defineStore } from "pinia";
import { shallowRef } from "vue";
import WebsiteInfo from "@/apis/website/type.ts";
import { returnTime } from "@/utils/tool.ts";
import { ArticleSearch } from "@/apis/article/type.ts";
import { readWebsiteInfo } from "@/utils/file-reader";
import { getWebsiteInfo } from "@/apis/website";
import { getSearchTitleList } from "@/apis/article";
import type { ApiResponse } from "@/types";

export const useWebsiteStore = defineStore("website", () => {
  const webInfo = shallowRef<WebsiteInfo>();
  // 标题搜索数据
  const searchTitle = shallowRef<Array<ArticleSearch>>();

  // 获取网站信息（调用方需传入 requestOrRead）
  const getInfo = async (
    requestOrRead: <T, Args extends any[]>(
      requestFn: (...args: Args) => Promise<ApiResponse<T>>,
      readFn: (...args: Args) => Promise<ApiResponse<T>>,
      ...args: Args
    ) => Promise<ApiResponse<T>>
  ) => {
    const res = await requestOrRead(getWebsiteInfo, readWebsiteInfo);
    res.data.lastUpdateTime = returnTime(res.data.lastUpdateTime) as string;
    webInfo.value = res.data;
  };

  // 获取网站文章标题搜索数据
  const getArticleTitleList = async () => {
    const res = await getSearchTitleList();
    searchTitle.value = res.data;
  };

  return {
    webInfo,
    getInfo,
    searchTitle,
    getArticleTitleList,
  };
});


