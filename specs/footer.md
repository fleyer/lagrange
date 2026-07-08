# Spec: Footer

## Intent

Add a footer at the bottom of the page that gives visitors quick access to key practical information without scrolling back up — address, contact details, social links — and closes the page with a simple legal line.

## Current state

The page ends after `SectionContact`. There is no `<footer>` element. The layout has no component slot for one.

## Content

- **Address** — one line from `src/content/contact/<locale>.md`, kept for local SEO (NAP signal); phone and email are intentionally omitted since a full Contact section already exists on the page
- **Copyright** — static line: `© {year} La Grange de Marie-France`
- **Developer credit** — link to `https://fleyer.github.io/portfolio/` with text "Romain Manchado", placed in the copyright bar alongside the copyright line

## Layout

Single-column on mobile, two-column on desktop (≥ 768 md breakpoint):

Single column: brand name + address (one line).

Below, a full-width bottom bar with the copyright line on the left and a developer credit link ("Romain Manchado" → `https://fleyer.github.io/portfolio/`) on the right.

The footer uses the site's dark palette (same dark background as the header) so it visually anchors the page.

## Internationalisation

Contact data is locale-aware — query `src/content/contact/<locale>.md` using the `locale` prop already threaded through `PageLayout.astro`. Social links in `socials.md` are locale-independent.

## Implementation notes

- New component: `src/components/Footer.astro`
- Mounted in `src/layouts/PageLayout.astro` after `<main>`, before `<GdprBanner>`
- Receives `locale` prop (same pattern as other section components)
- No JavaScript needed — purely static markup
- Year in copyright: rendered server-side with `new Date().getFullYear()`

## Acceptance criteria

- [x] A `<footer>` element appears below `SectionContact` on all pages / locales
- [x] Address (one line) is pulled from the locale-specific contact content file (not hard-coded); phone and email are not repeated in the footer
- [x] Copyright year is dynamic (server-rendered via `new Date().getFullYear()`)
- [x] Layout: brand + address block above, copyright bar below
- [x] Copyright bar shows copyright left and a "Romain Manchado" link (to `https://fleyer.github.io/portfolio/`) right; opens in a new tab
- [x] Footer background matches the header's dark palette
- [x] `bun astro check` passes with 0 errors
