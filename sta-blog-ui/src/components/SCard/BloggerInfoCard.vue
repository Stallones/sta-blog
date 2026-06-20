<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";

const useWebsite = useWebsiteStore();
</script>

<template>
  <div class="blogger-info-card" v-slide-in>
    <!-- <div
      class="background-image"
      :style="`background-image: url(${useWebsite.webInfo?.webmasterProfileBackground})`"
    ></div> -->
    <div class="blogger-avatar">
      <el-avatar size="large" :src="useWebsite.webInfo?.webmasterAvatar" />
    </div>

    <div class="blogger-name">
      {{ useWebsite.webInfo?.webmasterName }}
      <!-- <GradientText :text="useWebsite.webInfo?.webmasterName" :mode="'static'"/> -->
      <div class="title-decorator">
        <span class="line"></span>
        <span class="dot"></span>
        <span class="line"></span>
      </div>
    </div>
    <div class="blogger-copy">
      <el-tooltip
        :content="useWebsite.webInfo?.webmasterCopy"
        placement="bottom"
        :show-after="500"
      >
        <span>{{ useWebsite.webInfo?.webmasterCopy }}</span>
      </el-tooltip>
    </div>
    <div class="blogger-total">
      <div class="quantity-item">
        <span class="number">{{ useWebsite.webInfo?.articleCount }}</span>
        <span class="label">文章</span>
      </div>
      <div class="divider"></div>
      <div class="quantity-item">
        <span class="number">{{ useWebsite.webInfo?.categoryCount }}</span>
        <span class="label">分类</span>
      </div>
      <div class="divider"></div>
      <div class="quantity-item">
        <span class="number">{{ useWebsite.webInfo?.commentCount }}</span>
        <span class="label">评论</span>
      </div>
    </div>
    <div class="blogger-icon">
      <a :href="useWebsite.webInfo?.githubLink" target="_blank">
        <div class="icon-wrapper">
          <SvgIcon name="github_icon" width="20px" height="20px" />
        </div>
      </a>
      <a :href="useWebsite.webInfo?.giteeLink" target="_blank">
        <div class="icon-wrapper">
          <SvgIcon name="gitee_icon" width="20px" height="20px" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blogger-info-card {
  box-sizing: border-box;
  min-height: 300px;
  margin-bottom: $margin-bottom;
  border-radius: $border-radius;
  text-align: center;
  background: var(--el-fill-color-blank);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--el-box-shadow-light);
  display: flex;
  flex-direction: column;

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 67%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      background: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0.2) 0%,
        var(--el-fill-color-blank) 100%
      );
    }
  }

  &:hover {
  }

  > * {
    position: relative;
    z-index: 2;
  }

  .blogger-avatar {
    margin-top: 30px;

    .el-avatar {
      width: 90px;
      height: 90px;
      border: 3px solid var(--el-color-white);
      box-shadow: 0 0 20px hsla(0, 0%, 0%, 0.1);
      transition: all 0.6s ease;
    }

    &:hover .el-avatar {
      transform: rotate(360deg) scale(1.1);
    }
  }

  .blogger-name {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 15px 0 10px;
    color: var(--el-text-color-primary);
    padding: 0 20px;

    .title-decorator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;

      .line {
        height: 1px;
        width: 15px;
        background: var(--el-border-color);
        transition: all 0.3s ease;
      }

      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--el-color-primary);
        margin: 0 4px;
      }
    }

    &:hover .title-decorator {
      .line {
        width: 40px;
        background: var(--el-color-primary);
      }
    }
  }

  .blogger-copy {
    color: var(--el-text-color-secondary);
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
      color: var(--el-color-primary-light-5);
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
        color: var(--el-text-color-primary);
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
    // background: var(--el-fill-color-lighter);
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
        color: var(--el-text-color-primary);
        margin-bottom: 5px;
      }

      .label {
        font-size: 0.9rem;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
      }
    }

    .divider {
      width: 1px;
      height: 25px;
      background: linear-gradient(
        to bottom,
        transparent,
        var(--el-border-color) 20%,
        var(--el-border-color) 80%,
        transparent
      );
      margin: 0 5px;
      align-self: center;
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
      background: var(--el-fill-color-light);
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-fill-color);
        transform: translateY(-2px);
      }

      :deep(svg) {
        fill: var(--el-text-color-primary);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .info_container {
    width: 100%;
    margin: 10px 0;

    .quantity_container {
      padding: 12px 15px;

      .quantity-item {
        padding: 0 5px;

        .number {
          font-size: 1.1rem;
        }

        .label {
          font-size: 0.8rem;
        }
      }

      .divider {
        height: 20px;
      }
    }

    .webmaster-name {
      font-size: 1.2rem;

      .title-decorator .line {
        width: 12px;
      }
    }

    .webmaster-copy {
      font-size: 0.9rem;
      padding: 0 20px;
    }
  }
}
</style>
