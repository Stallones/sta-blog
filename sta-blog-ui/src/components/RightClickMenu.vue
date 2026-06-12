<template>
  <div
    v-if="isVisible"
    class="context-menu"
    :style="{
      top: `${y}px`,
      left: `${x}px`
    }"
  >
    <div class="menu-container">
      <div class="menu-header">
        <div class="menu-title-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <span class="menu-title-text">{{ useWebsite.webInfo?.websiteName }}</span>
      </div>

      <ul class="menu-items">
        <!-- 首页 -->
        <li class="menu-item" @click="navigateTo('/')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span>首页</span>
        </li>

        <!-- 归档 ▾ -->
        <li class="menu-item has-submenu">
          <div class="menu-item-content">
            <div class="menu-item-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span>归档</span>
            <div class="menu-item-arrow">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          <ul class="submenu">
            <li class="submenu-item" @click.stop="navigateTo('/category')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span>分类</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/tags')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <span>标签</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/timeline')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span>时间轴</span>
            </li>
          </ul>
        </li>

        <!-- 页面 ▾ -->
        <li class="menu-item has-submenu">
          <div class="menu-item-content">
            <div class="menu-item-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <span>页面</span>
            <div class="menu-item-arrow">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          <ul class="submenu">
            <li class="submenu-item" @click.stop="navigateTo('/link')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <span>友链</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/music')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
              <span>音乐</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/photo')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <span>相册</span>
            </li>
          </ul>
        </li>

        <!-- 留言 ▾ -->
        <li class="menu-item has-submenu">
          <div class="menu-item-content">
            <div class="menu-item-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <span>留言</span>
            <div class="menu-item-arrow">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          <ul class="submenu">
            <li class="submenu-item" @click.stop="navigateTo('/tree-hole')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <span>树洞</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/message')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span>留言板</span>
            </li>
          </ul>
        </li>

        <!-- 关于 -->
        <li class="menu-item" @click="navigateTo('/about')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <span>关于</span>
        </li>

        <li class="menu-divider"></li>

        <!-- 刷新页面 -->
        <li class="menu-item refresh-item" @click="handleRefresh">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </div>
          <span>刷新页面</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useWebsiteStore } from "@/store/useWebsiteStore";

const useWebsite = useWebsiteStore()

const router = useRouter();
const isVisible = ref(false);
const x = ref(0);
const y = ref(0);

const showMenu = (event: MouseEvent) => {
  event.preventDefault();

  const menuWidth = 240;
  const submenuWidth = 180;
  const menuHeight = 370;

  let posX = event.clientX;
  let posY = event.clientY;

  if (posX + menuWidth + submenuWidth > window.innerWidth) {
    posX = Math.max(10, window.innerWidth - menuWidth - 10);
  }

  if (posY + menuHeight > window.innerHeight) {
    posY = Math.max(10, window.innerHeight - menuHeight - 10);
  }

  x.value = posX;
  y.value = posY;
  isVisible.value = true;

  setTimeout(() => {
    document.querySelectorAll('.has-submenu').forEach(item => {
      item.classList.remove('active');
    });
  }, 50);

  nextTick(() => {
    adjustSubmenuPositions();
  });
};

const adjustSubmenuPositions = () => {
  document.querySelectorAll('.submenu').forEach(submenu => {
    const submenuEl = submenu as HTMLElement;
    const parentItem = submenuEl.closest('.has-submenu') as HTMLElement;

    submenuEl.style.left = '100%';
    submenuEl.style.right = 'auto';
    submenuEl.style.top = '0';

    setTimeout(() => {
      const rect = submenuEl.getBoundingClientRect();
      const parentRect = parentItem.getBoundingClientRect();

      if (rect.right > window.innerWidth) {
        submenuEl.style.left = 'auto';
        submenuEl.style.right = '100%';
      }

      if (rect.bottom > window.innerHeight) {
        let newTop = 0;
        const availableTopSpace = parentRect.top;
        const availableBottomSpace = window.innerHeight - parentRect.bottom;

        if (rect.height > availableBottomSpace && availableTopSpace > availableBottomSpace) {
          newTop = -rect.height + parentRect.height;
        } else {
          const overflowHeight = Math.min(rect.bottom - window.innerHeight, rect.height - parentRect.height);
          newTop = -overflowHeight;
        }

        submenuEl.style.top = `${newTop}px`;
      }
    }, 0);
  });
};

const hideMenu = () => {
  isVisible.value = false;
};

const navigateTo = (path: string) => {
  router.push(path);
  hideMenu();
};

const handleRefresh = () => {
  window.location.reload();
  hideMenu();
};

const handleClick = (event: MouseEvent) => {
  const contextMenu = document.querySelector('.context-menu');
  if (isVisible.value && contextMenu && !contextMenu.contains(event.target as Node)) {
    hideMenu();
  }
};

const handleSubmenuActivation = (event: Event) => {
  const target = event.currentTarget as HTMLElement;
  const parentLi = target.closest('.has-submenu') as HTMLElement;
  const hasSubmenuElements = document.querySelectorAll('.has-submenu');

  hasSubmenuElements.forEach(el => {
    if (el !== parentLi) {
      el.classList.remove('active');
    }
  });

  parentLi.classList.toggle('active');
  event.stopPropagation();
};

onMounted(() => {
  document.addEventListener('contextmenu', showMenu);
  document.addEventListener('click', handleClick);
  window.addEventListener('resize', adjustSubmenuPositions);
});

onUnmounted(() => {
  document.removeEventListener('contextmenu', showMenu);
  document.removeEventListener('click', handleClick);
  window.removeEventListener('resize', adjustSubmenuPositions);
});
</script>

