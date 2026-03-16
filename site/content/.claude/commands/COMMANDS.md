# 自定义斜杠命令（已弃用）

创建可重用 `/slash-commands` 的 Markdown 文件。命令已经 [合并到技能中](^命令和技能现在是同一个系统。`.claude/commands/review.md` 处的命令文件和 `.claude/skills/review/SKILL.md` 处的技能都创建 `/review` 并且工作方式相同)，但现有命令文件仍然有效，此目录仍然受支持。

## 快速开始

1. 在 `.claude/commands/` 中创建 `.md` 文件
2. 在里面编写提示。使用 `$ARGUMENTS` 作为用户输入的占位符
3. 文件名成为命令名：`review-pr.md` 创建 `/review-pr`
4. 在 Claude Code 中输入 `/` 查看并运行你的命令

## 工作原理

1. Claude 在启动时扫描 `.claude/commands/` 并将每个 `.md` 文件注册为斜杠命令
2. 当你调用 `/command-name` 时，Claude 读取文件并用你输入的内容替换 `$ARGUMENTS`
3. 扩展后的提示被发送给 Claude，就像你手动输入的一样

## 命令与技能

命令是更简单、原始的系统。技能是更新的、更强大的替代品。

| | 命令 | 技能 |
|---|---|---|
| 文件位置 | `.claude/commands/name.md` | `.claude/skills/name/SKILL.md` |
| 调用 | 仅 `/name` | `/name` 或自动加载 |
| 参数 | 仅 `$ARGUMENTS` | `$ARGUMENTS`、`$N`、环境变量 |
| Frontmatter | 不支持 | 完整 frontmatter（模型、工具、调用控制） |
| 支持文件 | 无 | scripts/、references/、assets/ |
| 动态上下文 | 不支持 | `!` 反引号 shell 注入 |

如果你从头开始，使用技能代替。如果你有现有命令，它们将继续工作而无需更改。

## 命令存放位置

| 位置 | 路径 | 范围 |
|---|---|---|
| 项目 | `.claude/commands/` | 与你的团队共享（已提交） |
| 个人 | `~/.claude/commands/` | 你的所有项目（未提交） |

## 迁移到技能

要将命令转换为技能：

1. 创建 `.claude/skills/command-name/SKILL.md`
2. 添加带有 `name` 和 `description` 的 frontmatter
3. 将你的提示移到正文中
4. 删除原始命令文件

`/command-name` 调用保持相同。你获得 frontmatter 控制、支持文件和自动加载。

## 提示

- 保持命令专注于一项任务
- 在提示中包含项目特定的上下文（约定、模式）
- 使用 `$ARGUMENTS` 使命令灵活：`/review-pr 关注 auth 更改`
- 相同名称的命令和技能会冲突。使用其中一个

## 探索结构

打开下面的 `my-command/` 文件夹，查看命令文件的结构，每个部分都有解释。