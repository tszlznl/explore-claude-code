---
name: my-agent
description: "描述 Claude 何时应该委托给这个代理。要具体。如果你想要 Claude 主动使用它，请包含'主动使用'。"
tools: Read, Grep, Glob, Bash
model: sonnet
---

你是一个 [角色描述]。当被调用时，[你做什么]。

你的专注领域：
- [主要职责]
- [次要职责]
- [你永远不应该做的事情]

流程：
1. [第一步]
2. [第二步]
3. [最后一步]

输出格式：
- [如何构建你的响应]

---

这是一个入门代理文件。文件名 `my-agent.md` 将此注册为名为 `my-agent` 的子代理。

第二个 `---` 上面的所有内容都是代理的系统提示。这是代理看到的全部内容（加上基本环境细节，如工作目录）。它不会接收完整的 Claude Code 系统提示。

## 此文件的解剖

**frontmatter**（在第一对 `---` 之间）配置代理：

- `name`：唯一标识符，小写带连字符。这是引用代理的方式
- `description`：Claude 阅读这个来决定何时委托。具体说明此代理处理哪些任务
- `tools`：代理可以使用的工具。省略以从主对话继承所有工具。常见组合：
  - 只读：`Read, Grep, Glob`
  - 可以修改文件：`Read, Grep, Glob, Edit, Write, Bash`
  - 可以生成代理：`Agent(worker, researcher), Read, Bash`
- `model`：使用哪个模型。`sonnet` 平衡速度和能力，`haiku` 快速且便宜，`opus` 最强大，`inherit` 使用主对话使用的模型

**正文**（frontmatter 之后）是系统提示。将其写为对代理的直接指令："你是一个..."、"当被调用时..."、"专注于..."。

## 可选 Frontmatter 字段

```yaml
permissionMode: default      # default | acceptEdits | dontAsk | bypassPermissions | plan
maxTurns: 25                 # 在此多轮代理轮数后停止
background: false            # true 始终在后台运行
isolation: worktree          # 在临时 git worktree 中运行
memory: user                 # user | project | local（启用持久化记忆）
skills:                      # 启动时注入上下文的技能
  - api-conventions
  - error-handling
mcpServers:                  # 此代理可用的 MCP 服务器
  - slack
hooks:                       # 范围限定到此代理的生命周期钩子
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
```

## 什么是好的代理

- 狭窄、定义明确的职责（不是"做一切"）
- 详细的 `description` 以便 Claude 委托正确的任务
- 仅它实际需要的工具（最小权限）
- 清晰的输出格式指令以便结果一致
- 流程步骤指导代理完成其任务

## 子代理与技能

两者都创建 `/slash-command` 风格界面，但它们解决不同的问题：

| | 技能 | 子代理 |
|---|--------|-----------|
| 上下文 | 在你的主对话中运行 | 在其自己的隔离上下文中运行 |
| 最适合 | 参考材料、可重用的工作流 | 产生详细输出的任务 |
| 工具控制 | 无工具限制 | 细粒度的工具允许列表 |
| 可以链式 | 否 | 否（但主对话可以链式它们） |
