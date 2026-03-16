# 内置命令

命令内置于 Claude Code 中，直接执行固定逻辑。在提示符处输入 `/` 查看全部命令，或输入 `/` 后跟任何字母进行过滤。与 [捆绑技能](^如 /simplify 和 /batch 等使用 Claude 的工具协调工作的提示驱动工作流。参见捆绑技能部分）不同，内置命令直接运行，无需代理协调。

并非每个命令对每个用户都可见。有些命令取决于你的平台、计划或环境。例如，`/desktop` 仅在 macOS 和 Windows 上出现，`/upgrade` 仅在 Pro 和 Max 计划上可用，当你的终端已经支持其键绑定时 `/terminal-setup` 会隐藏。

在下面的表格中，`<arg>` 表示必需，`[arg]` 表示可选。

## 会话管理

控制对话生命周期、上下文和历史。

| 命令 | 目的 |
|---|---|
| `/clear` | 清除对话历史并释放上下文。别名：`/reset`、`/new` |
| `/compact [instructions]` | 压缩对话以回收上下文，带有可选的焦点指令 |
| `/context` | 将当前上下文可视化为彩色网格，带有优化建议 |
| `/exit` | 退出 CLI。别名：`/quit` |
| `/fork [name]` | 在这一点创建当前对话的分支。别名：`/branch` |
| `/rename [name]` | 重命名当前会话。不带名称时，从历史自动生成 |
| `/resume [session]` | 按 ID 或名称恢复对话，或打开会话选择器。别名：`/continue` |
| `/rewind` | 将对话和代码回滚到之前的点，或从消息总结。别名：`/checkpoint` |

## 获取信息

查看状态、成本、诊断和会话数据。

| 命令 | 目的 |
|---|---|
| `/btw <question>` | 问一个快速侧边问题，不添加到对话历史中 |
| `/copy` | 将最后响应复制到剪贴板。当存在代码块时显示选择器 |
| `/cost` | 显示当前会话的 token 使用统计 |
| `/diff` | 用于未提交更改和每次提交差异的交互式 diff 查看器 |
| `/doctor` | 诊断和验证你的 Claude Code 安装和设置 |
| `/export [filename]` | 将对话导出为纯文本。带文件名时直接写入文件 |
| `/help` | 显示帮助和可用命令 |
| `/insights` | 生成分析报告你的会话：项目领域、模式、摩擦点 |
| `/release-notes` | 查看完整更改日志，最近的版本在前 |
| `/stats` | 可视化每日使用情况、会话历史、连续性和模型偏好 |
| `/status` | 显示版本、模型、账户和连接信息 |
| `/usage` | 显示计划使用限制和速率限制状态 |

## 配置

调整设置、权限、主题和编辑器模式。

| 命令 | 目的 |
|---|---|
| `/config` | 打开设置界面以配置主题、模型、输出风格和偏好。别名：`/settings` |
| `/fast [on|off]` | 切换快速模式开或关 |
| `/keybindings` | 打开或创建你的键绑定配置文件 |
| `/model [model]` | 选择或更改 AI 模型。使用左右箭头调整努力程度 |
| `/permissions` | 查看或更新工具权限。别名：`/allowed-tools` |
| `/plan` | 直接从提示符进入计划模式 |
| `/sandbox` | 切换沙盒模式（仅支持的平台） |
| `/statusline` | 配置状态行显示 |
| `/terminal-setup` | 配置终端键绑定以使用 Shift+Enter 和其他快捷键 |
| `/theme` | 更改颜色主题。包括浅色、深色、色盲和 ANSI 变体 |
| `/vim` | 在 Vim 和普通编辑模式之间切换 |

## 项目设置

初始化项目、管理目录和配置记忆。

| 命令 | 目的 |
|---|---|
| `/add-dir <path>` | 向当前会话添加新的工作目录 |
| `/init` | 分析你的代码库并生成初始 `CLAUDE.md` |
| `/memory` | 编辑 `CLAUDE.md` 文件、切换自动记忆和查看记忆条目 |

## Claude Code 生态系统

管理技能、代理、钩子、插件和 MCP 服务器。

| 命令 | 目的 |
|---|---|
| `/agents` | 管理代理配置 |
| `/hooks` | 管理工具事件的钩子配置 |
| `/mcp` | 管理 MCP 服务器连接和 OAuth 身份验证 |
| `/plugin` | 管理 Claude Code 插件 |
| `/reload-plugins` | 重新加载所有活动插件以应用更改，无需重启 |
| `/skills` | 列出可用技能 |

## 集成

将 Claude Code 连接到外部应用和服务。

| 命令 | 目的 |
|---|---|
| `/chrome` | 在 Chrome 设置中配置 Claude |
| `/desktop` | 在 Claude Code 桌面应用中继续会话。仅限 macOS 和 Windows。别名：`/app` |
| `/ide` | 管理 IDE 集成并显示状态 |
| `/install-github-app` | 为仓库设置 Claude GitHub Actions |
| `/install-slack-app` | 通过 OAuth 安装 Claude Slack 应用 |
| `/mobile` | 显示二维码下载 Claude 移动应用。别名：`/ios`、`/android` |
| `/pr-comments [PR]` | 从 GitHub 拉取请求获取评论。自动检测当前分支的 PR |
| `/remote-control` | 使此会话可通过 claude.ai 进行远程控制。别名：`/rc` |
| `/remote-env` | 为 teleport 会话配置默认远程环境 |
| `/security-review` | 分析当前分支上的待处理更改是否存在安全漏洞 |

## 账户

管理身份验证、计划和反馈。

| 命令 | 目的 |
|---|---|
| `/extra-usage` | 在达到速率限制时配置额外使用量 |
| `/feedback [report]` | 提交有关 Claude Code 的反馈。别名：`/bug` |
| `/login` | 登录到你的 Anthropic 账户 |
| `/logout` | 从你的 Anthropic 账户登出 |
| `/passes` | 与朋友分享一周免费的 Claude Code（仅限符合条件的账户） |
| `/privacy-settings` | 查看和更新隐私设置（仅限 Pro 和 Max 计划） |
| `/upgrade` | 打开更高计划等级的升级页面 |

## 后台任务

| 命令 | 目的 |
|---|---|
| `/tasks` | 列表和管理后台任务 |

后台任务让你在长时间运行的进程执行时继续工作。按 `Ctrl+B` 将运行中的命令发送到后台（tmux 用户按两次）。设置 `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` 禁用。

## MCP 提示

MCP 服务器可以暴露提示作为命令，使用格式 `/mcp__<server>__<prompt>`。这些是从连接的服务器动态发现的，当你输入 `/` 时会与内置命令一起显示。

## Bash 模式

在你的输入前添加 `!` 以直接运行 shell 命令，无需 Claude 解释：

```
! npm test
! git status
! ls -la
```

命令及其输出被添加到对话上下文中。支持 `Ctrl+B` 后台和基于历史的自动完成（按 Tab 从以前的 `!` 命令完成）。

## 提示

- 输入 `/` 并开始输入以模糊过滤命令
- 像 `/compact` 和 `/clear` 这样的命令是管理上下文窗口压力的主要工具
- 当感觉有问题时，`/doctor` 是首先要尝试的
- `/diff` 显示完整的 git diff 和每次提交的 diff。使用箭头键导航
- `/btw` 甚至在 Claude 响应中途时也有效，不会中断它
- `/init` 也适用于现有项目。它会建议改进而不是覆盖

## 探索关键命令

打开下面的文件夹以查看最强大的内置命令的详细分解。
