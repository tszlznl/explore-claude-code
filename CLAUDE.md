# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 这是什么

一个交互式教育网站，通过模拟一个你探索的项目来教授 Claude Code 功能。静态 HTML/CSS/JS — 零构建步骤，无框架，无打包器。

## 本地服务

```bash
# 任何静态服务器，指向 site/ 目录
npx serve site
python -m http.server -d site 8080
```

直接打开 `site/index.html` 也可以（通过相对路径获取 manifest）。

## 架构

所有教育内容都存储为 `site/data/manifest.json` 内的 JSON 字符串。这单个文件驱动整个 UI — 树结构、文件内容、标签、徽章和功能分组。要添加或更改内容，请编辑 manifest。

**组件类（都是 vanilla JS，无模块，通过 `<script>` 标签加载）：**

- `App` (app.js) — 控制器。加载 manifest，连接组件，处理键盘导航（方向键），hash 路由，交通灯按钮，以及虚空彩蛋（最小化按钮 → 画布粒子动画）。
- `FileExplorer` (file-explorer.js) — 侧边栏树。在 `.tree-children-guided` 容器内的 `<canvas>` 元素上绘制连接线（├── └──）。`.claude` 在加载时自动展开。
- `ContentLoader` (content-loader.js) — 渲染文件内容。有一个手写的 markdown 解析器，支持：YAML frontmatter（渲染为表格）、围栏代码块、表格、列表、内联格式化和链接。Markdown 文件获得 渲染/原始 切换。语法高亮通过 Prism.js。
- `Terminal` (terminal.js) — 右侧面板。交互式斜杠命令模拟器（`/help`、`/init`、`/doctor`、`/diff`、`/compact`、`/model`、`/cost`、`/status`、`/config`、`/memory`）。动画输出序列。
- `ProgressTracker` (progress.js) — 在 localStorage 中跟踪访问的功能，键为 `tcc-progress`。

**CSS 按关注点拆分：** `variables.css`（设计令牌）、`layout.css`（外壳 - 侧边栏 - 内容网格）、`components.css`（树项、徽章、内容面板、frontmatter）、`syntax.css`（Prism 覆盖）、`terminal.css`、`void.css`（彩蛋）。

## 关键不变量

**Canvas DPI 缩放：** file-explorer.js 中的 `_createCanvas()` 已经调用 `ctx.scale(dpr, dpr)`. 调用者切勿再次缩放上下文，否则树连接线会在高 DPI 显示器上错位（坐标会被乘以 dpr²）。

**静态树线计时：** `.claude` 目录在加载时自动展开。`_drawStaticLines` 使用双重 `requestAnimationFrame` 确保浏览器在完成布局后再测量 `offsetTop`/`getBoundingClientRect`。如果零尺寸保护触发，它会在下一帧重试。

**Frontmatter 处理：** markdown 渲染器检测内容开头的 `---` 围栏块并将其渲染为样式表格。否则，`---` 会变成 `<hr>`，YAML `#` 注释会渲染为标题。

**Manifest 节点模式：** 每个树节点有 `name`、`path`、`type`（"file"|"directory"|"separator"）。文件可以有：`content`（markdown/代码字符串）、`feature`（分组相关文件）、`badge`、`label`、`description`、`command`。目录有 `children` 数组。分隔符节点只有 `type: "separator"` 并渲染为虚线分隔线。

**内容标题优先级：** 内容加载器首先显示 `node.label`，然后回退到功能标题，然后是文件名。这在 built-in 部分很重要，因为多个文件共享一个功能但需要不同的标题（例如，每个内置技能显示其 `/command` 名称，而不是 "Bundled Skills"）。

**built-in 部分的相关文件：** built-in/下的文件只链接回概览文件（例如 `BUNDLED-SKILLS.md`），而不是每个共享相同功能的兄弟文件。这在 content-loader.js 中过滤。

**代码块第一行缩进 bug：** 全局 `code` 样式（padding、background、border）被 `.md-code-block` 内的 `<code>` 继承，导致渲染代码块的第一行有明显的缩进。修复方法是将 `.md-code-block` 内的 `<code>` 重置为 `padding: 0; background: none; border: none`。

**内容文件行尾：** `site/content/` 中的内容文件始终使用 Unix (LF) 行尾。Windows CRLF 会导致代码块中的渲染问题，即使 markdown 渲染器会规范化行尾。

## 内容设计原则

- 内容应该像探索真正的仓库一样 — 自我描述的样板代码，自己解释自己
- 简洁概览便于扫描，为想要深度的人提供深度
- 每个 `.claude/` 子文件夹在样板外有一个接地入口文件（例如 `SKILLS.md`），然后样板演示实际结构
- `built-in/` 部分涵盖随 Claude Code 附带且无需设置的功能。视觉分隔符（虚线）将其与上方的 `.claude/` 项目配置分开。每个内置类别都有一个概览文件和子目录中的单独条目
- 避免在内容中使用破折号。改用逗号、句号或冒号