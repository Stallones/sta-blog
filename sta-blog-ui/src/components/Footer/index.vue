<script setup lang="ts">
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useRouter } from "vue-router";

const router = useRouter();
const useWebsite = useWebsiteStore();

// ── footer-flex 导航数据 ──
interface FooterColumn {
  title: string;
  items: { label: string; to?: string; href?: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "归档",
    items: [
      { label: "分类", to: "/category" },
      { label: "标签", to: "/tags" },
      { label: "时间轴", to: "/timeline" },
    ],
  },
  {
    title: "页面",
    items: [
      { label: "首页", to: "/" },
      { label: "树洞", to: "/tree-hole" },
      { label: "音乐", to: "/music" },
      { label: "相册", to: "/photo" },
    ],
  },
  {
    title: "其他",
    items: [
      { label: "留言板", to: "/message" },
      { label: "友链", to: "/link" },
      { label: "关于", to: "/about" },
    ],
  },
  {
    title: "框架",
    items: [
      { label: "Vue.js", href: "https://cn.vuejs.org/" },
      { label: "Pinia", href: "https://pinia.vuejs.org/zh/" },
      { label: "Element Plus", href: "https://element-plus.org/zh-CN/" },
      { label: "Vite", href: "https://cn.vitejs.dev/" },
      { label: "TypeScript", href: "https://www.typescriptlang.org/zh/" },
    ],
  },
];

function navigate(item: FooterColumn["items"][0]) {
  if (item.to) router.push(item.to);
  else if (item.href) window.open(item.href, "_blank");
}
</script>

<template>
  <footer class="footer">
    <!-- footer-flex：4列导航 -->
    <div class="footer-flex">
      <div v-for="col in columns" :key="col.title" class="footer-col">
        <h3 class="col-title">{{ col.title }}</h3>
        <ul class="col-list">
          <li
            v-for="item in col.items"
            :key="item.label"
            @click="navigate(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
    <!-- footer-others：版权 + 备案 -->
    <div class="footer-others">
      &copy; {{ new Date().getFullYear() }}
      {{ useWebsite.webInfo?.websiteName }} &nbsp;|&nbsp; 备案号：<a
        href="https://beian.miit.gov.cn"
        >{{ useWebsite.webInfo?.recordInfo }}</a
      >
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use "../../styles/_layout" as *;

$footer-max-width: 1200px;

.footer {
  position: relative;
  width: 100%;
  // height: 300px;
  overflow: hidden;
  // 同 header 背景图
  background-image: url("@/assets/images/forest.jpg");
  background-size: cover;
  background-position: center;

  // 半透明遮罩层：保证文字可读性（与截图效果一致）
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: hsla(0, 0%, 0%, 0.55);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

// ── 上半：4列导航 ──
.footer-flex {
  display: flex;
  text-align: center;
  gap: 15px;
  max-width: $footer-max-width;
  margin: 0 auto;
  padding: 30px;

  .footer-col {
    flex: 1;
    min-width: 120px;

    .col-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: hsla(0, 0%, 100%, 0.9);
      margin-bottom: 0.8rem;
      letter-spacing: 0.05em;
    }

    .col-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        color: hsla(0, 0%, 100%, 0.6);
        font-size: 1rem;
        padding: 3px 0;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--mao-accent);
        }
      }
    }
  }
}

// ── 下半：版权信息 ──
.footer-others {
  margin: 0 auto;
  text-align: center;
  color: hsla(0, 0%, 100%, 0.7);
  font-size: 1em;
  border-top: 1px solid hsla(0, 0%, 100%, 0.1);
  padding: 15px 0px;

  a {
    color: hsla(0, 0%, 100%, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--mao-accent);
    }
  }
}

// ════════ 响应式（引用统一断点变量）════════

// ── Tier-2: ≤tablet → 2列 ──
@include tablet-down($breakpoint: $bp-tablet) {
  .footer-flex {
    flex-wrap: wrap;
    gap: 16px;
    padding: 24px 15px 12px;

    .footer-col {
      min-width: unset;
    }
  }
}

// ── Tier-1: ≤mobile → 单列手机布局 ──
@include mobile {
  .footer-flex {
  }

  .footer-others {
  }
}
</style>
