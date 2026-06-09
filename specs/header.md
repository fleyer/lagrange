# Spec: Responsive Header

## Intent

The header must be fully usable on mobile devices. On small screens, the full navigation (5 section links + 4 language codes) is too wide to display inline — it should collapse behind a hamburger button and open as a drawer or dropdown menu.

## Current state

`Header.astro` displays a sticky bar with:
- Brand link "Lagrange" (left)
- Nav row: 5 section anchors + language switcher with FR / EN / DE / ES (right)

## Layout

### Desktop (≥ 768px)

- The header bar is a single row
- Nav links are **centered** in the bar
- Language switcher sits at the far right, outside the centered nav
- Brand name "Lagrange" sits at the far left
- Nav links in order: Home · Le Refuge · Hébergements · Restauration · Galerie · Contact

### Mobile (< 768px)

- Only the brand name and a hamburger button are visible in the header bar
- Tapping the hamburger opens a **drawer** sliding in from the right (or a full-width dropdown below the bar — either is acceptable)
- The drawer contains all nav links (including Home) and the 4 language codes, stacked vertically
- Tapping any link or the close button closes the drawer
- The drawer must be dismissible by tapping outside it

## Implementation constraints

- **No JavaScript framework** — use a `<details>` / `<summary>` pattern or the HTML `popover` API so the toggle works without a JS island
- DaisyUI is available; the `drawer` or `dropdown` components are acceptable if they rely only on CSS/checkbox state
- The hamburger icon should be an SVG (three lines), no icon library needed
- Keep the drawer close on anchor navigation (section links are `#hash` hrefs — the page does not reload, so the drawer must close; a small inline `<script>` is acceptable here as a last resort if the pure-CSS approach cannot handle it)

## Language switcher in the drawer

Show the 4 language codes stacked, with the current locale visually distinct (same treatment as desktop: dark text vs muted).

## Acceptance criteria

- [x] Nav links are centered in the desktop header bar
- [x] A "Home" link (anchored to `#hero`) is the first item in the nav
- [x] On mobile, only brand + hamburger button are visible in the collapsed header
- [x] Tapping the hamburger reveals all navigation links (including Home) and language codes
- [x] Tapping a section link closes the menu and scrolls to the section
- [x] Tapping a language link navigates to the new locale
- [x] Tapping outside the open menu closes it
- [x] On desktop, the hamburger is hidden and the full nav row is shown
- [x] `bun astro check` passes with 0 errors
