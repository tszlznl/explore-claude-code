---
name: batch
description: Orchestrate large-scale parallel changes across a codebase
argument-hint: <instruction>
---

# /batch

Orchestrates large-scale changes across your codebase in parallel. Provide a description of what you want changed, and `/batch` handles the rest: research, planning, parallel execution, and pull requests.

## How It Works

1. **Research** - Claude analyses your codebase to understand scope and structure
2. **Decompose** - breaks the work into 5 to 30 independent units
3. **Plan** - presents the plan for your approval before any code changes
4. **Execute** - spawns one background agent per unit, each in an isolated [git worktree](^A git feature that creates a separate working directory sharing the same repository. Each agent gets its own files and branch without conflicts)
5. **Deliver** - each agent implements its unit, runs tests, and opens a pull request

## Usage

```
/batch migrate src/ from Solid to React
/batch add structured logging to all API handlers
/batch update all test files to use vitest instead of jest
```

## Requirements

- Must be in a **git repository** (worktree isolation requires git)
- Changes must be **decomposable** into independent units
- Works best with a good test suite so each agent can verify its work

## Worktree Isolation

Each unit runs in its own git worktree at `<repo>/.claude/worktrees/<name>`. This means:

- Agents work in parallel without file conflicts
- Each unit gets its own branch
- Failed units do not affect other units
- Worktrees are cleaned up automatically when agents finish without changes

## When to Use It

- Large-scale migrations (framework, library, API version)
- Codebase-wide refactors (rename patterns, update imports)
- Adding consistent features across many files (logging, error handling, tests)
- Any change that touches many files in a repeatable pattern
