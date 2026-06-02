<template>
  <div class="layout-shell">
    <Header
      :headerType="meta.headerType"
      :title="meta.title || ''"
      :subtitle="meta.subtitle || ''"
    />
    <!-- 主内容区 -->
    <main class="layout-main">
      <div v-if="meta.showWrapper"  class="main-wrapper">
        <div class="main-content">
          <router-view v-slot="{ Component, route: r }">
            <transition name="el-fade-in-linear" mode="out-in">
              <div :key="r.fullPath">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </div>

        <!-- 侧边栏：根据 sidebarType 动态渲染 -->
        <div class="main-sidebar" v-if="meta.sidebarType">
          <SideBar v-if="meta.sidebarType === 'default'" />
          <ArticleSideBar v-if="meta.sidebarType === 'article'" />
        </div>
      </div>

      <div v-else>
        <router-view v-slot="{ Component, route: r }">
          <transition name="el-fade-in-linear" mode="out-in">
            <div :key="r.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
      
    </main>

    <!-- Footer -->
    <Footer v-if="meta.showFooter" />

    <!-- 全局唯一的 FloatingMenu -->
    <FloatingMenu />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header/index.vue";
import SideBar from "@/components/SideBar/index.vue";
// import ArticleSideBar from "@/components/SideBar/ArticleSideBar.vue";
import FloatingMenu from "@/components/FloatingMenu/index.vue";
import { registerGlobalItems } from "@/components/FloatingMenu/registerGlobal";
import Footer from "@/components/Footer/index.vue";

const route = useRoute();

const meta = computed(() => ({
  headerType: (route.meta.headerType as string) || "none",
  sidebarType: (route.meta.sidebarType as string) || "none",
  showWrapper: route.meta.showWrapper ?? true,
  showFooter: (route.meta.showFooter as boolean) ?? true,
  title: (route.meta.title as string) || "",
  subtitle: (route.meta.subtitle as string) || "",
}));

// 注册全局功能项
onMounted(() => {
  registerGlobalItems();
});
</script>

<style scoped lang="scss">
@use "../../styles/_layout" as *;

/*
 * 布局架构（参考 Butterfly 主题）
 * 
 * 桌面端:
 * ┌──────────────────────────────────────────────┐
 * │                  Header                       │
 * ├────────────────────────┬─────────────────────┤
 * │                        │                     │
 * │     main-content 74%   │  main-sidebar 26%   │
 * │     (max-width:1036px) │  (max-width:364px)  │
 * │                        │                     │
 * ├────────────────────────┴─────────────────────┤
 * │                  Footer                       │
 * └──────────────────────────────────────────────┘
 * 
 * 移动端 (≤#{$bp-tablet}px):
 * ┌──────────────────┐
 * │     Header       │
 * ├──────────────────┤
 * │  main-content    │  ← 单列，100% 宽度
 * ├──────────────────┤
 * │  main-sidebar    │  ← 单列，100% 宽度（堆叠到底部）
 * ├──────────────────┤
 * │     Footer       │
 * └──────────────────┘
 */

.layout-shell {
  // min-height: 100vh;
  overflow-x: hidden;

  .layout-main {
    display: flex;
    justify-content: center;
    width: 100%;

    // 默认桌面间距
    padding: $pad-desktop;

    @include mobile {
      padding: $pad-mobile;
    }
  }

  /* ════════ 主容器：content + sidebar 并排/堆叠 ════════ */
  .main-wrapper {
    display: flex;
    width: 100%;
    gap: $gap-desktop;
    justify-content: center;
    box-sizing: border-box;
    max-width: $layout-max-w;

    // ── Tier-3: 宽屏平板 → 填满可用宽度 ──
    @include wide-tablet {
      max-width: none;
    }

    // ── Tier-1+2: 单列堆叠 ──
    @include tablet-down($breakpoint: $bp-tablet) {
      flex-direction: column;
      gap: $gap-tablet;
      max-width: none;

      .main-content,
      .main-sidebar {
        flex: none;
        width: 100%;
        max-width: 100%;
        min-width: 0;
      }
    }

    // ── Tier-1: 手机更紧凑 ──
    @include mobile {
      gap: $gap-mobile;
    }
  }

  /* ════════ 主内容区 74% ════════ */
  .main-content {
    flex: 0 0 $content-ratio;
    max-width: $content-max-w;
    padding: $card-pad;
    border-radius: $card-radius;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    min-width: 0;
    overflow-x: hidden;

    // ── 宽屏平板及以下：跟随容器等比缩放 ──
    @include tablet-down($breakpoint: $bp-desktop) {
      max-width: 100%;
      flex: 0 0 $content-ratio; // 保持百分比不变
    }

    // ── 单列时全宽 + 紧凑内边距 ──
    @include tablet-down($breakpoint: $bp-tablet) {
      max-width: 100%;
      padding: $card-pad-mobile;
      border-radius: $card-radius-mobile;
    }
  }

  /* ════════ 侧边栏 26% ════════ */
  .main-sidebar {
    flex: 0 0 $sidebar-ratio;
    max-width: $sidebar-max-w;
    min-width: 0; // 允许收缩，与 content 同步压缩
    padding: $card-pad;
    border-radius: $card-radius;
    box-sizing: border-box;

    // ── 宽屏平板及以下：跟随容器等比缩放 ──
    @include tablet-down($breakpoint: $bp-desktop) {
      max-width: 100%;
      flex: 0 0 $sidebar-ratio; // 保持百分比不变
    }

    // ── 单列时全宽 + 紧凑内边距 ──
    @include tablet-down($breakpoint: $bp-tablet) {
      flex: none;
      max-width: 100%;
      padding: $card-pad-mobile;
    }

    // ── 手机更紧凑 ──
    @include mobile {
      padding: $card-pad-mobile;
    }
  }
}
</style>
