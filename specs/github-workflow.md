# Spec: GitHub Actions — Build & Deploy to GitHub Pages

## Intent

Automate CI/CD on every push to `main`: verify the site builds successfully, then deploy the static output to GitHub Pages.

## Environment

- Runner: `ubuntu-latest`
- Node/Bun: use the official [`oven-sh/setup-bun`](https://github.com/oven-sh/setup-bun) action (latest) — no Node setup needed, Bun is self-contained
- Bun version: `latest`

## Workflow triggers

- `push` to `main`
- `workflow_dispatch` (manual trigger from the GitHub UI)

## Jobs

### `build`

| Step | Action / command |
|------|-----------------|
| Checkout | `actions/checkout@v4` |
| Setup Bun | `oven-sh/setup-bun@v2` with `bun-version: latest` |
| Install deps | `bun install --frozen-lockfile` |
| Build | `bun run build` |
| Upload artifact | `actions/upload-pages-artifact@v3` — upload `./dist` |

### `deploy`

- Depends on `build` (needs: build)
- Environment: `github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`
- Uses `actions/deploy-pages@v4`

## Permissions

Top-level permissions required for Pages deployment:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Concurrency group on `"pages"` with `cancel-in-progress: false` to avoid overlapping deployments.

## Acceptance criteria

- [x] Workflow file exists at `.github/workflows/deploy.yml`
- [x] Uses `oven-sh/setup-bun@v2` — no `actions/setup-node`
- [x] All actions pinned to their latest major version tag (v4, v2, v3…), not SHAs or `@main`
- [x] `bun install` uses `--frozen-lockfile` to catch lockfile drift in CI
- [x] Build artifact is the `./dist` folder produced by `bun run build`
- [x] Deploy job only runs after a successful build job
- [x] Concurrency configured to prevent simultaneous deployments
