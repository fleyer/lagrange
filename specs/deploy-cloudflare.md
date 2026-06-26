# Spec: GitHub Actions — Build & Deploy to Cloudflare Pages

## Intent

On every version tag pushed to `main`, build the static site in GitHub Actions and upload the output directly to Cloudflare Pages using the official Wrangler action. The existing GitHub Pages workflow is left unchanged.

## Trigger

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
```

Only semver-shaped tags (e.g. `v1.0.0`, `v2.3.1`) start a deployment. `workflow_dispatch` allows a manual run from the GitHub UI.

## Environment

- Runner: `ubuntu-latest`
- Bun: `oven-sh/setup-bun@v2` with `bun-version: latest`
- Deploy: `cloudflare/wrangler-action@v3`

## Required GitHub secrets

| Secret | Where to get it |
|--------|----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token with **Cloudflare Pages: Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right-hand sidebar on the account overview page |

These must be set in the GitHub repository under **Settings → Secrets and variables → Actions**.

## Required GitHub variable

| Variable | Value |
|----------|-------|
| `CLOUDFLARE_PAGES_PROJECT` | Name of the Cloudflare Pages project (created once via dashboard or `wrangler pages project create`) |

## Job: `build-and-deploy`

Single job — no need to pass artifacts between jobs since Wrangler deploys directly from the runner's filesystem.

| Step | Action / command |
|------|-----------------|
| Checkout | `actions/checkout@v4` |
| Setup Bun | `oven-sh/setup-bun@v2` with `bun-version: latest` |
| Install deps | `bun install --frozen-lockfile` |
| Build | `bun run build` (with env vars below) |
| Deploy to CF Pages | `cloudflare/wrangler-action@v3` with `command: pages deploy ./dist` |

### Build env vars

```yaml
env:
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: ${{ secrets.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN }}
  BASE_URL: ${{ vars.BASE_URL }}
```

### Wrangler action config

```yaml
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy ./dist --project-name=${{ vars.CLOUDFLARE_PAGES_PROJECT }} --commit-dirty=true
```

`--commit-dirty=true` suppresses the warning Wrangler emits when the working tree has untracked files after `bun run build`.

## Permissions

```yaml
permissions:
  contents: read
```

No `pages: write` or `id-token: write` needed — authentication goes through the Cloudflare API token, not OIDC.

## Concurrency

```yaml
concurrency:
  group: cloudflare-pages
  cancel-in-progress: false
```

Prevents two deploys racing when tags are pushed in quick succession.

## Workflow file location

`.github/workflows/deploy-cloudflare.yml` — a new file; `deploy.yml` (GitHub Pages) is untouched.

## One-time setup checklist (outside this repo)

- [ ] Create a Cloudflare Pages project (dashboard or `wrangler pages project create <name>`)
- [ ] Create a Cloudflare API token scoped to **Cloudflare Pages: Edit** for this account
- [ ] Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub repository secrets
- [ ] Add `CLOUDFLARE_PAGES_PROJECT` as a GitHub repository variable

## Acceptance criteria

- [x] Workflow file exists at `.github/workflows/deploy-cloudflare.yml`
- [x] Triggers only on `v*.*.*` tags and `workflow_dispatch` — not on every push to `main`
- [x] Uses `oven-sh/setup-bun@v2` — no `actions/setup-node`
- [x] `bun install` uses `--frozen-lockfile`
- [x] Deploy uses `cloudflare/wrangler-action@v3` — no custom `wrangler` install step
- [x] API token and account ID are read from GitHub secrets — never hardcoded
- [x] Cloudflare Pages project name is read from a GitHub variable, not hardcoded
- [x] Existing `deploy.yml` (GitHub Pages) is not modified
