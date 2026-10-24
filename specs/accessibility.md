# Spec: Accessibility fixes

## Intent

Fix the accessibility problems found in a manual audit of the layout and components (WCAG 2.2 AA target). No visual redesign: changes are semantic markup, labels, focus handling and a few colour-opacity bumps.

Sources: a manual code audit, plus the PageSpeed Insights report (accessibility + best practices):
- Form elements have no associated labels → finding 2 (the menu-toggle checkbox)
- `<iframe>` has no title → finding 7
- Background/foreground contrast insufficient → findings 6 and 10
- Touch targets too small / too close → finding 12

## Findings

### Navigation (`Header.astro`)
1. No "skip to content" link; keyboard users tab through the whole header first.
2. Hamburger and close controls are icon-only `<label>`s with no accessible name, no `aria-expanded`, and the underlying checkbox has no label. The checkbox is `sr-only` but still focusable with no visible focus state.
3. The mobile overlay cannot be closed with `Escape`.
4. Both `<nav>` landmarks (desktop and mobile) are unlabeled.
5. The language switcher has no accessible name; the current locale is not marked (`aria-current`); links lack `lang` / `hreflang`, so screen readers read "EN" / "DE" with the page's voice.
6. Non-active locales use `text-base-content/40`, below 4.5:1 contrast.

### Content
7. Map `<iframe>` in `ReservationSection.astro` has no `title`.
8. External links with `target="_blank"` (map link, creator link) give no new-tab warning to assistive tech; the map link lacks `rel="noopener noreferrer"`.
9. Accommodation carousel dots use a hard-coded `Photo n` label, not translated.
10. Muted text at `/40` and `/50` opacity (dining notes, footer) falls below 4.5:1 contrast.

### Touch targets
12. Interactive elements smaller than 24×24 CSS px or too tightly spaced: carousel dots (`h-2 w-2`), desktop/mobile locale links, footer links, inline text links in the address block. Target: ≥ 24×24 px (aim for 44×44 on mobile for primary controls), or enough spacing that a 24 px circle centred on each target doesn't overlap another.

### Consent banner (`GdprBanner.astro`)
11. Banner has no landmark/role or accessible name, and sits last in the DOM so keyboard and screen-reader users reach it after the whole page.

## Changes

- Add a skip link as the first focusable element in `PageLayout.astro` / `LegalLayout.astro`, targeting `#main`; give `<main>` that id. Label comes from Paraglide messages (all 4 locales).
- Header: the checkbox is the accessible menu control (translated `aria-label`, `aria-controls`; its checked state is announced natively, so no `aria-expanded`, which is invalid on a checkbox). The visual hamburger label is `aria-hidden`; close becomes a real `<button>`; visible `:focus-visible` ring on the toggle; `Escape` closes the overlay and returns focus to the checkbox.
- Add `aria-label` to both `<nav>`s and to the language switcher; `aria-current="true"` plus `lang`/`hreflang` on locale items.
- Raise muted text to at least `/70` where used for informative text.
- Add translated `title` to the map iframe; add `rel="noopener noreferrer"` and a visually hidden "(opens in a new tab)" text to `target="_blank"` links; translate carousel dot labels.
- Banner: `role="region"` with `aria-label` from the existing gdpr content collection (new `label` field).
- Menu toggle checkbox gets an `aria-label` (translated) so the form element is labelled.
- Enlarge hit areas without changing the look: carousel dots get a padded transparent hit area (≥ 24 px), locale and footer links get `inline-flex min-h-6 min-w-6`/padding and gaps, mobile menu links get vertical padding.
- All new strings go in Paraglide messages or Markdown content, never hard-coded.

## Out of scope

- Redesign, new JS islands, new pages.
- Hero text-over-image contrast (needs visual review; flagged, not changed).

## Acceptance criteria

- [x] Skip link is the first Tab stop, becomes visible on focus, and moves focus to `<main>`
- [x] Hamburger and close controls have translated accessible names; checked state is announced (native checkbox, no `aria-expanded`)
- [x] `Escape` closes the mobile menu
- [x] Keyboard focus is visible on the menu toggle
- [x] Both navs and the language switcher have translated accessible names
- [x] Current locale has `aria-current`; other locale links have `lang` and `hreflang`
- [x] Informative muted text has ≥ 4.5:1 contrast in the light and dark themes
- [x] Map iframe has a translated `title`
- [x] `target="_blank"` links have `rel="noopener noreferrer"` and a new-tab hint
- [x] Carousel dot labels are translated in fr/en/de/es
- [x] The menu toggle checkbox has an accessible label (no unlabeled form elements)
- [x] Carousel dots, locale links and footer links meet the 24×24 px target size or spacing rule
- [ ] Re-running PageSpeed Insights no longer reports the four issues above (verified by the user after deploy)
- [x] Consent banner exposes a labelled region
- [x] `bun astro check` passes with 0 errors
