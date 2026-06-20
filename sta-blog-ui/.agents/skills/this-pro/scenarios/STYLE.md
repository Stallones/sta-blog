# STYLE — 样式修改检查清单

> 适用场景：修样式、布局、z-index、响应式、暗色模式
>
> **优先级规则**：z-index/display/position > flex 比例/断点 > color/bg/border/padding/margin

---

## 修改前：评估影响级别

### 高影响（必须跨页面验证）

- [ ] 修改 **z-index** → 查 `details/STYLE-SYSTEM.md` §3 全局层级图
  - 确认不与 Images(-2), CanvasLayer(-1), Nav(10), FloatingMenu(9999) 冲突
  - `position:fixed` 元素脱离父级层叠上下文，回到根级比较
- [ ] 修改 **Nav 样式** → 影响 BaseLayout + CustomLayout 所有页面
- [ ] 修改 **`_layout.scss` 变量** → `$bp-*` 断点、`$content-ratio/$sidebar-ratio`、`$pad-*` 间距
- [ ] 修改 **`theme.scss` 变量** → `--mao-accent` 等全站主题联动
- [ ] 修改 **`variable.scss`** → Vite additionalData 自动注入所有组件

### 中等影响

- [ ] 修改 **`display: flex/grid`** → 检查父容器的 flex 布局是否依赖子元素的 display
- [ ] 修改 **Header 高度** → 影响 CanvasLayer canvasHeaderH 偏移
- [ ] 修改 **`.main-content` / `.main-sidebar`** flex 比例 → 所有 BaseLayout 页面
- [ ] 修改 **Nav 滚动行为** → `.nav-hidden` / `.nav-transparent` class 切换逻辑

### 低影响（自有属性）

- `color`, `background-color`, `border`, `box-shadow`（不影响布局）
- `padding`, `margin`（scoped 内不影响父/子）
- `font-size`, `line-height`（继承链有限）

---

## 修改中：检查清单

### 层叠上下文检查

- [ ] 目标元素是否在 `position: relative/absolute/fixed` 的父元素内？
- [ ] 父元素是否有 `transform` / `opacity < 1` / `filter`？（创建新层叠上下文）
- [ ] 目标 `z-index` 是相对于哪个层叠上下文的？

### 响应式检查

- [ ] 修改是否在 `@include tablet-down` 或 `@include mobile` 中？
- [ ] `$bp-tablet (900px)` 是 Nav 切换点 — 如果修改影响 Nav 可见性，需同步检查 NavMob
- [ ] Gallery 在 `≤768px` 降级为 VerticalCard — 修改卡片样式需验证移动端

### 暗色模式检查

- [ ] 使用的颜色变量是否在 `html.dark` 中有对应覆盖？
- [ ] 硬编码颜色值（如 `hsl(0,0%,100%)`）在暗色模式下是否可见？
- [ ] Element Plus 组件（ElButton, ElCard 等）的暗色覆盖是否在 `el_override.scss` 中？

### Scoped 样式边界

- [ ] 修改是否在 `<style scoped>` 内？→ 不影响子组件
- [ ] 需要穿透子组件？→ 使用 `:deep(.selector)`
- [ ] 全局样式？→ 确认放在 `styles/` 目录下而非组件内

---

## 修改后：验证清单

- [ ] **桌面端 (≥1200px)**：正常布局
- [ ] **宽屏平板 (901-1200px)**：sidebar 可能隐藏或变窄
- [ ] **平板 (≤900px)**：Nav → NavMob, sidebar 堆叠到底部, Gallery 单列
- [ ] **手机 (≤768px)**：更紧凑间距
- [ ] **亮色模式**：`:root` 变量
- [ ] **暗色模式**：`html.dark` 变量
- [ ] **首页 Hero 区**：100vh Header 下的样式
- [ ] **文章页**：20vh Header + 自定义 flex 布局
- [ ] **归档页**：40vh Banner Header

---

## 快速参考

- 全局断点/间距 → `details/STYLE-SYSTEM.md` §2
- 全局 z-index → `details/STYLE-SYSTEM.md` §3
- CSS 变量表 → `details/STYLE-SYSTEM.md` §1
- 动画模式 → `details/STYLE-SYSTEM.md` §5
