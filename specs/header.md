# Spec: Responsive Header

## Intent

The header must be fully usable on mobile devices. On small screens, the full navigation (5 section links + 4 language codes) is too wide to display inline — it should collapse behind a hamburger button and open as a full-screen overlay.

## Current state

`Header.astro` displays a sticky bar with:
- Brand link "Lagrange" (left)
- Nav row: 5 section anchors + language switcher with FR / EN / DE / ES (right)

## Layout

### Desktop (≥ 768px)

- The header bar is a single row
- Nav links are **centered** in the bar
- Brand name "Lagrange" sits at the far left
- Nav links in order: Home · Le Refuge · Hébergements · Restauration · Galerie · Contact
- Language switcher sits at the far right as a **dropdown**: shows the current locale code (e.g. `FR`) with a chevron; clicking opens a menu listing all 4 locales with the active one highlighted

### Mobile (< 768px)

- Only the brand name and a hamburger button are visible in the header bar
- Tapping the hamburger opens a **full-screen overlay** covering the entire viewport
- The overlay shows a top bar (brand + close button), nav links vertically centered, and the language switcher pinned to the bottom
- Tapping any nav link or the close button closes the overlay

## Implementation constraints

- **No JavaScript framework** — toggle driven by a hidden CSS checkbox (`peer` / `peer-checked` Tailwind pattern); no JS island required for open/close
- The hamburger and close icons are inline SVGs — no icon library
- A small inline `<script>` closes the overlay when an anchor link is tapped (hash navigation does not reload the page)

## Language switcher

- **Desktop**: dropdown anchored to the far right of the header bar. Trigger shows the current locale code + chevron. Dropdown lists all 4 locales; active one in dark text, others muted. Uses `details`/`summary` for CSS-only toggle.
- **Mobile overlay**: 4 locale codes in a row at the bottom of the full-screen overlay, active one in dark text, others muted.

## Acceptance criteria

- [x] Nav links are centered in the desktop header bar
- [x] A "Home" link (anchored to `#hero`) is the first item in the nav
- [x] On mobile, only brand + hamburger button are visible in the collapsed header
- [x] Tapping the hamburger reveals all navigation links (including Home) and language codes
- [x] Tapping a section link closes the menu and scrolls to the section
- [x] Tapping a language link navigates to the new locale
- [x] Desktop language switcher is a dropdown showing the current locale code + chevron
- [x] Tapping outside the open menu closes it
- [x] On desktop, the hamburger is hidden and the full nav row is shown
- [x] `bun astro check` passes with 0 errors
