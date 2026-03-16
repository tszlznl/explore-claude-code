---
name: claude-api
description: 为项目的语言加载 Claude API 参考材料
---

# /claude-api

为项目的语言加载 Claude API 参考材料和 [Agent SDK](^一个用于构建使用 Claude 作为推理引擎的自定义代理的工具包。适用于 Python 和 TypeScript) 参考。涵盖工具使用、流式传输、批处理、结构化输出和常见陷阱。

## 用法

```
/claude-api
```

或者当你的代码导入时 **自动** 激活：

- `anthropic`（Python）
- `@anthropic-ai/sdk`（TypeScript/JavaScript）
- `claude_agent_sdk`（Agent SDK）

## 支持的语言

| 语言 | SDK |
|---|---|
| Python | `anthropic` |
| TypeScript | `@anthropic-ai/sdk` |
| Java | Anthropic Java SDK |
| Go | Anthropic Go SDK |
| Ruby | Anthropic Ruby SDK |
| C# | Anthropic .NET SDK |
| PHP | Anthropic PHP SDK |
| cURL | 原始 HTTP API |

## 涵盖内容

- **工具使用** - 定义工具、处理工具结果、并行工具调用
- **流式传输** - 服务器发送事件、使用工具使用流式传输
- **批处理** - 创建和管理消息批处理
- **结构化输出** - 使用 JSON 模式和约束解码
- **Agent SDK** - 使用 Python 和 TypeScript 构建自定义代理
- **常见陷阱** - 速率限制、token 计数、错误处理模式

## 何时使用它

- 当构建调用 Claude API 的应用程序时
- 当在应用程序中实现工具使用或流式传输时
- 当使用 Agent SDK 进行自定义代理工作流时
- 当你需要语言的特定 SDK 语法时

## 自动激活

在大多数情况下，你不需要手动调用 `/claude-api`。如果 Claude 检测到你的代码导入了 `anthropic`、`@anthropic-ai/sdk` 或 `claude_agent_sdk`，它会自动加载相关的 API 参考。这意味着当你在处理与 Claude 通信的代码时，Claude 已经有了 API 上下文。
