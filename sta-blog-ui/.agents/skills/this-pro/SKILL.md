---
name: this-pro
description: Local project cache — provides component hierarchy, route chain, technical patterns, and cross-component impact matrix for this specific blog project. Use when: (1) working on any .vue or .ts file in this project, (2) the parent skill (diagnose/grill-me/improve-architecture) needs project context, (3) modifying shared components where side effects matter.
last_updated: 2026-06-20
---

# This Project Cache

> **双维矩阵索引**：场景维度(scenarios) × 结构维度(details)
>
> 场景文件告诉 Agent「做什么检查」，详情文件告诉 Agent「事实是什么」。

## 场景路由表

| 你在做什么 | 先读 | 再读 |
|-----------|------|------|
| 改组件 / 加页面 / 改数据流 | [scenarios/FULL-CHAIN.md](scenarios/FULL-CHAIN.md) | [details/ARCHITECTURE.md](details/ARCHITECTURE.md) + [details/DATA-LAYER.md](details/DATA-LAYER.md) |
| 修样式 / 布局 / z-index | [scenarios/STYLE.md](scenarios/STYLE.md) | [details/STYLE-SYSTEM.md](details/STYLE-SYSTEM.md) |
| 调试已知 bug / 排查问题 | [scenarios/DEBUG.md](scenarios/DEBUG.md) | 按 bug 类别查对应 detail |
| 首次了解项目架构 | — | 直接读 [details/ARCHITECTURE.md](details/ARCHITECTURE.md) |

## Details（结构维度）

| 文件 | 内容 | 行数 |
|------|------|------|
| [ARCHITECTURE.md](details/ARCHITECTURE.md) | 双布局系统 · 路由表 · 组件树 · 依赖矩阵 · Z-Index 层级 · 离线降级 | ~295 |
| [DATA-LAYER.md](details/DATA-LAYER.md) | Store · Composable · API · Utils · Directives · Config | ~158 |
| [STYLE-SYSTEM.md](details/STYLE-SYSTEM.md) | CSS 变量 · 布局引擎 · Z-Index · 断点 · 动画 · 毛玻璃 | ~196 |

## Scenarios（场景维度）

| 文件 | 触发场景 | 性质 |
|------|---------|------|
| [FULL-CHAIN.md](scenarios/FULL-CHAIN.md) | 改组件、加页面、改数据流 | 全链路检查清单 |
| [STYLE.md](scenarios/STYLE.md) | 修样式、z-index、布局、暗色模式 | 样式检查清单（z-index/display 高权重） |
| [DEBUG.md](scenarios/DEBUG.md) | 调试 bug、排查已知问题 | Bug 链路归档（随时间积累） |

## 核心心智模型

> 修改共享组件时：**先上**（所有渲染它的父组件）→ **再横**（共享同一 CSS 上下文的兄弟组件）→ **最后下**（目标组件内部）。防止样式/行为影响其他页面。

## 项目架构速览

- **双布局**：BaseLayout（Header+main+sidebar+Footer+FloatingMenu）vs CustomLayout（Nav+裸露内容+阅读模式）
- **Header 4 模式**：home(100vh) / article(20vh) / page(40vh) / none(0)
- **FloatingMenu 注册制**：页面通过 `registerXxxItems()` 动态注册按钮
- **Gallery 7 布局**：HorizontalCard×3方向 / VerticalCard / OverlayCard / WaterfallCard×2
- **CanvasLayer 3 层**：bg(z:-1) + particles(z:-1) + trail(z:5)
- **离线降级**：`useDemotion().requestOrRead(apiFn, readFn)` 双模式
