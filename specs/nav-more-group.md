# Spec: Grouped "More" nav menu

## Intent

Keep internal links to Éauze, Chemin de Compostelle, and the Gallery reachable from every page's navigation (home page, Éauze page, Camino page, legal page) without each occupying its own slot in the main nav row. Group them under a single disclosure labelled "More" / "En savoir plus" so the primary nav reads as fewer, more scannable items, while the three links keep the same markup weight (plain `<a>`, crawlable, no JS required to reach them) — removing a nav entry must not turn into removing the link.

## Current state

`Header.astro` desktop nav is a flat row of 8 links: Home · Le Refuge · Éauze · Le Chemin · Hébergements · Restauration · Galerie · Réservation. Mobile overlay mirrors the same 8 links vertically. Éauze and Le Chemin point to standalone pages (`infoPageSlugs`); Galerie points to `#gallery` on the home page only (so on the Éauze/Camino/legal pages this link is dead — see Out of scope).

## Layout

### Desktop (≥ 768px)

- Main nav row becomes: Home · Le Refuge · Hébergements · Restauration · Réservation · **More ▾**
- "More" is a `details`/`summary` dropdown, same CSS-only pattern as the language switcher (no new JS, matches `[header.md](header.md)`)
- Dropdown panel lists, in order: Galerie, Éauze, Le Chemin — as plain `<a>` elements (not duplicated as buttons), always present in the DOM for crawlers regardless of open/closed state
- Trigger shows the label (translated) + a `ChevronDown` icon from `@lucide/astro`, rotated when open (pure CSS, `details[open]` selector)

### Mobile (< 768px)

- The full-screen overlay already shows every link at once (no horizontal space constraint) — it keeps a flat list, now with a small uppercase group label ("Plus" / "More") inserted before Galerie/Éauze/Le Chemin to signal the grouping visually, but all links stay plain, un-nested, equally focusable `<a>` elements. No nested disclosure on mobile — one expand/collapse interaction (the hamburger) is enough.

## Accessibility

- The desktop trigger is a native `<summary>` inside `<details>`: focusable, operable with Enter/Space, exposes expanded/collapsed state to AT automatically (no manual `aria-expanded` needed, same reasoning as the existing language switcher).
- The dropdown panel is a `<ul>` with `role` left as default (list), wrapped in a container with `aria-label` set to the same translated "More" string, so screen-reader users navigating by landmark/group hear "More, menu" (via a nested `<nav aria-label="...">` or `<ul>` depending on what reads cleaner — pick `<nav>` to match the existing `navMain`/`navMobile` pattern, giving three labelled nav landmarks total on desktop: main, "more", mobile-hidden).
- Closing on link click: not required for `details` (navigation unloads/scrolls the page anyway) but closing on outside click and on `Escape` should match the existing language-switcher dropdown behavior for consistency — reuse `[accessibility.md](accessibility.md)`'s established patterns rather than inventing new ones.
- Touch targets: dropdown links get the same `inline-flex` sizing already applied to locale links in `[accessibility.md](accessibility.md)` (≥ 24×24 px, aim 44×44); the trigger `summary` keeps the existing `min-h-8` sizing used by the language trigger.
- Contrast: dropdown links use `text-base-content` (not a muted variant), consistent with primary nav links — no new contrast risk.
- Mobile group label is decorative/visual only (`aria-hidden="true"` on the small uppercase text) since the links themselves are already in an `aria-label`led `<nav>`; it must not be the only distinguishing text for screen-reader users navigating link-by-link — the link text itself (translated page names) remains the accessible name.
- No link is ever removed from the DOM or hidden from crawlers — this only changes visual grouping, so no `display: none` / `hidden` on the links themselves, only the `details` native collapse (which still exposes content to crawlers that execute minimal HTML parsing; the links are standard anchor tags either way).

## Internationalisation

- New Paraglide message keys: `navMore` (trigger label, e.g. "En savoir plus" / "More") in all 4 locale files
- Existing `navEauze`, `navCamino`, `navGallery` keys are reused unchanged

## Implementation notes

- New message key(s) added to `messages/{fr,en,de,es}.json`
- `Header.astro`: move the Éauze/Camino/Gallery `<a>` tags out of the main `<nav>` into a new `details`/`summary` + `<nav aria-label={m.navMore()}>` block, desktop section only
- Mobile overlay: keep links flat, insert one `aria-hidden` label span before the grouped links
- No changes to `infoPageSlugs`, routing, or the Gallery section itself

## Out of scope

- Fixing the dead `#gallery` link on non-home pages (Éauze/Camino/legal) — pre-existing issue, separate spec if addressed
- Any change to which pages exist or their URLs/slugs
- SEO impact beyond keeping the links present and crawlable (grouping is presentation-only)

## Acceptance criteria

- [x] Desktop nav shows 5 direct links + one "More" dropdown trigger
- [x] "More" dropdown contains Galerie, Éauze, Le Chemin as plain, always-in-DOM `<a>` links
- [x] Dropdown trigger and panel both have translated accessible names (`navMore`)
- [x] Dropdown is keyboard-operable (native `details`/`summary`, no custom JS required to open/close)
- [x] Dropdown closes on outside click and `Escape`, matching the language switcher's existing behavior (neither currently has JS-driven outside-click/Escape handling; both are native `details`/`summary`)
- [x] Dropdown links meet the 24×24 px touch target rule
- [x] Mobile overlay still lists all links flat, with a visual (aria-hidden) group label before the grouped ones
- [x] No existing link's `href` changes; no page is removed or made unreachable
- [x] `bun astro check` passes with 0 errors
