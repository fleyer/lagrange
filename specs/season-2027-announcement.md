# Spec: 2027 Season Booking Announcement

## Context

The 2027 Camino season is approaching and bookings are already open. First-time visitors landing on the site have no way of knowing this — nothing currently signals season dates or booking availability. We need a lightweight, visible announcement that tells new guests booking is open, without disrupting the existing page flow.

## Intent

Add a slim announcement bar communicating that the 2027 season is open for booking, with a direct link to the reservation section. It should read as good news / urgency (booking open), not as a warning or a legal banner.

## Placement

- Rendered as a thin bar directly below the `Header`, above `HeroSection`, in `PageLayout.astro`
- Sticky is not required — it scrolls away with the page (not fixed/sticky), keeping the hero fully visible on load
- Visible on all breakpoints; text wraps or truncates gracefully on mobile rather than being hidden

## Content structure

New content collection `season`, one Markdown file per locale under `src/content/season/` (`fr.md`, `en.md`, `de.md`, `es.md`), following the existing per-locale pattern used by `dining`, `contact`, etc.

Schema (added to `src/content.config.ts`):

```ts
const season = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/season" }),
  schema: z.object({
    message: z.string(),
    cta: z.string(),
  }),
});
```

Example (`fr.md`):

```md
---
message: "La saison 2027 approche : les réservations sont ouvertes !"
cta: "Réserver"
---
```

The bar links the CTA to `#reservation` (the existing `ReservationSection`).

## Component

- New component `SeasonAnnouncement.astro` in `src/components/`
- Props: `locale` (matches the convention of other section components)
- Single responsibility: render the message text and a CTA link/button to `#reservation`
- Scoped `<style>` only, no global CSS changes
- No JavaScript — plain anchor link, no dismiss/close behavior (out of scope; unlike `GdprBanner`, this is not a per-user dismissible banner)

## Out of scope

- No countdown timer or explicit season start/end dates in this iteration
- No dismiss/close button or localStorage persistence
- No changes to `ReservationSection` content itself

## Acceptance criteria

- [x] `season` content collection exists with a schema (`message`, `cta`) and one Markdown file per locale (FR/EN/DE/ES)
- [x] `SeasonAnnouncement.astro` renders the localized message and a CTA linking to `#reservation`
- [x] The bar appears between `Header` and `HeroSection` in `PageLayout.astro`
- [x] The bar is visible and readable on mobile without breaking layout or causing horizontal scroll
- [x] No JavaScript is used; it is pure HTML/CSS
- [x] `bun astro check` passes with no new type errors
