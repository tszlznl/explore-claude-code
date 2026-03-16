# 钩子

钩子是在 Claude Code 会话期间在特定点自动运行的自定义脚本。它们让你拦截工具调用、验证更改、执行规则，并将 Claude 连接到现有的开发工作流。

## 快速开始

1. 打开 `.claude/settings.json`（或在会话中运行 `/hooks`）
2. 在要拦截的事件下添加钩子条目（例如 `PreToolUse`、`PostToolUse`）
3. 编写一个从 stdin 读取 JSON、检查它并以退出码 0（允许）或 2（阻止）退出的脚本
4. 重启 Claude Code。钩子在启动时快照

## 钩子如何工作

Claude 采取的每个操作都会触发 [钩子事件](^命名的生命周期点，钩子可以在此运行，如 PreToolUse 或 PostToolUse)。你的配置告诉 Claude Code 要监视哪些事件以及在触发时运行什么。

1. **事件触发**。Claude 即将调用工具、完成响应、开始会话等。
2. **匹配器检查**。如果你定义了匹配器（工具名称或事件源的正则表达式），只有匹配的事件会触发你的钩子
3. **钩子处理程序运行**。你的脚本（或 HTTP 端点、或 LLM 提示）在 stdin 上接收 JSON 上下文
4. **Claude 根据结果行动**。退出码 0 表示允许。退出码 2 表示阻止（对于支持它的事件）。JSON 输出提供更细粒度的控制

## 钩子事件

钩子在 Claude 生命周期的这些点触发。代理循环中的事件会反复触发：

| 事件 | 触发时间 | 可以阻止？ |
|---|---|---|
| `SessionStart` | 会话开始或恢复 | 否 |
| `UserPromptSubmit` | 你提交提示，在 Claude 处理之前 | 是 |
| `PreToolUse` | 在工具调用执行之前 | 是 |
| `PermissionRequest` | 当权限对话框出现时 | 是 |
| `PostToolUse` | 在工具调用成功后 | 仅反馈 |
| `PostToolUseFailure` | 在工具调用失败后 | 仅反馈 |
| `Stop` | 当 Claude 完成响应时 | 是（强制继续） |
| `SubagentStart` | 当子代理生成时 | 否 |
| `SubagentStop` | 当子代理完成时 | 是 |
| `Notification` | 当 Claude 发送通知时 | 否 |
| `TeammateIdle` | 当代理团队成员即将空闲时 | 是 |
| `TaskCompleted` | 当任务被标记为完成时 | 是 |
| `ConfigChange` | 当配置文件更改时 | 是 |
| `PreCompact` | 在上下文压缩之前 | 否 |
| `SessionEnd` | 当会话结束时 | 否 |

## 配置

钩子在设置文件中定义。三个层级的嵌套：

