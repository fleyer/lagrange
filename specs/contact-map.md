# Spec: Google Maps embed in Contact section

## Intent

Add an embedded Google Maps iframe to the Contact section so that desktop visitors can immediately see where the hosting place is located, without leaving the page.

## Layout

- On **desktop** (lg breakpoint and above): the contact card and the map sit side by side in a two-column layout. The map takes up the right column.
- On **mobile/tablet** (below lg): the map is hidden entirely (`hidden lg:block`). The contact card keeps its current centered layout.

The map should be roughly the same height as the contact card and fill its column naturally.

## Map source

The iframe `src` URL is obtained from Google Maps → Share → Embed a map. No API key required. The exact URL will be provided at implementation time (or hard-coded after retrieval from Google Maps for the address already in the content).

## Acceptance criteria

- [ ] A Google Maps iframe is visible in the Contact section on desktop (≥ lg breakpoint)
- [ ] The map is hidden on mobile and tablet (< lg)
- [ ] The map shows the correct location (matches `entry.data.address`)
- [ ] No API key or external script is added — embed-only iframe approach
- [ ] `bun astro check` passes with no new type errors
- [ ] The contact card retains its current appearance on all screen sizes
