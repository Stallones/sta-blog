<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";

const websiteStore = useWebsiteStore()

// JSConfetti 懒加载，避免首屏打入 ~30KB
import('js-confetti').then(({ default: JSConfetti }) => {
  new JSConfetti().addConfetti()
})
</script>

<template>
  <div class="about-page">
    <div class="about-inner">
      <!-- 左侧：头像 + 名字 + 签名 -->
      <div class="profile-section">
        <div class="avatar-ring">
          <div
            class="avatar"
            :style="{ 'background-image': 'url(' + websiteStore.webInfo?.webmasterAvatar + ')' }"
          ></div>
        </div>
        <div class="name-wrap">
          <h1 :data-shadow='websiteStore.webInfo?.webmasterName'>{{ websiteStore.webInfo?.webmasterName }}</h1>
        </div>
        <div class="motto">
          人生如棋落子无悔道心稳固如箭离弦永不回头
        </div>
      </div>

      <!-- 右侧：介绍 + 导航 -->
      <div class="intro-section">
        <div class="intro-top">
          <div class="intro-title">
            一名中二Web全栈小白
          </div>
          <div class="intro-body">
            千年以前，看见元婴强者自己的小世界，非常羡慕，于是心中立誓，我也要变强，后抛弃世间情爱，终踏上修仙一途，虽一介散修，但亦往，经历千磨万难，
            炼气百年，四百年筑基，一千年结丹，两千年突破元婴，又一千年后遭遇瓶颈，决心闭死关，四千年后的今日，终于突破<span class="highlight"> 化神</span>，感叹回首沧桑，
            道不尽仙凡殊途，尽人间。
          </div>
        </div>
        <div class="nav-section">
          <div class="nav-divider">------------------------我的个人导航------------------------</div>
          <div class="nav-links">
            <a href="https://github.com/kuailemao" target="_blank">
              <div class="nav-card">
                <SvgIcon name="github_icon" width="100px" height="100px"/>
              </div>
            </a>
            <a href="https://gitee.com/kuailemao" target="_blank" class="nav-link--gitee">
              <div class="nav-card">
                <SvgIcon name="gitee_icon" width="100px" height="100px"/>
              </div>
            </a>
            <a href="https://space.bilibili.com/299105957" target="_blank">
              <div class="nav-card">
                <SvgIcon name="bilibili_icon" width="100px" height="100px"/>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Righteous);

$bp-lg: 1024px;
$bp-xl: 1280px;

/* ── 页面容器 ── */
.about-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99%;
  height: 100%;
}

.about-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  @media (min-width: $bp-xl) {
    width: 90%;
  }

  @media (max-width: $bp-lg) {
    flex-direction: column;
  }
}

/* ── 左侧：头像区域 ── */
.profile-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
  @include glass-card;
  padding: $padding-lg;
  box-sizing: border-box;

  @media (max-width: $bp-lg) {
    width: 100%;
    height: auto;
  }
}

.avatar-ring {
  width: 20rem;
  height: 20rem;
  margin-top: 5rem;
  border-radius: 50%;
  overflow: hidden;
  filter: drop-shadow(0 10px 15px hsla(0, 0%, 0%, 0.1));
}

.avatar {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.motto {
  width: 100%;
  font-weight: bold;
  text-align: center;
  color: var(--el-text-color-secondary);

  html.dark & {
    color: var(--el-text-color-primary);
  }
}

/* ── 右侧：介绍 + 导航 ── */
.intro-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  @include glass-card;
  padding: $padding-lg;
  box-sizing: border-box;

  @media (min-width: $bp-xl) {
    width: 40%;
  }

  @media (max-width: $bp-lg) {
    width: 100%;
    height: auto;
  }
}

.intro-top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
}

.intro-title {
  width: 100%;
  font-size: 3rem;
  text-align: center;
  color: var(--el-text-color-secondary);

  html.dark & {
    color: var(--el-text-color-primary);
  }

  @media (max-width: $bp-lg) {
    font-size: 2rem;
    padding-bottom: 1.5rem;
  }
}

.intro-body {
  margin-top: 1rem;
  text-align: center;
  color: var(--el-text-color-secondary);

  html.dark & {
    color: var(--el-text-color-primary);
  }

  @media (max-width: $bp-lg) {
    padding: 0 0.75rem;
  }
}

.highlight {
  color: hsl(0, 84%, 60%);
  font-weight: bold;
}

/* ── 导航链接 ── */
.nav-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40vh;
}

.nav-divider {
  color: var(--el-text-color-secondary);

  html.dark & {
    color: var(--el-text-color-primary);
  }
}

.nav-links {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav-link--gitee {
  margin: 0 2.5rem;

  @media (max-width: $bp-lg) {
    margin: 0 1rem;
  }
}

.nav-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  @include glass-card;
}

/* ── Glitch 文字效果 ── */
:deep(.author) {
  display: flex;
  align-items: center;
}

*, *:before, *:after {
  box-sizing: border-box;
  position: relative;
}

h1 {
  display: inline-block;
  color: white;
  font-family: 'Righteous', serif;
  font-size: 10em;
  text-shadow: .03em .03em 0 hsla(230,40%,50%,1);
}
h1:after {
  content: attr(data-shadow);
  position: absolute;
  top: .06em; left: 0.06em;
  z-index: -1;
  text-shadow: none;
  background-image:
      linear-gradient(
              45deg,
              transparent 45%,
              hsla(48,20%,90%,1) 45%,
              hsla(48,20%,90%,1) 55%,
              transparent 0
      );
  background-size: .05em .05em;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: shad-anim 15s linear infinite;
}

@keyframes shad-anim {
  0% {background-position: 0 0}
  0% {background-position: 100% -100%}
}
</style>
