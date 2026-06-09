# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About this project

**Lagrange** is a one-page static website for a hosting place welcoming pilgrims walking the Camino de Santiago (Saint-Jacques-de-Compostelle). Built with Astro 6, managed with Bun, deployed as a fully static site.

Claude acts as an experienced Astro developer on this project. Prefer idiomatic Astro patterns over generic HTML/JS solutions.

## Commands

```bash
bun dev          # dev server at localhost:4321
bun build        # production build → ./dist/
bun preview      # preview the production build locally
bun astro add    # add an official Astro integration
bun astro check  # TypeScript diagnostics across .astro files
```

## Architecture

### One-page layout

The entire site lives in `src/pages/index.astro`. Sections (hero, presentation, amenities, location, contact, etc.) are broken into components under `src/components/`. There is no routing — no additional pages should be created unless explicitly required.

### Content in Markdown

All editable content (texts, descriptions, practical info) lives in Markdown files under `src/content/`. Components import and render this content so that non-technical updates only touch `.md` files, never `.astro` files.

Use Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) to type and query Markdown content:
- Define collections in `src/content/config.ts` with a Zod schema
- Query with `getCollection()` or `getEntry()` in component frontmatter
- Never hard-code text that an owner might want to update

### Component conventions

- One responsibility per component; keep components focused on a single page section
- Pass content data as props from `index.astro`; components do not fetch their own data
- Use scoped `<style>` blocks inside `.astro` files; no global CSS except design tokens in `src/styles/global.css`
- No JavaScript islands unless a feature cannot be done in HTML/CSS — this is a static, mostly informational site

### Static-only

`astro.config.mjs` must stay in default static output mode (`output: 'static'` or omitted). No SSR, no server endpoints.

## Spec-driven development

Features are driven by specs before implementation:

1. Create a spec file in `specs/<feature-name>.md` describing intent, content structure, and acceptance criteria
2. Get the spec reviewed/approved before writing any `.astro` or `.ts` code
3. Implementation must satisfy every acceptance criterion in the spec — no scope creep beyond it
4. Close the spec by checking off criteria once the feature is merged

A spec does not need to be exhaustive — it should be just detailed enough to align on the outcome.
