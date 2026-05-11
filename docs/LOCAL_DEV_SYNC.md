# Local Development and GitHub Sync

## Test the current game state

From the repo root:

```powershell
npm run dev
```

This runs validation first, then starts the local web prototype. The server prints the URL, usually:

```text
http://127.0.0.1:8080/
```

For a server without the validation preflight:

```powershell
npm start
```

## Push the current work to GitHub

```powershell
npm run sync
```

The sync command:

- verifies the repo is `FSGER9326/Gravesmoke`
- fetches and prunes remote branches
- refuses unsafe diverged or conflicted states
- runs `npm run validate`
- commits any local changes with a timestamped `autosync:` message
- pushes the current branch to GitHub

To use a custom commit message:

```powershell
.\scripts\sync-github.ps1 -Message "chore: describe the current work"
```

## Keep GitHub updated while developing

```powershell
npm run autosync
```

This checks every 5 minutes. If validation passes and files changed, it commits and pushes them. If validation fails, it leaves the work local so broken states are not published automatically.

Stop it with `Ctrl+C`.

## Recommended branch flow

Keep `main` stable when possible. For focused work:

```powershell
git switch main
git pull --ff-only
git switch -c codex/short-task-name
npm run autosync
```

Pushes from `npm run sync` and `npm run autosync` go to the current branch, so the same branch is available from GitHub and ChatGPT web.
