#!/bin/bash
# .claude/hooks/my-hook.sh
#
# PreToolUse 钩子，在 Bash 命令运行之前检查它们。
# Claude 在 stdin 上发送 JSON 上下文。你的脚本读取它，检查
# 条件，并以正确的退出码退出：
#
#   exit 0   允许工具调用
#   exit 2   阻止它（stderr 作为错误反馈给 Claude）
#
# 在 .claude/settings.json 中注册此钩子：
#
#   {
#     "hooks": {
#       "PreToolUse": [
#         {
#           "matcher": "Bash",
#           "hooks": [
#             {
#               "type": "command",
#               "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/my-hook.sh"
#             }
#           ]
#         }
#       ]
#     }
#   }

# ── 从 stdin 读取 JSON 输入 ──────────────────────────────────
# 每个钩子接收带有通用字段（session_id、cwd、hook_event_name）的 JSON 对象
# 加上特定于事件的字段。对于 Bash 的 PreToolUse，关键字段是 tool_input.command。

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

# ── 检查条件 ────────────────────────────────────────────
# 此示例阻止破坏性 shell 命令。将此逻辑替换为你的项目
# 需要的任何验证：文件路径检查、环境门控、命令允许列表等。

if echo "$COMMAND" | grep -q 'rm -rf'; then
  # stderr 返回给 Claude 作为错误消息
  echo "已阻止：项目钩子不允许 'rm -rf'。" >&2
  exit 2
fi

if echo "$COMMAND" | grep -q 'git push.*--force'; then
  echo "已阻止：项目钩子不允许 force-push。" >&2
  exit 2
fi

# ── 允许其他所有内容 ───────────────────────────────────────
# 退出 0 且无输出表示"正常进行。"你也可以打印 JSON 到 stdout
# 以获得更细粒度的控制：
#
#   # 自动批准（跳过权限提示）：
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
#
#   # 拒绝并说明原因（Claude 看到）：
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"这里的原因"}}'
#
#   # 要求用户确认：
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask"}}'
#
#   # 在执行前修改工具输入：
#   echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","updatedInput":{"command":"safer-command"}}}'

exit 0