<style scoped lang="scss">
/* ── 右键菜单专用色（主题关联，抽取到 CSS 变量由 theme.scss 管理） ── */
.context-menu {
  position: fixed;
  z-index: 10000;
  user-select: none;
  animation: fadeIn 0.2s ease-out;
  filter: drop-shadow(0 4px 20px hsla(0, 0%, 0%, 0.15));

  /* 主题色变量 — 统一用 hsl */
  --menu-icon-color: hsl(258, 64%, 61%);          /* 亮色：紫 #8b5cf6 */
  --menu-icon-hover: hsl(296, 84%, 55%);          /* 亮色悬停：品红 #d946ef */
  --menu-hover-bg: hsl(260, 100%, 97%);           /* 亮色悬停背景 */
  --menu-submenu-border: hsl(260, 100%, 96%);     /* 亮色子菜单边框 */
  --menu-refresh-from: hsl(258, 64%, 61%);        /* 刷新按钮渐变起 */
  --menu-refresh-to: hsl(330, 81%, 60%);          /* 刷新按钮渐变止 */
  --menu-refresh-hover-from: hsl(258, 64%, 75%);  /* 刷新悬停渐变起 */
  --menu-refresh-hover-to: hsl(330, 88%, 73%);    /* 刷新悬停渐变止 */
}

html.dark .context-menu {
  --menu-icon-color: hsl(258, 44%, 72%);          /* 暗色：浅紫 #a78bfa */
  --menu-icon-hover: hsl(296, 80%, 72%);          /* 暗色悬停 */
  --menu-hover-bg: hsl(260, 25%, 25%);            /* 暗色悬停背景 */
  --menu-submenu-border: var(--border-color-light);
  --menu-refresh-from: hsl(258, 44%, 72%);
  --menu-refresh-to: hsl(330, 81%, 60%);
  --menu-refresh-hover-from: hsl(258, 55%, 80%);
  --menu-refresh-hover-to: hsl(330, 88%, 73%);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.menu-container {
  background-color: var(--mao-context-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px hsla(258, 64%, 61%, 0.15);
  border: 1px solid var(--border-color-light);
  min-width: 240px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: var(--text-secondary);
  position: relative;
  transition: all 0.2s ease;
  animation: slideIn 0.2s ease;
  overflow: visible !important;
}

html.dark .menu-container {
  color: var(--text-primary);
  box-shadow: 0 4px 20px hsla(0, 0%, 0%, 0.3);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--mao-context-divider);
  background: var(--mao-context-header-bg);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  margin-bottom: 1px;
}

.menu-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  color: var(--menu-icon-color);
  animation: pulse 2s infinite;
}

.menu-title-text {
  color: var(--menu-icon-color);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.menu-items {
  list-style: none;
  margin: 0;
  padding: 10px;
}

.menu-divider {
  height: 1px;
  margin: 10px 0;
  background: var(--mao-context-divider);
}

.menu-item {
  position: relative;
  font-size: 0.9rem;
  margin: 4px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible !important;
  display: block;
}

.menu-item:not(.has-submenu) {
  display: flex;
  align-items: center;
  padding: 10px 14px;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  width: 100%;
  border-radius: 10px;
}

.has-submenu {
  position: relative;
  overflow: visible !important;
}

.menu-item:hover, .menu-item-content:hover {
  background-color: var(--menu-hover-bg);
  transform: translateX(2px);
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.1);
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 18px;
  height: 18px;
  color: var(--menu-icon-color);
  transition: transform 0.3s;
}

.menu-item:hover .menu-item-icon {
  transform: scale(1.15) rotate(8deg);
  color: var(--menu-icon-hover);
}

.menu-item-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: all 0.2s;
  stroke-width: 2;
}

.menu-item span {
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.menu-item-arrow {
  margin-left: auto;
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

.has-submenu:hover .menu-item-arrow {
  transform: rotate(90deg);
}

.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background-color: var(--mao-context-bg);
  border-radius: 12px;
  box-shadow: 0 4px 16px hsla(258, 64%, 61%, 0.12);
  border: 1px solid var(--menu-submenu-border);
  min-width: 180px;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  z-index: 1000;
  padding: 8px;
}

html.dark .submenu {
  box-shadow: 0 4px 16px hsla(0, 0%, 0%, 0.3);
}

.has-submenu:hover > .submenu {
  visibility: visible;
  opacity: 1;
  transform: translateX(0);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  border-radius: 8px;
  margin: 3px 0;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: var(--menu-hover-bg);
  transform: translateX(2px);
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.1);
}

.submenu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 16px;
  height: 16px;
  color: var(--menu-icon-color);
}

.submenu-item-icon svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

.submenu-item:hover .submenu-item-icon {
  color: var(--menu-icon-hover);
}

/* 刷新按钮 */
.refresh-item {
  margin: 6px 8px;
  background: linear-gradient(135deg, var(--menu-refresh-from), var(--menu-refresh-to));
  box-shadow: 0 3px 12px hsla(258, 64%, 61%, 0.2);
  color: hsl(0, 0%, 100%);
  transition: all 0.2s ease;
  border: none;
  border-radius: 8px;
}

.refresh-item:hover {
  background: linear-gradient(135deg, var(--menu-refresh-hover-from), var(--menu-refresh-hover-to));
  box-shadow: 0 5px 15px hsla(258, 64%, 61%, 0.4), 0 2px 5px hsla(330, 81%, 60%, 0.3);
  transform: translateY(-2px) translateX(2px);
}

.refresh-item .menu-item-icon svg {
  stroke: hsl(0, 0%, 100%);
}

.refresh-item span {
  color: hsl(0, 0%, 100%);
  font-weight: 600;
  text-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
}
</style>
