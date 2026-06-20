<template>
  <div class="menu-items">
    <div class="item" @click="searchStore.openDialog()">
      <span>
         <el-icon><Search /></el-icon>
        <span>搜索</span>
      </span>
    </div>

    <div class="item" @click="router.push('/')">
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
        <li @click="router.push('/category')">
          <span>
            <el-icon><DocumentCopy /></el-icon>
            <span>分类</span>
          </span>
        </li>
        <li @click="router.push('/tags')">
          <span>
            <el-icon><PriceTag /></el-icon>
            <span>标签</span>
          </span>
        </li>
        <li @click="router.push('/timeline')">
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
        <li @click="router.push('/link')">
          <span>
            <el-icon><Link /></el-icon>
            <span>友链</span>
          </span>
        </li>
        <li @click="router.push('/tree-hole')">
          <span>
            <el-icon><Fries /></el-icon>
            <span>树洞</span>
          </span>
        </li>
        <li v-if="env.VITE_MUSIC_FRONTEND_URL" @click="router.push('/music')">
          <span>
            <el-icon><Headset /></el-icon>
            <span>音乐</span>
          </span>
        </li>
        <li @click="router.push('/photo')">
          <span>
            <el-icon><Picture /></el-icon>
            <span>相册</span>
          </span>
        </li>
      </ul>
    </div>

    <div class="item" @click="router.push('/message')">
      <span>
        <el-icon><Promotion /></el-icon>
        <span>留言</span>
      </span>
    </div>

    <div class="item" @click="router.push('/about')">
      <span>
        <el-icon><InfoFilled /></el-icon>
        <span>关于</span>
      </span>
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
  Search
} from "@element-plus/icons-vue";
import router from "@/router";
import { useSearchStore } from "@/store/useSearchStore";

const searchStore = useSearchStore();
const env = import.meta.env;
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
  color: var(--el-text-color-primary);

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--el-color-primary);
    transition: width 0.3s;
  }

  &:hover {
    cursor: pointer;

    span .arrow {
      transform: rotate(180deg);
      color: var(--el-color-primary);
    }

    .menus_item_child {
      display: block;
    }

    &::before {
      width: 75%;
    }
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
    color: var(--el-color-primary);
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
  background: var(--el-fill-color-blank);

  border-radius: 5px;
  border: 1px solid var(--el-border-color);
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
      background: var(--el-color-primary);
      color: white;
    }
    html.dark &:hover {
      background: var(--el-color-primary);
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
