---
name: loop
description: Run a prompt repeatedly on an interval
argument-hint: [interval] <prompt>
---

# /loop

Runs a prompt repeatedly on an interval while your session stays open. Claude parses the interval, schedules a recurring [cron task](^A time-based job scheduler. /loop converts your interval into a standard 5-field cron expression under the hood), and confirms the cadence.

## Usage

```
/loop 5m check if the deployment finished
/loop 30m /review-pr 1234
/loop check the build
```

## Interval Syntax

| Form | Example | Parsed Interval |
|---|---|---|
| Leading token | `/loop 30m check the build` | Every 30 minutes |
| Trailing `every` clause | `/loop check the build every 2h` | Every 2 hours |
| No interval | `/loop check the build` | Default: every 10 minutes |

Supported units: `s` (seconds), `m` (minutes), `h` (hours), `d` (days). Seconds are rounded up to the nearest minute since cron has one-minute granularity.

## How It Works

Under the hood, `/loop` creates a session-scoped cron task using `CronCreate`. Key behaviours:

- Tasks fire **between your turns**, not while Claude is mid-response
- Recurring tasks **expire after 3 days** automatically
- A small deterministic [jitter](^A random delay added to prevent all sessions from hitting the API at the same moment. Up to 10% of the period, capped at 15 minutes) staggers API traffic
- All times use your **local timezone**
- Up to **50 scheduled tasks** per session

## One-Time Reminders

For one-shot reminders, use natural language instead of `/loop`:

```
remind me at 3pm to push the release branch
in 45 minutes, check whether the integration tests passed
```

## Managing Tasks

```
what scheduled tasks do I have?
cancel the deploy check job
```

Or use the tools directly:

| Tool | Purpose |
|---|---|
| `CronCreate` | Schedule a new task with a 5-field cron expression |
| `CronList` | List all scheduled tasks with IDs and schedules |
| `CronDelete` | Cancel a task by ID |

## Desktop Scheduled Tasks

For **durable scheduling** that survives restarts, use Desktop's scheduled tasks instead. These run on your machine as long as the desktop app is open and support:

- **Manual, hourly, daily, weekday, and weekly** frequencies
- **Missed-run catch-up**: one catch-up run fires on wake if your computer was asleep
- **Permission management**: save tool approvals per task
- **Worktree isolation**: each run gets its own git worktree

## Limitations

- **Session-scoped**: closing the terminal cancels everything
- **No catch-up** for missed fires in CLI (Desktop has catch-up)
- **No persistence** across restarts. Use Desktop or GitHub Actions for durable scheduling
