# FULL-CHAIN — 全链路修改检查清单

> 适用场景：改组件、加页面、改数据流 — 任何需要追踪完整链路的修改

---

## 修改前：定位目标

- [ ] **确认目标组件/文件在哪个布局下**
  - 查 `details/ARCHITECTURE.md` §1（双布局系统）确认是 BaseLayout 还是 CustomLayout
  - BaseLayout: Header + main + sidebar + Footer + FloatingMenu
  - CustomLayout: Nav + 裸露内容 + Footer(可选) + FloatingMenu

- [ ] **确认目标路由的 headerType**
  - 查 `details/ARCHITECTURE.md` §3（路由表）
  - headerType 影响 Header 高度 → CanvasLayer 偏移 → 整体布局位移

- [ ] **确认目标是共享组件还是页面私有组件**
  - 查 `details/ARCHITECTURE.md` §5（共享组件依赖矩阵）
  - 🔴 最高风险组件：Nav, MenuList, NavMob, UserLogin, FloatingMenu, Header, CanvasLayer
  - 🟡 中等风险：SearchDialog, Gallery, SComment, Footer, Loading

---

## 修改中：追踪链路

### 向上追踪（谁渲染了它）

- [ ] 查 §5 的「被谁渲染」列，列出所有父组件
- [ ] 对每个父组件，再查它在哪些路由下被挂载
- [ ] 特别注意 FloatingMenu 注册制（§8）：页面通过 registerXxxItems() 动态注册按钮

### 向下追踪（它渲染了谁）

- [ ] 列出目标组件的所有子组件
- [ ] 检查是否有 slot 传递（子组件可能不在预期位置渲染）
- [ ] 检查 `:deep()` 穿透样式

### 数据流追踪

- [ ] 查 `details/DATA-LAYER.md` §1（Store）确认数据来源
- [ ] 确认是 API 直接调用、Store action、还是 Composable
- [ ] 如涉及离线降级，查 `details/DATA-LAYER.md` 和 ARCHITECTURE §10
  - `requestOrRead(apiFn, readFn)` 模式：两个函数都要改
  - 纯 API 模式：无离线支持
  - Pagefind 模式：离线搜索

### 样式影响追踪

- [ ] 如果修改涉及 z-index/display/position → 转 `scenarios/STYLE.md`
- [ ] 如果修改 `_layout.scss` 变量 → 全站布局联动
- [ ] 如果修改 `theme.scss` / `variable.scss` → 全站主题联动

---

## 修改后：验证清单

- [ ] **BaseLayout 路由验证**：首页(`/`) + 归档(`/category`) + 留言板(`/message`)
- [ ] **CustomLayout 路由验证**：文章(`/article/:id`) + 关于(`/about`) + 用户(`/login`)
- [ ] **移动端验证**（≤900px）：Nav 切换 NavMob、sidebar 堆叠、Gallery 降为 VerticalCard
- [ ] **阅读模式验证**（仅 Article）：Nav/Footer/FloatingMenu 隐藏
- [ ] **离线模式验证**：`isOnline=false` 时降级行为是否正常
- [ ] **暗色模式验证**：`html.dark` 下颜色是否正确
- [ ] **FloatingMenu 验证**：注册/注销按钮是否在各页面正确显示

---

## 新增页面流程

1. **选择布局**：BaseLayout（标准页）还是 CustomLayout（自主页）
2. **在 `router/routers.ts` 添加路由**，设置 meta：
   - `headerType`: 'home' | 'article' | 'page' | 'none'
   - `title`, `subtitle` (可选)
   - `showFooter`: boolean (默认 BaseLayout=true, CustomLayout=false)
   - `sidebarType`: string (BaseLayout 需要)
3. **创建 View 组件**：`views/` 目录下
4. **如需 FloatingMenu 按钮**：在 `registerGlobal.ts` 添加注册函数，View 的 onMounted/onUnmounted 调用
5. **如需离线支持**：在 `file-reader.ts` 添加 `readXxx()` 函数，View 中使用 `requestOrRead(apiFn, readFn)`
6. **更新 `details/ARCHITECTURE.md` 路由表**
