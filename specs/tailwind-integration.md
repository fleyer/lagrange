# Spec: Tailwind CSS Integration

## Intent

Add Tailwind CSS v4 to replace hand-written scoped styles with utility classes, with a focus on mobile-first responsive design. Tailwind v4 uses a CSS-based config (no `tailwind.config.js`) and integrates via a Vite plugin — this is the recommended approach for Astro 6.

## Setup

Tailwind v4 does **not** use `@astrojs/tailwind`. Instead:

1. Install `tailwindcss@4.3.0` and `@tailwindcss/vite@4.3.0` as dev dependencies
2. Register the Vite plugin in `astro.config.mjs`
3. Replace the `@import` in `src/styles/global.css` with `@import "tailwindcss"`

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

/* custom tokens and global resets below */
```

## Scope

- Remove all `<style>` blocks from existing components and replace with Tailwind utility classes
- Keep `src/styles/global.css` for base tokens (colours, fonts) using Tailwind's `@theme` directive
- Mobile-first: default styles target small screens, `md:` / `lg:` breakpoints layer up

## Acceptance criteria

- [x] `tailwindcss` and `@tailwindcss/vite` installed as dev dependencies at `4.3.0`
- [x] `astro.config.mjs` registers the `@tailwindcss/vite` plugin
- [x] `src/styles/global.css` imports Tailwind via `@import "tailwindcss"`
- [x] All existing component `<style>` blocks removed and replaced with utility classes
- [x] Site renders correctly on 375 px (mobile) and 1280 px (desktop) viewports
- [x] `bun run check` passes
