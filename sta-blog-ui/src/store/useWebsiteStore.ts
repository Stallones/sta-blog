import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { readWebsiteInfo } from "@/utils/file-reader";
import { getWebsiteInfo } from "@/api/AppWebsiteInfoController";
import { getArticleListByCreateTime } from "@/api/AppArticleController";
import type { ApiResponse } from "@/types";

export const useWebsiteStore = defineStore("website", () => {
  const webInfo = shallowRef<API.AppWebsiteInfoRespVO>();
  const searchTitle = shallowRef<API.AppArticleRespVO[]>();

  const getInfo = async (
    requestOrRead: <T, Args extends any[]>(
      requestFn: (...args: Args) => Promise<T>,
      readFn: (...args: Args) => Promise<ApiResponse<T>>,
      ...args: Args
    ) => Promise<ApiResponse<T>>
  ) => {
    const res = await requestOrRead(getWebsiteInfo, readWebsiteInfo);
    webInfo.value = res.data as API.AppWebsiteInfoRespVO;
  };

  const getArticleTitleList = async () => {
    const res = await getArticleListByCreateTime();
    searchTitle.value = res as API.AppArticleRespVO[];
  };

  return { webInfo, getInfo, searchTitle, getArticleTitleList };
});
