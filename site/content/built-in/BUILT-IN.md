# Built-in Features

Everything above the line is the **`.claude/` ecosystem**: configuration files, skills, agents, hooks, and plugins that you create and customise for your projects. That is the stuff you build.

This section is different. These are features that **ship with Claude Code** and require no setup. They exist whether or not you have a `.claude/` directory. You do not configure them, you do not create files for them, and you do not commit them to version control. They are just there, ready to use.

## What You'll Find Here

### Bundled Skills

Prompt-based workflows available in every Claude Code session. Unlike the custom skills you create in `.claude/skills/`, these are maintained by Anthropic and work out of the box.

- `/simplify` - Review and clean up your recent changes
- `/batch` - Orchestrate large-scale parallel changes
- `/debug` - Troubleshoot your current session
- `/loop` - Run prompts on a recurring interval
- `/claude-api` - Load API and SDK reference for your language

### More Coming Soon

This section will grow to cover other built-in capabilities like CLI flags, permission modes, keyboard shortcuts, and the auto-memory system.

## Explore

Open the `bundled-skills/` folder below to see detailed breakdowns of each skill.
