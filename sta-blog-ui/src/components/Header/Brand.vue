<template>
  <div id="brand" class="h-f-brand">
    <div class="brand-text">
      <!-- 标题 Glitch -->
      <GlitchText :text="useWebsite?.webInfo?.websiteName || ''" font-size="3rem" />
      <!-- 打字机（渐变色 + 自动获取鸡汤） -->
      <div class="typewriter">
        <GradientText :text="output" :mode="'static'" class="title" />
      </div>
    </div>
    <!-- <Wave></Wave> -->
    <!-- 向下按钮 -->
    <div class="brand-button" @click="scrollDown">
      <SvgIcon class="arrow-down" name="jt_x" width="50px" height="50px" />
      <div class="button-ripple"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { onMounted, onUnmounted } from "vue";
import { GlitchText, GradientText, useTypewriter } from "@/components/TextTech";

const useWebsite = useWebsiteStore();

// 打字机 — URL 模式自动获取一言
const { output, start, stop } = useTypewriter({
  url: import.meta.env.VITE_YIYAN_API || "https://v1.hitokoto.cn/?c=a&encode=json",
  speed: 120,
  backSpeed: 60,
  type: "rollback",
  sleep: 4000,
  showCursor: false,
});

onMounted(() => start());
onUnmounted(() => stop());

const scrollDown = () => {
  window.scrollTo({
    behavior: "smooth",
    top: document.documentElement.clientHeight,
  });
};
</script>

<style lang="scss" scoped>

.h-f-brand {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  // width: 100%; /* 冗余：block 元素自动撑满 */
  height: 100%;
  // min-height: 10rem;
  color: var(--header-text-color);
}

.brand-text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: -1;
  top: 15em;

  .typewriter{
    background: hsla(0, 0%, 100%, 0.5);
    padding: 0.5em;
    border-radius: 0.5em;
  }

  .title {
    letter-spacing: 0.1em;
    font-weight: 700;
    font-size: 1.5rem;
    @media (max-width: 500px) {
      font-size: 1em;
    }
  }
}

.brand-button {
  position: absolute;
  bottom: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 8;
}

.arrow-down {
  -webkit-animation: arrow-shake 1.5s ease-out infinite;
  animation: arrow-shake 1.5s ease-out infinite;
  z-index: 9;
  position: relative;
}

.button-ripple {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(90deg, hsl(30, 92%, 59%), hsl(12, 87%, 59%), hsl(336, 80%, 62%), hsl(280, 39%, 55%), hsl(218, 39%, 52%), hsl(186, 83%, 37%), hsl(167, 90%, 37%), hsl(137, 42%, 58%));
  background-size: 300% 300%;
  animation: gradientAnimation 4s ease infinite, ripple 2s ease-out infinite;
  opacity: 0.7;
  z-index: 8;
}

@media (max-width: 767px) {
  .brand-text {
    padding: 3rem 0.5rem 0;
  }
}

@media (min-width: 760px) {
  .title {
    font-size: 1.5rem;
  }
}

@keyframes arrow-shake {
  0% { opacity: 1; transform: translateY(0); }
  30% { opacity: 0.5; transform: translateY(25px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}
</style>
