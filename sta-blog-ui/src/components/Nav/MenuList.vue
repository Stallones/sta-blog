<template>
  <div class="menus_items">
    <div class="menus_item" @click="router.push('/')">
      <span>
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </span>
    </div>

    <div class="menus_item">
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

    <div class="menus_item">
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

    <div class="menus_item">
      <span>
        <el-icon><Promotion /></el-icon>
        <span>留言</span>
        <el-icon class="arrow"><ArrowDownBold /></el-icon>
      </span>
      <ul class="menus_item_child">
        <li @click="router.push('/tree-hole')">
          <span>
            <el-icon><Fries /></el-icon>
            <span>树洞</span>
          </span>
        </li>
        <li @click="router.push('/message')">
          <span>
            <el-icon><Postcard /></el-icon>
            <span>留言板</span>
          </span>
        </li>
      </ul>
    </div>

    <div class="menus_item" @click="router.push('/about')">
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
  Headset,
  Picture,
  Promotion,
  Fries,
  Postcard,
  InfoFilled,
  ArrowDownBold,
} from "@element-plus/icons-vue";
import router from "@/router";

const env = import.meta.env;
</script>

<style scoped lang="scss">
.menus_items {
  display: flex;
  align-self: stretch;
  flex-shrink: 0; // 锁死不压缩
}

.menus_item {
  width: 85px;
  height: auto;
  position: relative;
  flex: 0 0 auto; // 不伸缩，保持固有宽度
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 0 0.6rem; // 固定内边距
  white-space: nowrap; // 文字不换行
  min-width: unset;

  &::before {
    content: "";
    position: absolute;
    bottom: 5px;
    height: 2px;
    width: 0;
    background-color: var(--mao-accent);
    transition: width 0.3s;
  }

  &:hover {
    cursor: pointer;

    span .arrow {
      transform: rotate(180deg);
      color: var(--mao-accent);
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
    gap: 5px;
  }

  span .arrow {
    margin-left: 1px;
    transition: all 0.5s;
    transform: rotate(0deg);
    color: var(--mao-accent);
  }
}

.menus_item_child {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  width: 100px;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--mao-card-bg);
  box-shadow: 0 2px 12px 0 var(--shadow-color);
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
      background: var(--mao-accent);
      color: white;
    }
    html.dark &:hover {
      background: var(--mao-accent);
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
