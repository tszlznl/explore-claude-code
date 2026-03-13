---
name: claude-api
description: Load Claude API reference material for your project's language
---

# /claude-api

Loads Claude API reference material for your project's language and the [Agent SDK](^A toolkit for building custom agents that use Claude as their reasoning engine. Available for Python and TypeScript) reference. Covers tool use, streaming, batches, structured outputs, and common pitfalls.

## Usage

```
/claude-api
```

Or it activates **automatically** when your code imports:

- `anthropic` (Python)
- `@anthropic-ai/sdk` (TypeScript/JavaScript)
- `claude_agent_sdk` (Agent SDK)

## Supported Languages

| Language | SDK |
|---|---|
| Python | `anthropic` |
| TypeScript | `@anthropic-ai/sdk` |
| Java | Anthropic Java SDK |
| Go | Anthropic Go SDK |
| Ruby | Anthropic Ruby SDK |
| C# | Anthropic .NET SDK |
| PHP | Anthropic PHP SDK |
| cURL | Raw HTTP API |

## What It Covers

- **Tool use** - defining tools, handling tool results, parallel tool calls
- **Streaming** - server-sent events, streaming with tool use
- **Batches** - creating and managing Message Batches
- **Structured outputs** - using JSON mode and constrained decoding
- **Agent SDK** - building custom agents with Python and TypeScript
- **Common pitfalls** - rate limits, token counting, error handling patterns

## When to Use It

- When building applications that call the Claude API
- When implementing tool use or streaming in your app
- When using the Agent SDK for custom agent workflows
- When you need SDK-specific syntax for your language

## Auto-Activation

You do not need to invoke `/claude-api` manually in most cases. If Claude detects that your code imports `anthropic`, `@anthropic-ai/sdk`, or `claude_agent_sdk`, it loads the relevant API reference automatically. This means Claude already has API context when you are working on code that talks to Claude.
