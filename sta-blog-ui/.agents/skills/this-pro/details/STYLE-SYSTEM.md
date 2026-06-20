# Style System — CSS 变量·布局引擎·Z-Index·断点·动画

> 最后更新：2026-06-20（基于最新源码）

---

## 1. CSS 变量体系 (`styles/theme.scss`)

### 语义变量（:root / html.dark 双值）

| 变量 | 亮色值 | 暗色值 | 用途 |
|------|--------|--------|------|
| `--mao-blue` | `hsl(217,91%,60%)` | 同 | 品牌蓝 |
| `--mao-orange` | `hsl(25,95%,53%)` | 同 | 品牌橙 |
| `--mao-accent` | `var(--mao-blue)` | `var(--mao-orange)` | **强调色**（亮蓝/暗橙切换） |
| `--mao-accent-gradient` | `linear-gradient(蓝→紫)` | `linear-gradient(蓝→紫, 暗)` | 强调渐变 |
| `--mao-nav-bg` | `hsla(0,0%,100%,0.5)` | `hsla(0,0%,0%,0.5)` | 导航栏毛玻璃背景 |
| `--mao-nav-border-transparent` | `hsla(0,0%,100%,0.33)` | 同 | 导航透明边框 |
| `--mao-fm-btn-color` | `var(--el-color-primary)` | `var(--el-fill-color-light)` | 浮动菜单按钮色 |
| `--mao-fm-layout-hover` | `hsla(0,0%,0%,0.05)` | `hsla(0,0%,100%,0.05)` | 布局选择 hover |
| `--mao-cover-shadow` | `hsla(0,0%,0%,0.35)` | 同 | 文章封面暗色遮罩 |
| `--mao-overlay-text` | `hsl(0,0%,100%)` | — | 覆盖层白色文字 |
| `--mao-md-preview-quote-bg` | `hsl(210,14%,96%)` | `hsl(0,0%,15%)` | Markdown 引用背景 |
| `--mao-md-preview-code-bg` | `hsl(210,17%,98%)` | `hsl(0,0%,0%)` | Markdown 代码块背景 |
| `--mao-context-header-bg` | `linear-gradient(紫渐变)` | `linear-gradient(暗紫渐变)` | 右键菜单头部 |
| `--mao-context-divider` | `hsl(270,100%,94%)` | `hsl(258,27%,25%)` | 右键菜单分割线 |

### Element Plus 变量覆盖

项目直接使用 `--el-bg-color`, `--el-fill-color-blank`, `--el-text-color-primary`, `--el-color-primary` 等，暗色模式通过 `html.dark` 覆盖。

### 全局 body 样式

```scss
body {
  font-family: "阿里妈妈方圆体 VF Regular", sans-serif;
  background-color: var(--el-bg-color);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## 2. 布局引擎 (`styles/_layout.scss`)

统一收口所有响应式断点、比例、间距。通过 `@use` 引入。

### 断点体系

| 变量 | 值 | 含义 |
|------|----|------|
| `$bp-mobile` | 768px | Tier-1: 手机 |
| `$bp-tablet` | 900px | Tier-2: 窄屏平板（**Nav 切换点**） |
| `$bp-desktop` | 1200px | Tier-3/4: 宽屏平板/桌面 |
| `$bp-wide` | 2000px | Tier-5: 超宽屏 |

### 布局尺寸

| 变量 | 值 | 含义 |
|------|----|------|
| `$layout-max-w` | 1200px | 桌面端内容区最大宽度 |
| `$content-ratio` | 74% | 主内容区占比 |
| `$sidebar-ratio` | 26% | 侧边栏占比 |
| `$content-max-w` | 888px | 内容区最大宽度 |
| `$sidebar-max-w` | 312px | 侧边栏最大宽度 |

### 间距系统

| 变量 | 值 | 场景 |
|------|----|------|
| `$pad-mobile` | `20px 5px` | ≤768px 容器 padding |
| `$pad-tablet` | `30px 12px` | 769~900px |
| `$pad-desktop` | `40px 15px` | ≥901px |
| `$gap-desktop` | 20px | content/sidebar 间距 |
| `$gap-tablet` | 15px | |
| `$gap-mobile` | 10px | |

### 全局 SCSS 变量 (`styles/variable.scss`，Vite additionalData 自动注入)

| 变量 | 值 |
|------|----|
| `$border-radius` | 8px |
| `$margin-bottom` | 20px |
| `$padding-sm` | 15px |
| `$padding-md` | 20px |
| `$padding-lg` | 30px |

### 响应式 Mixin

```scss
@include mobile;              // max-width: 768px
@include tablet-only;         // 769px ~ 900px
@include tablet-down;         // max-width: 900px（最常用）
@include tablet-down(1200);   // max-width: 1200px
@include wide-tablet;         // 901px ~ 1200px
@include desktop-up;          // min-width: 1201px
@include wide-screen;         // min-width: 2001px
@include respond-to('mobile'|'tablet'|'desktop'|'wide');
```

---

## 3. Z-Index 层级图

> **重点**（级联影响高）

```
-2:           Images (Header .h-full 内，背景轮播)
-1:           CanvasLayer .canvas-bg, .canvas-particles (App 根级, fixed)
-1:           Brand.brand (Header 内, fixed)
 0 (auto):    layout-shell, main-wrapper, main-content, Footer
 5:           CanvasLayer .canvas-trail (鼠标拖尾, fixed)
