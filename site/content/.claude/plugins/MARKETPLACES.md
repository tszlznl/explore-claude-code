# Plugin Marketplaces

A marketplace is a catalogue that lists plugins and tells Claude Code where to fetch them. It provides centralised discovery, version tracking, and automatic updates. You can create marketplaces for your team, your community, or the public.

## Quick Start

1. Create a directory with `.claude-plugin/marketplace.json`
2. List your plugins with names, sources, and descriptions
3. Push to GitHub (or any git host)
4. Users add it: `/plugin marketplace add owner/repo`
5. Users install plugins: `/plugin install my-plugin@your-marketplace`

## How It Works

1. **You create plugins** with skills, agents, hooks, MCP servers, or LSP servers
2. **You create a `marketplace.json`** that lists those plugins and where to find them
3. **You host it** on GitHub, GitLab, or any git host
4. **Users add your marketplace** and install individual plugins
5. **Users get updates** by running `/plugin marketplace update`

## Marketplace Schema

The `marketplace.json` file lives at `.claude-plugin/marketplace.json` in your repository root.

### Required Fields

| Field | Type | Purpose |
|---|---|---|
| `name` | string | Marketplace identifier (kebab-case). Users see this when installing: `/plugin install tool@your-marketplace` |
| `owner` | object | Maintainer info: `name` (required), `email` (optional) |
| `plugins` | array | List of available plugins |

### Optional Metadata

| Field | Purpose |
|---|---|
| `metadata.description` | Brief marketplace description |
| `metadata.version` | Marketplace version |
| `metadata.pluginRoot` | Base directory prepended to relative plugin source paths |

## Plugin Sources

Each plugin entry needs a `name` and `source`. The source tells Claude Code where to fetch the plugin:

| Source | Format | Notes |
|---|---|---|
| Relative path | `"./plugins/my-plugin"` | Within the marketplace repo. Must start with `./` |
| GitHub | `{ "source": "github", "repo": "owner/repo" }` | Supports `ref` (branch/tag) and `sha` (commit) pinning |
| Git URL | `{ "source": "url", "url": "https://...git" }` | Any git host. URL must end `.git` |
| Git subdirectory | `{ "source": "git-subdir", "url": "...", "path": "..." }` | Sparse clone of a monorepo subdirectory |
| npm | `{ "source": "npm", "package": "@org/plugin" }` | Supports `version` ranges and custom `registry` |
| pip | `{ "source": "pip", "package": "plugin" }` | Installed via pip |

### Pinning Versions

GitHub and git sources support `ref` (branch or tag) and `sha` (exact commit):

```json
{
  "name": "my-plugin",
  "source": {
    "source": "github",
    "repo": "company/my-plugin",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

## Hosting

### GitHub (Recommended)

Create a repo, add `.claude-plugin/marketplace.json`, and share. Users add with:

```
/plugin marketplace add owner/repo
```

### Private Repositories

Claude Code uses your existing git credentials. If `git clone` works in your terminal, it works in Claude Code. For background auto-updates, set a token in your environment:

| Provider | Environment variable |
|---|---|
| GitHub | `GITHUB_TOKEN` or `GH_TOKEN` |
| GitLab | `GITLAB_TOKEN` or `GL_TOKEN` |
| Bitbucket | `BITBUCKET_TOKEN` |

## Team Distribution

Configure your repo so team members are automatically prompted to install your marketplace. Add to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "code-formatter@company-tools": true
  }
}
```

### Managed Restrictions

Administrators can restrict which marketplaces users are allowed to add using `strictKnownMarketplaces` in [managed settings](^Organisation-level settings controlled by IT/DevOps that individual users cannot override):

| Value | Behaviour |
|---|---|
| Undefined (default) | No restrictions. Users can add any marketplace |
| Empty array `[]` | Complete lockdown. No new marketplaces allowed |
| List of sources | Users can only add marketplaces matching the allowlist |

## Strict Mode

The `strict` field on plugin entries controls who defines the plugin's components:

| Value | Behaviour |
|---|---|
| `true` (default) | `plugin.json` is the authority. Marketplace entry can supplement with additional components |
| `false` | Marketplace entry is the entire definition. If the plugin also has a `plugin.json` with components, it fails to load |

Use `strict: false` when the marketplace operator wants full control over which components are exposed.

## Release Channels

Set up "stable" and "latest" channels by creating two marketplaces pointing to different refs of the same repo. Assign them to different user groups through managed settings.

The plugin's `plugin.json` must declare a different `version` at each pinned ref. If two refs have the same version, Claude Code skips the update.

## Validation

Test your marketplace before sharing:

```bash
claude plugin validate .
```

Or from within Claude Code:

```
/plugin validate .
/plugin marketplace add ./my-local-marketplace
/plugin install test-plugin@my-local-marketplace
```

## Reserved Names

These marketplace names are reserved for official Anthropic use: `claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `life-sciences`. Names that impersonate official marketplaces are also blocked.

## Tips

- Relative paths only work when users add your marketplace via git (not via direct URL to `marketplace.json`)
- Plugins are copied to a cache when installed. Use symlinks if plugins need to share files
- Set `CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS` to increase the 120-second git timeout for large repos
- Use `metadata.pluginRoot` to simplify source paths: set it to `"./plugins"` and write `"source": "formatter"` instead of `"source": "./plugins/formatter"`

## Further Reading
- [Marketplaces docs](https://code.claude.com/docs/en/plugin-marketplaces)
- [Discover plugins](https://code.claude.com/docs/en/discover-plugins)