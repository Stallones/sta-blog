<template>
  <div class="menu-items">
    <div class="item" @click="searchStore.openDialog()">
      <span>
        <el-icon><Search /></el-icon>
        <span>搜索</span>
      </span>
    </div>

    <div class="item" @click="navigateTo('/')">
      <span>
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </span>
    </div>

    <div class="item">
      <span>
        <el-icon><Briefcase /></el-icon>
        <span>归档</span>
        <el-icon class="arrow"><ArrowDownBold /></el-icon>
      </span>
      <ul class="menus_item_child">
        <li @click="navigateTo('/category')">
          <span>
            <el-icon><DocumentCopy /></el-icon>
            <span>分类</span>
          </span>
        </li>
        <li @click="navigateTo('/tags')">
          <span>
            <el-icon><PriceTag /></el-icon>
            <span>标签</span>
          </span>
        </li>
        <li @click="navigateTo('/timeline')">
          <span>
            <el-icon><Clock /></el-icon>
            <span>时间轴</span>
          </span>
        </li>
      </ul>
    </div>

    <div class="item">
      <span>
        <el-icon><ChromeFilled /></el-icon>
        <span>页面</span>
        <el-icon class="arrow"><ArrowDownBold /></el-icon>
      </span>
      <ul class="menus_item_child">
        <li @click="navigateTo('/link')">
          <span>
            <el-icon><Link /></el-icon>
            <span>友链</span>
          </span>
        </li>
        <li @click="navigateTo('/tree-hole')">
          <span>
            <el-icon><Fries /></el-icon>
            <span>树洞</span>
          </span>
        </li>
        <li v-if="env.VITE_MUSIC_FRONTEND_URL" @click="navigateTo('/music')">
          <span>
            <el-icon><Headset /></el-icon>
            <span>音乐</span>
          </span>
        </li>
        <li @click="navigateTo('/photo')">
          <span>
            <el-icon><Picture /></el-icon>
            <span>相册</span>
          </span>
        </li>
      </ul>
    </div>

    <div class="item" @click="navigateTo('/message')">
      <span>
        <el-icon><Promotion /></el-icon>
        <span>留言</span>
      </span>
    </div>

    <div class="item" @click="navigateTo('/about')">
      <span>
        <el-icon><InfoFilled /></el-icon>
        <span>关于</span>
      </span>
    </div>

    <div
      v-if="isOnline && !userStore.isLoggedIn"
      class="item"
      @click="navigateTo('/user/login')"
    >
      <span>
        <el-icon><UserFilled /></el-icon>
        <span>登录</span>
      </span>
    </div>
    <div v-else-if="isOnline && userStore.isLoggedIn" class="item-user">
      <UserLogin />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  Briefcase,
  DocumentCopy,
  PriceTag,
  Clock,
  ChromeFilled,
  Link,
  Fries,
  Headset,
  Picture,
  Promotion,
  InfoFilled,
  ArrowDownBold,
  Search,
  UserFilled,
} from "@element-plus/icons-vue";
import router from "@/router";
import { useSearchStore } from "@/store/useSearchStore";
import { scrollToTop } from "@/utils/scroll";

import { useDemotion } from "@/composables/useDemotion";
import UserLogin from "./UserLogin.vue";
import { useUserStore } from "@/store/useUserStore.ts";
const { isOnline } = useDemotion();

const userStore = useUserStore();
const searchStore = useSearchStore();
const env = import.meta.env;
/** 导航跳转后平滑滚动到顶部 */
function navigateTo(path: string) {
  router.push(path);
  scrollToTop();
}
</script>

<style scoped lang="scss">
.menu-items {
  display: flex;
  height: 60%;
}

.item {
  display: flex;
  width: 80px;
  justify-content: center;
  position: relative;
  color: var(--text-primary);

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--accent-primary);
    transition: width 0.3s;
  }

  &:hover {
    cursor: pointer;

    span .arrow {
      transform: rotate(180deg);
      color: var(--accent-primary);
    }

    .menus_item_child {
      display: block;
    }

    &::before {
      width: 75%;
    }
  }

  .item-user {
    // display: flex;
    // width: 80px;
    // justify-content: center;
  }

  span {
    display: flex;
    align-items: center;
    gap: 1px;
  }

  span .arrow {
    margin-left: 1px;
    transition: all 0.5s;
    transform: rotate(0deg);
    color: var(--accent-primary);
  }
}

/* 已登录头像项：保留 80px 占位，去掉 hover 下划线 */
.user-item {
  cursor: default;

  &:hover::before {
    width: 0;
  }
}

.menus_item_child {
  display: none;
  position: absolute;
  top: 110%;
  left: 50%;
  width: 100px;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--surface-bg);

  border-radius: 5px;
  border: 1px solid var(--border-color);
  animation: slide-down 0.3s ease-out;

  /* 防止鼠标移出时菜单消失 */
  &::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    height: 8px;
  }

  li {
    display: flex;
    padding: 10px 14px;
    border-radius: 5px;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      cursor: pointer;
      background: var(--accent-primary);
      color: white;
    }
    html.dark &:hover {
      background: var(--accent-primary);
    }
  }

  @keyframes slide-down {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-6px);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
}
</style>
