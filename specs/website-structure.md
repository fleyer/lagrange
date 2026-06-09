# Spec: One-Page Website Structure

## Intent

Establish the skeleton of the site: a sticky header with section navigation and the six content sections as clearly identified scroll targets. No real content yet — this spec is about structure, anchors, and navigation behaviour.

## Sections

| ID | Nav label | Purpose |
|----|-----------|---------|
| `hero` | — (no nav link, always visible on load) | Full-screen landing with name and tagline |
| `the-refuge` | The Refuge | Introduce the place, its spirit, and the hosts |
| `accommodations` | Accommodations | Options for staying (dormitory, private room, camping…) |
| `dining` | Dining | Food offer (breakfast, dinner, self-catering…) |
| `gallery` | Gallery | Photo grid |
| `contact` | Contact | Address, how to book, contact form or email |

> **Name rationale:** "The Refuge" is used instead of "About" — it is evocative for Camino pilgrims and describes the place's identity rather than generic corporate copy.

## Header

- Sticky (`position: sticky; top: 0`) so it remains visible while scrolling
- Contains the site name/logo on the left and nav links on the right
- Nav links: The Refuge · Accommodations · Dining · Gallery · Contact
- Active link reflects the section currently in the viewport (Intersection Observer)
- No active-section highlighting — plain anchor links only
- On mobile: nav collapses or stacks (exact treatment is out of scope for this spec — just ensure it doesn't overflow on small screens)

## Smooth scrolling

- Implemented via CSS only: `scroll-behavior: smooth` on `html`
- Each nav link is an anchor `<a href="#section-id">`
- No JavaScript scroll libraries

## Component breakdown

```
src/
  components/
    Header.astro          — sticky nav
    SectionHero.astro     — #hero
    SectionRefuge.astro   — #the-refuge
    SectionAccommodations.astro — #accommodations
    SectionDining.astro   — #dining
    SectionGallery.astro  — #gallery
    SectionContact.astro  — #contact
  pages/
    index.astro           — composes all sections
  styles/
    global.css            — scroll-behavior: smooth + CSS reset/tokens
```

## Content placeholders

Each section renders a visible heading and a short placeholder paragraph — enough to confirm scroll targets work and the page has realistic height. No real copy or images yet.

## Acceptance criteria

- [x] `src/styles/global.css` exists with `scroll-behavior: smooth` on `html`
- [x] `Header.astro` is sticky and contains anchor links to all five nav sections
- [x] All six section components exist and are composed in `index.astro`
- [x] Each section has a matching `id` attribute that corresponds to its nav anchor
- [x] Clicking a nav link scrolls smoothly to the correct section
- [x] No horizontal overflow on a 375 px wide viewport
- [x] Scaffold files (`Welcome.astro`, `Layout.astro`, default assets) removed or replaced