10:          Nav (导航栏, fixed) ← 向下滚隐藏/向上滚显示
1032:        .article-scroll (阅读进度条, fixed)
9999:        FloatingMenu (fixed, 右下角) ← 触顶右滑隐藏
10000:       DevToolsBlocker (fixed, pointer-events:none)
10000:       RightClickMenu (fixed, 右键弹出)
```

### 层叠上下文注意

- Nav `position:fixed; z:10` → 脱离 Header 层叠上下文，回到根级
- Images/Brand 在 Header 内使用 `position:fixed` → 也回到根级
- FloatingMenu `position:fixed; z:9999` → 始终在 Nav 之上
- CanvasLayer 三层 canvas 分离：bg(-1), particles(-1), trail(5)

---

## 4. Nav 滚动行为

```
scrollTop === 0 && isHomePage → .nav-transparent (bg:transparent, 白字)
scrollTop === 0               → .nav-transparent (bg:transparent)
scrollDown                    → .nav-hidden (top:-50px)
scrollUp                      → 显示 (top:0)
```

Nav 在 `≤900px` 时 `display:none`，切换到 `NavMob`（抽屉式移动端导航）。

---

## 5. 动画模式

### CSS 类驱动

| 动画 | 组件 | 机制 |
|------|------|------|
| Nav 滑入隐藏 | `Nav/index.vue` | `.nav-hidden { top:-50px }` + `transition: top 0.3s` |
| Nav 透明 | `Nav/index.vue` | `.nav-transparent { bg:transparent }` + `transition: bg 0.3s` |
| FloatingMenu 触顶隐藏 | `FloatingMenu/index.vue` | `.fm--hidden-by-scroll { translateX(100px), opacity:0 }` |
| FloatingMenu 展开滑入 | `FloatingMenu/index.vue` | `<transition name="fm-slide">` (从右侧) |
| Gallery 布局切换 | `Gallery/index.vue` | `<TransitionGroup name="gallery-fade">` (fade + translateY) |
| 路由切换 | `BaseLayout.vue` | `<component :is="Component" :key="r.fullPath" />`（无 transition wrapper） |
| 设置按钮持续旋转 | `FloatingMenu/index.vue` | `.fm-btn--spinning` → `@keyframes fm-spin` |

### 指令驱动

| 动画 | 指令 | 用途 |
|------|------|------|
| 卡片入场 | `v-slide-in` | Gallery 卡片滚动进入视口时的入场动画 |

---

## 6. 毛玻璃效果 (Glassmorphism)

```scss
// Nav
backdrop-filter: blur(6px);
background-color: var(--mao-nav-bg);  // hsla 半透明

// .nav-transparent 时移除
backdrop-filter: none;
```

⚠ `backdrop-filter` 是 GPU 加速但部分浏览器滚动时可能闪烁。

---

## 7. 样式修改优先级指南

**高影响（需跨页面验证）：**
- `z-index` 变更 → 检查全局层级图（§3）
- `Nav` 样式 → 影响全站（BaseLayout + CustomLayout）
- `_layout.scss` 变量 → 全站布局联动
- `theme.scss` 变量 → 全站主题联动
- `variable.scss` → 自动注入所有组件

**中等影响：**
- `.main-content` / `.main-sidebar` flex 比例 → BaseLayout 页面
- `$bp-tablet` 断点 → Nav 切换 + sidebar 隐藏

**低影响（自有属性）：**
- 组件内部的 `color`, `background-color`, `border`, `padding`, `margin`
- scoped 样式不影响子组件（除非使用 `:deep()`）