1. **钩子事件**：要响应的生命周期点
2. **匹配器组**：正则表达式过滤器（例如仅用于 `Bash` 工具）
3. **钩子处理程序**：要运行的脚本、端点、提示或代理

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-bash.sh"
          }
        ]
      }
    ]
  }
}
```

### 在哪里定义钩子

| 位置 | 范围 | 已提交？ |
|---|---|---|
| `~/.claude/settings.json` | 你的所有项目 | 否 |
| `.claude/settings.json` | 此项目，共享 | 是 |
| `.claude/settings.local.json` | 此项目，个人 | 否 |
| 插件 `hooks/hooks.json` | 启用插件时 | 是 |
| 技能/代理 frontmatter | 组件激活时 | 是 |

### 匹配器模式

`matcher` 是正则表达式，根据事件匹配不同的字段：

- **工具事件**（`PreToolUse`、`PostToolUse` 等）：匹配 `tool_name`（例如 `Bash`、`Edit|Write`、`mcp__github__.*`）
- **SessionStart**：匹配会话启动方式（`startup`、`resume`、`clear`、`compact`）
- **SessionEnd**：匹配会话结束原因（`clear`、`logout`、`other`）
- **Notification**：匹配通知类型（`permission_prompt`、`idle_prompt`）
- **SubagentStart/Stop**：匹配代理类型（`Bash`、`Explore`、`Plan` 或自定义名称）

省略匹配器或使用 `"*"` 匹配所有内容。某些事件（如 `UserPromptSubmit` 和 `Stop`）不支持匹配器并且始终触发。

### 钩子处理程序类型

| 类型 | 工作原理 |
|---|---|
| `command` | 运行 shell 命令。在 stdin 上接收 JSON。通过退出码和 stdout 通信 |
| `http` | 将 JSON 作为 POST 请求发送到 URL。响应体控制决策 |
| `prompt` | 将输入发送到 Claude 模型进行单轮是/否评估 |
| `agent` | 生成具有工具访问权限（Read、Grep、Glob）的子代理来验证条件 |

并非所有事件都支持所有类型。`SessionStart`、`Notification`、`PreCompact` 等仅支持 `command` 钩子。

## 输入和输出

### 钩子接收的内容

所有钩子在 stdin 上获得此 JSON（或对于 HTTP 钩子作为 POST 主体）：

```json
{
  "session_id": "abc123",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

`tool_name` 和 `tool_input` 字段是特定于事件的。每个事件在自己的字段之上添加自己的字段。

### 退出码

| 码 | 含义 |
|---|---|
| `0` | 成功。Claude Code 解析 stdout 以获取可选 JSON 输出 |
| `2` | 阻止错误。stderr 作为错误消息传递给 Claude。效果取决于事件 |
| 其他 | 非阻止错误。在详细模式下显示 stderr，继续执行 |

### JSON 输出

对于更细粒度的控制，退出 0 并打印 JSON 到 stdout 而不是仅使用退出码：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "破坏性命令被阻止"
  }
}
```

通用 JSON 字段适用于所有事件：

| 字段 | 效果 |
|---|---|
| `continue` | 如果 `false`，Claude 完全停止处理 |
| `stopReason` | 当 `continue` 为 false 时向用户显示的消息 |
| `suppressOutput` | 如果 `true`，在详细模式下隐藏 stdout |
| `systemMessage` | 向用户显示的警告消息 |

## 异步钩子

在命令钩子中添加 `"async": true` 以在后台运行它。Claude 立即继续工作，而钩子执行。结果在下一个对话轮次中传递。

```json
{
  "type": "command",
  "command": ".claude/hooks/run-tests.sh",
  "async": true,
  "timeout": 120
}
```

异步钩子不能阻止工具调用或返回决策。它们用于在 Claude 工作期间运行测试套件、部署或通知。

## 常见模式

**阻止危险命令**（PreToolUse on Bash）：解析 `tool_input.command`，检查 `rm -rf` 或其他破坏性模式，退出 2 阻止。

**编辑后自动格式化**（PostToolUse on Write|Edit）：在更改的文件上运行 linter 或格式化程序，将输出反馈给 Claude。

**更改后类型检查**（PostToolUse on Write|Edit）：在 TypeScript 更改后运行 `tsc --no-emit`，Claude 看到错误并修复调用点。

**防止重复代码**（PostToolUse on Write）：启动辅助 Claude 实例来根据现有模式审查新代码。

**停止前质量门**（Stop）：在允许 Claude 完成之前检查测试是否通过或必需文件是否存在。

**启动时注入环境**（SessionStart）：写入 `export` 语句到 `$CLAUDE_ENV_FILE` 为会话设置环境变量。

## 提示

- 钩子在会话启动时快照。更改钩子配置后重启 Claude
- 在命令中使用 `$CLAUDE_PROJECT_DIR` 引用相对于项目根的脚本
- 在会话中使用 `/hooks` 交互式查看、添加和删除钩子
- 运行 `claude --debug` 查看钩子执行详细信息和退出码
- 在设置中设置 `"disableAllHooks": true` 临时禁用所有钩子
- 保持钩子快速。命令的默认超时是 600 秒，提示是 30 秒
- 引用 shell 变量（`"$VAR"` 而不是 `$VAR`）并验证输入。钩子脚本使用你的完整用户权限运行
- 对于 MCP 工具，使用模式匹配，如 `mcp__github__.*` 或 `mcp__.*__write.*`
- 提示和代理钩子返回 `{"ok": true/false, "reason": "..."}` 而不是使用退出码

[钩子参考](https://code.claude.com/docs/en/hooks) |
[钩子指南](https://code.claude.com/docs/en/hooks-guide)
