<template>
  <div class="user-login">
    <!-- 未登录 -->
    <div v-if="!userStore.userInfo" class="not-logged">
      <el-tooltip class="box-item" effect="light" content="点击去登录" placement="right">
        <el-avatar @click="$router.push('/login')" style="cursor: pointer">登录</el-avatar>
      </el-tooltip>
    </div>

    <!-- 已登录 -->
    <div v-else class="logged-in">
      <div class="profile">
        <div class="profile-username">{{ userStore.userInfo?.nickname }}</div>
        <div class="profile-email" v-if="userStore.userInfo?.email">
          {{ userStore.userInfo?.email }}
        </div>
      </div>
      <el-dropdown placement="bottom-end">
        <el-avatar style="cursor: pointer" :src="userStore.userInfo?.avatar" />
        <template #dropdown>
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
  </div>
</template>

<script setup lang="ts">
import { Setting, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { logout } from '@/api/AppBlogAuthController'
import { REMOVE_TOKEN } from '@/utils/auth'
import { useUserStore } from '@/store/useUserStore'
import router from '@/router'

const userStore = useUserStore()

const logoutSub = async () => {
  await logout()
  REMOVE_TOKEN()
  userStore.userInfo = undefined
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped lang="scss">
.user-login {
  display: flex;
  align-items: center;

  .not-logged {
    display: flex;
    align-items: center;
  }

  .logged-in {
    display: flex;
    align-items: center;
  }
}

.profile {
  margin-right: 0.8rem;

  .profile-username {
    font-size: 15px;
    font-weight: bold;
    color: var(--el-text-color-primary);

    html.dark & {
      color: #e5e7eb;
    }
  }

  .profile-email {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 2px;

    html.dark & {
      color: #9ca3af;
    }
  }
}
</style>
