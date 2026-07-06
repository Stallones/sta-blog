import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { readWebsiteInfo } from "@/utils/file-reader";
import { getWebsiteInfo } from "@/api/AppWebsiteInfoController";
import { getArticleListByCreateTime } from "@/api/AppArticleController";
import { useDemotion } from "@/composables/useDemotion";

export const useWebsiteStore = defineStore("website", () => {
  const webInfo = shallowRef<API.AppWebsiteInfoRespVO>();
  const searchTitle = shallowRef<API.AppArticleRespVO[]>();

  const getInfo = async () => {
    const { requestOrRead } = useDemotion();
    const res = await requestOrRead(getWebsiteInfo, readWebsiteInfo);
    webInfo.value = (res?.data ?? undefined) as API.AppWebsiteInfoRespVO | undefined;
  };

  const getArticleTitleList = async () => {
    const res = await getArticleListByCreateTime();
    searchTitle.value = res as API.AppArticleRespVO[];
  };

  return { webInfo, getInfo, searchTitle, getArticleTitleList };
});
