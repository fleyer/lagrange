# Spec: Split Éauze Page Content Out of `InfoPageLayout`

## Intent

`InfoPageLayout.astro` currently *is* the entire page: doctype, head, header, the full `<main>` content rendering (title, section nav, MDX article, reservation CTA), footer, and GDPR banner — for every info page (`eauze`, `camino`). The Éauze page additionally needs a full-bleed hero gallery that only makes sense for that one collection, which today is hard-coded into the shared layout behind a `collection === "eauze"` check.

Rework so the Éauze page owns its own content rendering, while the shared layout stays generic chrome + the hero gallery slot. The `camino` pages (which have no page-specific content) keep working exactly as they do today, unchanged.

## Approach

- `InfoPageLayout.astro` keeps: doctype/head/meta (canonical, hreflang, title, description — still sourced from `getEntry`), consent script, `<Header />`, the existing `collection === "eauze"` hero-gallery block (unchanged, still full width, still a sibling of `<main>`), `<Footer />`, `<GdprBanner />`.
- Inside `<main>`, `InfoPageLayout` renders a default `<slot />` containing **exactly the markup it renders today** (h1 title, section nav, `<article><Content /></article>`, reservation CTA) — so any page that passes no children (i.e. the `camino` pages, unchanged) renders identically to now.
- New component `src/components/eauze/EauzeContent.astro`:
  - Props: `locale: string`
  - Does its own `getEntry("eauze", locale)` + `render()`
  - Renders the same title/nav/article/CTA markup, including the scoped `h2`/`h3` spacing styles currently in `InfoPageLayout`'s `<style>` block (moved here, since they only apply to this content)
- The 4 Éauze page files (`src/pages/eauze/index.astro`, `en/eauze`, `de/eauze`, `es/eauze`) pass `<EauzeContent locale="..." />` as a child of `<InfoPageLayout>`, overriding the default slot.
- The 4 `camino` page files are untouched.

## Acceptance criteria

- [x] `InfoPageLayout.astro` no longer hard-codes the eauze title/nav/article/CTA markup for pages that supply their own content; it exposes a default `<slot />` inside `<main>` that preserves current output when no children are passed
- [x] `EauzeContent.astro` created under `src/components/eauze/`, fetching its own entry and rendering title/nav/article/CTA plus the h2/h3 spacing styles
- [x] All 4 Éauze page files pass `<EauzeContent locale="..." />` into `InfoPageLayout`
- [x] Hero gallery rendering stays in `InfoPageLayout`, unchanged, still full width, still conditional on `collection === "eauze"` and `heroImages` being present
- [x] `camino` pages (`chemin-de-compostelle`, `camino-de-santiago`, `jakobsweg`) render identically to before — no changes to those page files
- [x] `bun astro check` and `bun run build` pass with no errors
