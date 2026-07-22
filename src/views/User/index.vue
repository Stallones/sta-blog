<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { beforeLoginPath } from "@/router";

const router = useRouter();
const route = useRoute();

function goBack() {
  const redirect = route.query.redirect as string;
  router.push(redirect || beforeLoginPath.value || "/");
}
</script>

<template>
  <div class="auth-shell">
    <button class="auth-back" @click="goBack">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      返回
    </button>
    <div class="auth-card" v-slide-in>
      <router-view v-slot="{ Component }">
        <transition name="auth-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-shell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem 1rem;
}

.auth-back {
  position: fixed;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: 1px solid var(--surface-border);
  border-radius: 20px;
  background: var(--surface-bg);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-inner-bg);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
}

.auth-card {
  @include surface-card;
  width: 420px;
  max-width: 100%;
  padding: 2.5rem 2rem;
  box-sizing: border-box;
}

/* ── 页面切换过渡 ── */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── 移动端 ── */
@media screen and (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.25rem;
  }
}
</style>
