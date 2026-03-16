---
name: my-skill
description: 这个技能的作用以及何时使用它。Claude 阅读这个来决定相关性。包含用户自然会说的关键词。
---

这两个字段是唯一的必填字段。`name` 必须是小写带连字符，最多 64 个字符，并且与父目录名匹配。`description` 是 Claude 在启动时阅读以决定技能何时相关的内容（最多 1024 个字符）。

## 可选 Frontmatter 字段

在上面的 `---` 块中添加任何这些字段来自定义行为：

| 字段 | 示例 | 目的 |
|---|---|---|
| `argument-hint` | `[issue-number]` | 自动完成时显示的提示，指示期望的参数 |
| `disable-model-invocation` | `true` | 阻止 Claude 自动加载。用户必须明确输入 `/name`。用于部署、发送、破坏性操作 |
| `user-invocable` | `false` | 从 `/` 菜单中隐藏。Claude 仍然可以自动加载它。用于背景知识 |
| `allowed-tools` | `Read, Grep, Bash(npm *)` | Claude 可以无需询问权限就使用的工具。空格分隔，支持模式 |
| `model` | `claude-sonnet-4-6` | 当此技能激活时覆盖模型。用于成本控制很有用 |
| `context` | `fork` | 在 [隔离子代理](^一个具有自己上下文的独立 Claude 实例。技能内容成为子代理的系统提示) 中运行。技能内容成为子代理的提示 |
| `agent` | `Explore` | 当 `context: fork` 时运行哪个子代理。内置：`Explore`、`Plan`、`general-purpose`，或来自 `.claude/agents/` 的自定义代理 |
| `license` | `Apache-2.0` | 许可证名称或对捆绑 LICENSE 文件的引用 |
| `compatibility` | `Requires git, docker` | 环境要求（最多 500 个字符） |
| `metadata` | 键值对 | 任意元数据（作者、版本等） |

---

# 正文内容

frontmatter 下面的所有内容都是指令正文。Claude 会在技能激活时阅读这个。写任何能帮助 Claude 执行任务的内容。没有格式限制。

好的正文内容包括：

- 任务的分步指令
- 输入和预期输出的示例
- 常见边缘情况以及如何处理它们
- 引用技能文件夹中的支持文件

## 字符串替换

[占位符](^SKILL.md 中的变量，在 Claude 看到内容之前被替换为实际值) 在 Claude 看到内容之前被替换为实际值：

| 占位符 | 解析为 |
|---|---|
| `$ARGUMENTS` | 用户在技能名称后输入的所有内容 |
| `$ARGUMENTS[N]` 或 `$N` | 按索引特定的参数（从 0 开始） |
| `${CLAUDE_SESSION_ID}` | 当前会话 ID |
| `${CLAUDE_SKILL_DIR}` | 技能目录的路径 |

示例：`/my-skill SearchBar React Vue` 给出 `$0` = "SearchBar"，`$1` = "React"，`$2` = "Vue"。

如果内容中不存在 `$ARGUMENTS`，参数将作为 `ARGUMENTS: <value>` 附加。

## 动态上下文注入

`!` 反引号语法在内容到达 Claude 之前运行 shell 命令。输出替换占位符：

- PR diff：`` !`gh pr diff` ``
- 依赖：`` !`cat package.json | jq .dependencies` ``
- 更改的文件：`` !`git diff --name-only` ``

这是 [预处理](^命令在技能加载时运行，不是在对话期间。Claude 只看到最终输出，而不是命令本身)。Claude 只看到最终输出，而不是命令。

---

# 支持文件

保持 SKILL.md 在 500 行以内。将详细材料移到单独的文件并从正文中引用它们：

- [references/REFERENCE.md](references/REFERENCE.md)：按需加载的详细文档
- [assets/template.md](assets/template.md)：模板和静态资源
- [scripts/helper.sh](scripts/helper.sh)：Claude 可以运行的可执行代码

从 SKILL.md 使用相对路径。保持引用在一层深度。导航到这些文件夹以了解更多关于每个文件夹的信息。