# Spec: DaisyUI Theme System

## Goal

Replace the current ad-hoc CSS custom-property color system with a proper DaisyUI theme so that all colors — light and dark — are defined in one place and can be changed by editing a single block.

## Current state

`global.css` currently:
- Defines custom tokens (`--bg-base`, `--text-head`, etc.) manually in `:root`
- Duplicates overrides inside `@media (prefers-color-scheme: dark)`
- Has partial `.theme-stone` / `.theme-white` classes that only apply inside a `@media (prefers-color-scheme: light)` block
- Uses DaisyUI via `@plugin "daisyui"` but does not configure any named theme, so DaisyUI falls back to its own defaults rather than the project's palette

The result is a fragile, split system: two different sets of overrides (DaisyUI defaults + hand-rolled tokens) that can silently diverge.

## Approach

Use DaisyUI's built-in theme mechanism to declare one **light** theme and one **dark** theme, each as a single CSS block. Both themes map DaisyUI semantic tokens (e.g. `--color-base-100`, `--color-primary`) to the project palette. The `<html>` element receives `data-theme="lagrange"` statically at build time; the browser then applies the matching dark variant automatically via `@media (prefers-color-scheme: dark)`.

All site components switch from referencing ad-hoc `--bg-base`-style variables to either:
- DaisyUI semantic utility classes (`bg-base-100`, `text-base-content`, `btn-primary`, etc.), or
- The mapped DaisyUI CSS variables directly when a utility class doesn't exist.

## Theme definition location

A new file `src/styles/theme.css` holds the DaisyUI theme declarations, imported in `global.css`. This file is the **single place** an owner edits to change the palette.

Two `@plugin "daisyui/theme"` blocks are declared — one for light, one for dark. The dark block carries `prefersdark: true` so the browser picks it automatically via `@media (prefers-color-scheme: dark)` with no JavaScript needed.

`global.css` switches `@plugin "daisyui"` to list the two named themes:

```css
@plugin "daisyui" {
  themes: lagrange --default, lagrange-dark --prefersdark;
}
```

`theme.css` structure:

```css
/* Light theme */
@plugin "daisyui/theme" {
  name: "lagrange";
  default: true;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #faf9f7;
  --color-base-200: #f0ece6;
  --color-base-300: #e0d8d0;
  --color-base-content: #1a1a1a;

  --color-primary: <TBD>;
  --color-primary-content: #fff;
  --color-secondary: <TBD>;
  --color-secondary-content: #fff;
  --color-accent: <TBD>;
  --color-accent-content: #fff;
  --color-neutral: #1a1a1a;
  --color-neutral-content: #faf9f7;
  --color-info: oklch(70% 0.2 220);
  --color-info-content: oklch(98% 0.01 220);
  --color-success: oklch(65% 0.25 140);
  --color-success-content: oklch(98% 0.01 140);
  --color-warning: oklch(80% 0.25 80);
  --color-warning-content: oklch(20% 0.05 80);
  --color-error: oklch(65% 0.3 30);
  --color-error-content: oklch(98% 0.01 30);

  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

/* Dark theme — activated automatically by prefers-color-scheme: dark */
@plugin "daisyui/theme" {
  name: "lagrange-dark";
  default: false;
  prefersdark: true;
  color-scheme: dark;

  --color-base-100: #111;
  --color-base-200: #1a1a1a;
  --color-base-300: #2a2a2a;
  --color-base-content: #faf9f7;

  --color-primary: <TBD>;
  --color-primary-content: #fff;
  --color-secondary: <TBD>;
  --color-secondary-content: #fff;
  --color-accent: <TBD>;
  --color-accent-content: #fff;
  --color-neutral: #faf9f7;
  --color-neutral-content: #1a1a1a;
  --color-info: oklch(70% 0.2 220);
  --color-info-content: oklch(98% 0.01 220);
  --color-success: oklch(65% 0.25 140);
  --color-success-content: oklch(98% 0.01 140);
  --color-warning: oklch(80% 0.25 80);
  --color-warning-content: oklch(20% 0.05 80);
  --color-error: oklch(65% 0.3 30);
  --color-error-content: oklch(98% 0.01 30);

  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

> `--color-primary`, `--color-secondary`, and `--color-accent` are left as TBD — the owner decides these during implementation based on the site's visual identity. The [DaisyUI theme generator](https://daisyui.com/theme-generator/) can help pick and preview values.

> All CSS variables listed in each block are **required** by DaisyUI 5.

## Migration: token mapping

| Current token | Replaces with |
|---|---|
| `--bg-base` | `--color-base-100` / `bg-base-100` |
| `--section-bg` | `--color-base-100` / `bg-base-100` |
| `--text-head` | `--color-base-content` / `text-base-content` |
| `--text-body` | `--color-base-content` (slightly dimmed via opacity) |
| `--text-sub` | `text-base-content/60` (DaisyUI opacity modifier) |
| `--text-muted` | `text-base-content/40` |
| `--base-border` | `--color-base-300` / `border-base-300` |
| `--ui-text` | `--color-base-content` |
| `--ui-hover-bg` | `--color-base-200` / `hover:bg-base-200` |
| `--divider-color` | `--color-base-300` |

Custom `@utility` blocks (`text-head`, `text-body`, etc.) in `global.css` are removed once all components use DaisyUI equivalents.

## Acceptance criteria

- [ ] `src/styles/theme.css` exists with two `@plugin "daisyui/theme"` blocks: `lagrange` (light, `default: true`) and `lagrange-dark` (dark, `prefersdark: true`).
- [ ] `global.css` imports `theme.css` and replaces `@plugin "daisyui"` with `@plugin "daisyui" { themes: lagrange --default, lagrange-dark --prefersdark; }`.
- [ ] `global.css` no longer contains `@media (prefers-color-scheme: dark)` overrides for color tokens.
- [ ] All ad-hoc `--bg-base`, `--section-bg`, `--text-head`, `--text-body`, `--text-sub`, `--text-muted`, `--base-border`, `--ui-text`, `--ui-text-muted`, `--ui-hover-bg`, `--divider-color` tokens are removed from `global.css`.
- [ ] All components that previously referenced those tokens now use DaisyUI semantic classes or the mapped DaisyUI CSS variables.
- [ ] No JavaScript or `data-theme` attribute is needed — dark mode activates purely via `prefers-color-scheme`.
- [ ] Light mode visual appearance is unchanged compared to the current site.
- [ ] Dark mode visual appearance is unchanged compared to the current site.
- [ ] `bun astro check` reports no type errors.
- [ ] Changing a single value in `theme.css` (e.g. `--color-base-100`) visibly propagates to all sections that use that surface color.
