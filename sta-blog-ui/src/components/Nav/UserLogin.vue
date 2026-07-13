<template>
  <div class="user-login">
    <!-- 已登录：仅显示头像，点击展开下拉菜单 -->
    <el-dropdown v-if="hasUserData" placement="bottom-end" trigger="click">
      <div class="avatar-trigger">
        <!-- 有头像时显示图片 -->
        <img
          v-if="userStore.userInfo?.avatar"
          :src="userStore.userInfo.avatar"
          class="user-avatar"
        />
        <!-- 无头像时回退：HSL 色块 + 首字符 -->
        <div v-else class="avatar-fallback" :style="fallbackStyle">
          {{ avatarFallbackChar }}
        </div>
      </div>
      <template #dropdown>
        <!-- 用户信息卡片 -->
        <div class="dropdown-user-card">
          <!-- 头像 -->
          <img
            v-if="userStore.userInfo?.avatar"
            :src="userStore.userInfo.avatar"
            class="dropdown-avatar"
          />
          <div v-else class="dropdown-avatar fallback" :style="fallbackStyle">
            {{ avatarFallbackChar }}
          </div>
          <!-- 昵称 -->
          <div class="dropdown-name">{{ userStore.userInfo?.nickname }}</div>
          <!-- 邮箱 -->
          <div class="dropdown-email" v-if="userStore.userInfo?.email">
            {{ userStore.userInfo?.email }}
          </div>
        </div>
        <el-divider style="margin: 6px 0" />
        <el-dropdown-item @click="router.push('/setting')">
          <el-icon><Setting /></el-icon>
          个人设置
        </el-dropdown-item>
        <el-dropdown-item @click="logoutSub">
          <el-icon><Promotion /></el-icon>
          退出登录
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Setting, Promotion } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { logout } from "@/api/AppBlogAuthController";
import { useUserStore } from "@/store/useUserStore";
import { useAccessStore } from "@/store/useAccessStore";
import { avatarFallbackStyle, fallbackChar } from "@/utils/avatar";
import router from "@/router";

const userStore = useUserStore();
const accessStore = useAccessStore();

/** 有用户信息且已登录才显示头像 */
const hasUserData = computed(() => !!(userStore.userInfo && accessStore.accessToken));

const fallbackStyle = computed(() => {
  const nickname = userStore.userInfo?.nickname || "用户";
  return avatarFallbackStyle(nickname);
});

const avatarFallbackChar = computed(() => {
  return fallbackChar(userStore.userInfo?.nickname || "用户");
});

const logoutSub = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await logout();
      } catch {
        // 即使后端登出失败也清除本地登录态
      }
      userStore.clearUser();
      ElMessage.success("已退出登录");
      router.push("/");
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.user-login {
  display: flex;
  align-items: center;
}

/* ── 未登录：匹配 MenuList 导航项 ── */
.item {
  display: flex;
  width: 80px;
  justify-content: center;
  position: relative;
  color: var(--text-primary);
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--accent-primary);
    transition: width 0.3s;
  }

  &:hover {
    &::before {
      width: 75%;
    }
  }

  span {
    display: flex;
    align-items: center;
    gap: 1px;
  }
}

/* ── 已登录：头像触发器 ── */
.logged-in {
  display: flex;
  align-items: center;
}

.avatar-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.12);
  border: 2px solid transparent;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--accent-primary);
  }
}

.avatar-fallback {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.12);
}

/* ── 下拉菜单用户卡片 ── */
.dropdown-user-card {
  padding: 16px 20px 8px;
  text-align: center;
  min-width: 180px;
}

.dropdown-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;

  &.fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    user-select: none;
  }
}

.dropdown-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.dropdown-email {
  font-size: 12px;
  color: var(--text-secondary);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
