---
name: simplify
description: Review changed code for reuse, quality, and efficiency
---

# /simplify

Reviews your recently changed files for code reuse, quality, and efficiency issues, then fixes them. Run it after implementing a feature or bug fix to clean up your work.

## How It Works

When you invoke `/simplify`, Claude spawns **three review agents in parallel**:

1. **Code reuse** - finds duplicated logic, missed abstractions, and opportunities to share code
2. **Code quality** - catches bugs, unclear naming, missing error handling, and style issues
3. **Efficiency** - spots unnecessary allocations, redundant computations, and performance pitfalls

After all three agents report back, Claude aggregates their findings, deduplicates overlapping issues, and applies fixes directly.

## Usage

```
/simplify
```

Focus the review on specific concerns:

```
/simplify focus on memory efficiency
/simplify only check for code reuse in the auth module
```

## When to Use It

- After completing a feature or bug fix, before committing
- When you have been iterating quickly and want a cleanup pass
- After a large refactor to catch anything you missed
- Before opening a pull request
