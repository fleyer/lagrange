# Spec: Pre-commit Hook — Typecheck & Lint

## Intent

Block commits that introduce type errors or lint violations, keeping the main branch always in a passing state without relying solely on CI.

## Tooling choices

| Concern | Tool | Rationale |
|---------|------|-----------|
| TypeScript / `.astro` typecheck | `astro check` | Built-in, understands `.astro` files natively |
| Linting + formatting | [Biome](https://biomejs.dev/) | Single fast binary, replaces ESLint + Prettier, first-class Bun support |
| Hook runner | [Lefthook](https://github.com/evilmartians/lefthook) | Single binary, fast, config in one YAML file, no Node dependency at runtime |

## Setup

1. Add dev dependencies: `biome`, `lefthook`
2. Add `lefthook.yml` at repo root defining the `pre-commit` hook
3. Add `biome.json` at repo root with project lint/format rules
4. Add a `prepare` script to `package.json` so `bun install` auto-installs the hook: `"prepare": "lefthook install"`
5. Add `bun run check` script: runs `astro check && biome check .`

## `lefthook.yml` structure

```yaml
pre-commit:
  parallel: true
  commands:
    typecheck:
      run: bun astro check
    lint:
      run: bun biome check .
```

Running in parallel keeps the hook fast.

## `biome.json` baseline

- Formatter: enabled, indent with 2 spaces
- Linter: enabled, recommended ruleset
- Files: include `src/**`, ignore `dist/`, `node_modules/`

## Acceptance criteria

- [x] `lefthook` and `biome` added as dev dependencies in `package.json`
- [x] `biome.json` present at repo root with formatter + linter enabled
- [x] `lefthook.yml` present at repo root with `typecheck` and `lint` commands running in parallel
- [x] `prepare` script in `package.json` runs `lefthook install`
- [x] `bun run check` script runs both `astro check` and `biome check .`
- [ ] Committing a file with a type error is blocked
- [ ] Committing a file with a lint violation is blocked
