# 插件

插件将技能、代理、钩子和 MCP 服务器打包成可共享的扩展。插件是带有 `.claude-plugin/plugin.json` 清单和根级别的一个或多个组件的目录。

## 快速开始

1. 为你的插件创建目录：`mkdir my-plugin`
2. 添加清单：`my-plugin/.claude-plugin/plugin.json`
3. 在插件根目录添加组件（技能、代理、钩子、MCP 服务器）
4. 本地测试：`claude --plugin-dir ./my-plugin`

## 何时使用插件

| 方法 | 技能名称 | 最适合 |
|---|---|---|
| **独立**（`.claude/` 目录） | `/hello` | 个人工作流、项目特定的自定义、快速实验 |
| **插件**（`.claude-plugin/plugin.json`） | `/plugin-name:hello` | 与团队成员共享、社区分发、版本发布 |

从独立配置开始以快速迭代，然后在准备共享时转换为插件。

## 插件结构

```
my-plugin/
  .claude-plugin/
    plugin.json          # 清单（必需）
  skills/                # 带有 SKILL.md 文件的 Agent Skills
  commands/              # 作为 Markdown 文件的技能
  agents/                # 自定义代理定义
  hooks/                 # hooks.json 中的事件处理程序
  .mcp.json              # MCP 服务器配置
  .lsp.json              # LSP 服务器配置
  settings.json          # 插件启用时的默认设置
```

只有 `plugin.json` 放在 `.claude-plugin/` 内。所有其他目录位于插件根目录。

## 插件清单

`plugin.json` 文件定义你的插件身份：

```json
{
  "name": "my-plugin",
  "description": "这个插件的作用",
  "version": "1.0.0",
  "author": {
    "name": "你的名字"
  }
}
```

| 字段 | 目的 |
|---|---|
| `name` | 唯一标识符和技能命名空间。技能以前缀命名（例如 `/my-plugin:hello`） |
| `description` | 在浏览或安装时显示在插件管理器中 |
| `version` | 使用 [语义化版本控制](^主。次。补丁格式，如 1.2.3。主 = 破坏性更改，次 = 新功能，补丁 = bug 修复) 跟踪发布 |
| `author` | 可选。有助于归属 |

其他可选字段：`homepage`、`repository`、`license`、`keywords`。

## 命名空间

插件技能始终命名以防止冲突。名为 `review` 的技能在名为 `code-tools` 的插件中变为 `/code-tools:review`。要更改命名空间前缀，更新 `plugin.json` 中的 `name` 字段。

## 添加组件

### 技能

添加带有包含 `SKILL.md` 文件的技能文件夹的 `skills/` 目录。每个技能需要带有 `name` 和 `description` 的 frontmatter：

```yaml
---
name: code-review
description: 审查代码以查找最佳实践和潜在问题
---

审查代码时，检查：
1. 代码组织和结构
2. 错误处理
3. 安全问题
```

### LSP 服务器

添加 `.lsp.json` 文件为尚未被官方插件覆盖的语言提供 Claude 实时代码智能：

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": { ".go": "go" }
  }
}
```

### 默认设置

包含 `settings.json` 以在插件启用时应用配置。当前支持 `agent` 键以激活自定义代理作为主线程：

```json
{
  "agent": "security-reviewer"
}
```

## 本地测试

在开发期间使用 `--plugin-dir` 标志：

```bash
claude --plugin-dir ./my-plugin
```

一次加载多个插件：

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

测试每个组件：使用 `/plugin-name:skill-name` 运行技能，使用 `/agents` 检查代理，验证钩子是否正确触发。

## 从独立转换

如果你已经在 `.claude/` 中有技能或钩子，将它们转换为插件：

1. 创建带有 `.claude-plugin/plugin.json` 的插件目录
2. 复制现有的 `commands/`、`agents/`、`skills/` 目录
3. 将钩子从 `settings.json` 移到 `hooks/hooks.json`
4. 使用 `--plugin-dir` 测试

| 独立（`.claude/`） | 插件 |
|---|---|
| 仅在一个项目中可用 | 通过市场共享 |
| `.claude/commands/` 中的文件 | `plugin-name/commands/` 中的文件 |
| `settings.json` 中的钩子 | `hooks/hooks.json` 中的钩子 |
| 必须手动复制才能共享 | 使用 `/plugin install` 安装 |

## 共享插件

当你的插件准备好后：

1. 添加带有安装和使用说明的 `README.md`
2. 使用语义化版本控制为插件版本
3. 通过 [市场](^列出插件及其获取位置的目录。参见 MARKETPLACES.md) 分发或直接共享仓库
4. 通过 [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) 提交到官方 Anthropic 市场

## 提示

- 使用 `claude plugin validate .` 或 `/plugin validate .` 检查插件是否有问题
- 在钩子命令和 MCP 配置中使用 `${CLAUDE_PLUGIN_ROOT}` 引用插件安装目录中的文件
- 插件在安装时复制到缓存。插件目录外的文件不可用 - 如果需要请使用符号链接
- 更改后重启 Claude Code 以 picking up 更新
- 保持技能在 500 行以内。将详细材料移到 `references/` 或 `assets/` 子目录

## 进一步阅读
- [插件文档](https://code.claude.com/docs/en/plugins)
- [插件参考](https://code.claude.com/docs/en/plugins-reference)