# 技能

可重用的指令、参考和脚本包，Claude 会 [按需加载](^Claude 在启动时只读取技能的名称和描述。完整内容仅在与当前任务相关时加载)。技能是包含 `SKILL.md` 文件的目录。这是唯一的要求。

## 快速开始

1. 创建文件夹：`.claude/skills/my-skill/`
2. 添加带有 [frontmatter](^文件顶部 `---` 标记之间的 YAML 块。包含名称和描述等元数据) 名称和描述的 `SKILL.md`
3. 在正文中编写指令。Claude 会在技能激活时阅读它们
4. 使用 `/my-skill` 调用，或让 Claude 在相关时自动加载

技能遵循 [Agent Skills 开放标准](https://agentskills.io)，因此它们可以在多个 AI 工具中工作，而不仅仅是 Claude Code。

## 工作原理

技能使用 [渐进式披露](^一种高效管理上下文的模式：先加载一点，仅在需要时加载更多。保持 Claude 专注并减少 token 使用) 来保持高效：

1. **发现**：启动时，Claude 只加载每个技能的 `name` 和 `description`。仅足够知道何时可能相关
2. **激活**：当任务匹配时，Claude 将完整的 `SKILL.md` 读入上下文
3. **执行**：Claude 遵循指令， optionally 加载引用的文件或运行捆绑的脚本

## 两种技能类型

| 类型 | 目的 | 示例 | 调用 |
|---|---|---|---|
| 参考 | Claude 应用于你的工作的知识 | 风格指南、约定、领域规则 | 在相关时自动加载 |
| 任务 | 针对特定操作的分步指令 | 部署、搭建、生成 | 通常使用 `/skill-name` 调用

## 技能存放位置

| 位置 | 路径 | 范围 |
|---|---|---|
| 企业 | [托管设置](^由 IT/DevOps 管理的系统级路径，用于组织范围的策略) | 组织内的所有用户 |
| 个人 | `~/.claude/skills/<name>/SKILL.md` | 你的所有项目 |
| 项目 | `.claude/skills/<name>/SKILL.md` | 仅此项目 |
| 插件 | `<plugin>/skills/<name>/SKILL.md` | 启用插件的位置 |

当技能跨层级共享相同名称时，更高优先级的位置获胜：企业 > 个人 > 项目。

## 命令和技能

[自定义命令](^`.claude/commands/` 中的 Markdown 文件创建了斜杠命令。现在已统一到技能下) 和技能现在是同一个系统。`.claude/commands/review.md` 处的命令文件和 `.claude/skills/review/SKILL.md` 处的技能都创建 `/review` 并且工作方式相同。现有命令文件继续工作。技能添加了可选功能：支持文件、frontmatter 控制和自动加载。

## 调用控制

使用 [frontmatter](^SKILL.md 顶部 `---` 标记之间的 YAML 元数据) 设置控制谁能触发技能：

| 设置 | 你可以调用 | Claude 可以调用 |
|---|---|---|
| （默认） | 是 | 是 |
| `disable-model-invocation: true` | 是 | 否 |
| `user-invocable: false` | 否 | 是 |

对具有副作用的操作（部署、发送、破坏性操作）使用 `disable-model-invocation`。对 Claude 应该应用但用户不应直接触发的背景知识使用 `user-invocable: false`。

## 权限控制

通过 [权限规则](^在 settings.json 或 .claude/settings.json 中配置。请参阅设置和权限部分了解详情) 限制 Claude 可以使用哪些技能：

- `Skill(commit)`：允许特定技能
- `Skill(deploy *)`：拒绝技能前缀
- 拒绝 `Skill` 工具以完全禁用所有技能

## 捆绑技能

这些随 Claude Code 附带，在每个会话中可用：

| 命令 | 作用 |
|---|---|
| `/simplify` | 审查和清理你的最近更改 |
| `/batch <instruction>` | 协调跨代码库的大规模并行更改 |
| `/debug [description]` | 通过阅读调试日志来排除会话故障 |
| `/claude-api` | 为项目的语言加载 API 和 SDK 参考 |

## 提示

- 技能目录名称必须是小写带连字符，最多 64 个字符
- 保持 `SKILL.md` 在 500 行以内。将详细材料移到 `references/` 或 `assets/` 子目录
- `description` 字段是 Claude 用于决定相关性的内容。包含用户自然说的关键词
- 在正文中使用 `$ARGUMENTS` 接受用户输入：`/my-skill 一些输入内容`
- 使用 `!` 反引号语法进行 [动态上下文注入](^在 SKILL.md 到达 Claude 之前运行的 shell 命令。输出替换占位符，例如注入更改文件列表)
- 在依赖自动加载之前，通过 `/skill-name` 直接调用来测试技能

## 探索结构

打开下面的 `my-skill/` 文件夹，查看技能的完整文件结构，每个字段和目录都有解释。