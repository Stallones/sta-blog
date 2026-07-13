<script setup lang="ts">
import { useUserCard } from "@/composables/useUserCard";
import { avatarFallbackStyle, fallbackChar } from "@/utils/avatar";

const { cardData, isSettingUser } = useUserCard();
</script>

<template>
  <div class="blogger-info-card" v-slide-in>
    <!-- 博主模式：头像区域 -->
    <template v-if="!isSettingUser">
      <div class="blogger-avatar">
        <img
          v-if="cardData.avatar"
          :src="cardData.avatar"
          class="avatar-img"
        />
        <div
          v-else
          class="avatar-img fallback"
          :style="avatarFallbackStyle(cardData.name)"
        >
          {{ fallbackChar(cardData.name) }}
        </div>
      </div>

      <div class="blogger-name">
        {{ cardData.name }}
        <div class="title-decorator">
          <span class="line"></span>
          <span class="dot"></span>
          <span class="line"></span>
        </div>
      </div>

      <div class="blogger-copy">
        <el-tooltip
          :content="cardData.description"
          placement="bottom"
          :show-after="500"
        >
          <span>{{ cardData.description }}</span>
        </el-tooltip>
      </div>

      <div class="blogger-total">
        <div
          class="quantity-item"
          v-for="stat in cardData.stats"
          :key="stat.label"
        >
          <span class="number">{{ stat.value }}</span>
          <span class="label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="blogger-icon">
        <a
          v-for="link in cardData.links"
          :key="link.icon"
          :href="link.url"
          target="_blank"
        >
          <div class="icon-wrapper">
            <SvgIcon :name="link.icon" width="20px" height="20px" />
          </div>
        </a>
      </div>
    </template>

    <!-- 用户模式（/setting 侧边栏）：用户信息卡片 -->
    <template v-else>
      <div class="user-card-content">
        <div class="user-avatar-section">
          <img
            v-if="cardData.avatar"
            :src="cardData.avatar"
            class="user-avatar-img"
          />
          <div
            v-else
            class="user-avatar-img fallback"
            :style="avatarFallbackStyle(cardData.name)"
          >
            {{ fallbackChar(cardData.name) }}
          </div>
        </div>

        <div class="user-name">{{ cardData.name }}</div>

        <div class="user-description" v-if="cardData.description">
          {{ cardData.description }}
        </div>

        <el-divider style="margin: 12px 0" />

        <div class="user-stats">
          <div
            class="stat-row"
            v-for="stat in cardData.stats"
            :key="stat.label"
          >
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value">{{ stat.value }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.blogger-info-card {
  box-sizing: border-box;
  min-height: 300px;
  margin-bottom: $margin-bottom;
  border-radius: $border-radius;
  text-align: center;
  background: var(--surface-bg);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--surface-shadow);
  backdrop-filter: var(--surface-blur);
  display: flex;
  flex-direction: column;

  // &:hover {
  //   box-shadow: var(--el-box-shadow-medium);
  // }

  > * {
    position: relative;
    z-index: 2;
  }

  /* ── 博主模式 ── */
  .blogger-avatar {
    margin-top: 30px;
  }

  .avatar-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--color-white);
    box-shadow: 0 0 20px hsla(0, 0%, 0%, 0.1);
    transition: all 0.6s ease;
    display: inline-block;

    &.fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 600;
      user-select: none;
    }
  }

  .blogger-avatar:hover .avatar-img {
    transform: rotate(360deg) scale(1.1);
  }

  .blogger-name {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 15px 0 10px;
    color: var(--text-primary);
    padding: 0 20px;

    .title-decorator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;

      .line {
        height: 1px;
        width: 15px;
        background: var(--border-color);
        transition: all 0.3s ease;
      }

      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent-primary);
        margin: 0 4px;
      }
    }

    &:hover .title-decorator {
      .line {
        width: 40px;
        background: var(--accent-primary);
      }
    }
  }

  .blogger-copy {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
    padding: 0 25px;
    margin-bottom: 20px;
    position: relative;

    &::before,
    &::after {
      content: '"';
      position: absolute;
      font-size: 1.2em;
      color: var(--color-blue-200);
      opacity: 0.6;
    }

    &::before {
      left: 10px;
      top: -5px;
    }

    &::after {
      right: 10px;
      bottom: -15px;
    }

    span {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-style: italic;

      &:hover {
        color: var(--text-primary);
        transition: color 0.3s ease;
      }
    }
  }

  .blogger-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 20px;
    margin-top: auto;

    .quantity-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      padding: 0 10px;

      .number {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 5px;
      }

      .label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        white-space: nowrap;
      }
    }
  }

  .blogger-icon {
    display: flex;
    justify-content: center;
    padding: 15px 0;
    gap: 15px;

    .icon-wrapper {
      padding: 8px;
      border-radius: 50%;
      background: var(--fill-color-light);
      transition: all 0.3s ease;

      &:hover {
        background: var(--fill-color);
        transform: translateY(-2px);
      }

      :deep(svg) {
        fill: var(--text-primary);
      }
    }
  }

  /* ── 用户模式（/setting 侧边栏）── */
  .user-card-content {
    padding: 30px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user-avatar-section {
    margin-bottom: 12px;
  }

  .user-avatar-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--color-white);
    box-shadow: 0 2px 12px hsla(0, 0%, 0%, 0.1);
    display: inline-block;

    &.fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 600;
      user-select: none;
    }
  }

  .user-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .user-description {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .user-stats {
    width: 100%;
    padding: 0 10px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 0.9rem;

    .stat-label {
      color: var(--text-secondary);
    }

    .stat-value {
      color: var(--text-primary);
      font-weight: 500;
    }
  }
}

@media screen and (max-width: 768px) {
  .blogger-avatar .avatar-img {
    width: 70px;
    height: 70px;
  }

  .blogger-name {
    font-size: 1.2rem;
  }

  .blogger-copy {
    font-size: 0.9rem;
    padding: 0 20px;
  }

  .blogger-total .quantity-item {
    .number {
      font-size: 1.1rem;
    }
    .label {
      font-size: 0.8rem;
    }
  }
}
</style>
