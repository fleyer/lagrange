# Spec: Bird Animation

**Status: on hold** — CSS animation direction per-instance proved unreliable across browsers. Revisit with a different technique (JS-driven or sprite-based).

## Intent

Add a one-shot CSS bird animation to the hero section that plays once on page load, giving the impression that a bird just flew off the building in the hero image. Pure CSS, no JavaScript. Implemented as a self-contained `BirdAnimation.astro` component that is trivial to drop anywhere.

## Visual concept

- A small bird silhouette (two curved arcs — the classic "M/W" wingbeat shape) appears near the roofline area of the hero image
- It flaps its wings and moves diagonally upward, then exits off-screen
- Multiple birds can be composed with staggered delays and different directions to create a flock
- Runs exactly once — no loop, no replay
- The animation resolves within ~3 seconds so it does not interfere with reading the hero text

## Component API

```astro
<BirdAnimation />
```

No required props. Optional props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bottom` | `string` | `"70%"` | CSS value for distance from the bottom of the parent |
| `left` | `string` | `"30%"` | CSS value for horizontal start position |
| `delay` | `string` | `"0.4s"` | CSS time value — staggers birds in a flock |
| `direction` | `"left" \| "up" \| "right"` | `"right"` | Horizontal drift of the flight path; all directions go upward |

The component renders a single `<div>` positioned `absolute` within the nearest positioned ancestor. `SectionHero` sets `position: relative` to contain the birds.

## Implementation constraints

- Pure CSS — `@keyframes` only, no `<script>` tag
- `animation-iteration-count: 1` + `animation-fill-mode: forwards` — plays once, freezes at the end (off-screen, effectively invisible)
- No layout impact — the bird element must be `position: absolute` and `pointer-events: none`
- The bird silhouette is CSS-only using `border-top` + `border-radius` on two `<span>` elements for the wings
- Must not cause a flash or jump on load — the element starts invisible (`opacity: 0`) and fades in as the animation begins
- Must respect `prefers-reduced-motion`: all animation rules are inside `@media (prefers-reduced-motion: no-preference)` so users with motion sensitivity see nothing

## Animation breakdown

Three simultaneous keyframe sequences:

1. **`bird-move`** — only `transform: translate() scale()`, exactly two keyframes (`from`/`to`), `ease-out`. One continuous curve, no mid-point keyframes, so the browser produces a single smooth acceleration. The horizontal target is controlled by `--fly-x`, a `@property`-registered CSS custom property so the browser can interpolate it correctly.
2. **`bird-fade`** — only `opacity`, independent of movement. Fades in quickly at the start, stays visible through most of the flight, fades out at the end. Kept separate so opacity timing does not break the movement curve.
3. **Wing flap** — `rotate` on each wing `<span>`, infinite, synced so both wings go up and down together.

`--fly-x` values by direction:

| `direction` | `--fly-x` |
|-------------|-----------|
| `"left"`    | `-15vw`   |
| `"up"`      | `6vw`     |
| `"right"`   | `40vw`    |

All directions share the same vertical target (`-50vh`).

## Acceptance criteria

- [x] `BirdAnimation.astro` exists in `src/components/`
- [x] Dropping `<BirdAnimation />` inside `SectionHero.astro` renders the bird animation on page load
- [x] The animation plays exactly once and the element is invisible after it ends
- [x] The bird starts near the roofline of the hero image (bottom ~70%) and exits off the top of the viewport
- [x] No JavaScript is used
- [x] `prefers-reduced-motion: reduce` suppresses the animation entirely
- [x] `bun astro check` reports 0 errors after the change
- [x] No visible layout shift caused by the component
- [x] `direction` prop controls horizontal drift; all three values produce upward flight
- [x] Movement uses a single `ease-out` curve with no mid-point keyframes (no acceleration steps)
