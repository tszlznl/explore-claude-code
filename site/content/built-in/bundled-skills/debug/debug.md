---
name: debug
description: Troubleshoot your current Claude Code session
argument-hint: [description]
---

# /debug

Troubleshoots your current Claude Code session by reading the session debug log. Optionally describe the issue to focus the analysis.

## Usage

```
/debug
/debug why did my last tool call fail?
/debug MCP server not connecting
```

## How It Works

Claude reads the internal debug log for your current session and analyses it for:

- **Tool call failures** and their root causes
- **MCP server** connection issues
- **Permission denials** and why they occurred
- **Unexpected behaviour** patterns

The debug log contains detailed information about every tool call, API request, and internal event in your session. Far more than what is visible in the conversation.

## When to Use It

- When a tool call fails and the error message is not clear
- When an MCP server is not connecting or responding as expected
- When Claude's behaviour seems wrong and you want to understand why
- When you need to report a bug and want diagnostic context

## Tips

- Describe the problem to focus the analysis: `/debug why can't Claude read my .env file` is more useful than just `/debug`
- Run it immediately after hitting the issue. The debug log is session-scoped and will not persist across restarts
