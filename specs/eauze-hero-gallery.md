# Spec: Éauze Page — Hero Photo Gallery

## Intent

Give the Éauze info page a small photo gallery near the top, above the article content, so the page opens with imagery instead of straight into text. The gallery is a **bento-style mosaic**: one larger tile and several smaller tiles of different sizes, arranged so the whole composition fills a single square area (not a uniform grid of equal squares, and not a tall masonry column). Placeholder images are used for now; real photography is swapped in later without layout changes.

This is specific to the Éauze page only — other info pages (`camino`, `legal`, etc.) are unaffected.

## Content structure

The `eauze` content collection (`src/content/config.ts`) gains an optional `heroImages` field, locale-independent like the dining `image` field (same files referenced from every locale's frontmatter):

```yaml
heroImages:
  - src: ../../assets/eauze-hero/lagrange.jpg
    alt: "..."
  - src: ../../assets/eauze-hero/room.jpg
    alt: "..."
  - src: ../../assets/eauze-hero/alambic.jpg
    alt: "..."
  - src: ../../assets/eauze-hero/cepage.jpg
    alt: "..."
  - src: ../../assets/eauze-hero/tonneau.jpg
    alt: "..."
```

Schema addition:

```ts
heroImages: z.array(z.object({ src: image(), alt: z.string() })).optional(),
```

Exactly **4 images**, in a fixed order (position 1 = big tile, positions 2–4 = the three small tiles — see Layout). For now, reuse the already-resized placeholder assets in `src/assets/` (`lagrange-resized.jpg`, `room-1-resized.jpg`, `alambic1-resized.jpg`, `cepage5-resized.jpg`) as stand-ins; `alt` text can be minimal placeholder copy. All four locale files (`fr`, `en`, `es`, `de`) reference the same four files.

## Component

New component: `src/components/EauzeHeroGallery.astro`.

- Props: `images: { src: ImageMetadata; alt: string }[]` (expects exactly 4)
- Rendered from `InfoPageLayout.astro`, only when `collection === "eauze"` and `entry.data.heroImages` is present, placed between the `<h1>` title and the section nav
- Not a generic/reusable gallery component — scoped to this page's bento layout

## Layout

- Outer wrapper is a square (`aspect-square`), full width of the content column, with a bottom margin matching the page's vertical rhythm
- CSS grid, 4 columns × 4 rows, filling the square:
  - Tile 1 (big): spans columns 1–2, rows 1–4 (half width, full height)
  - Tile 2: columns 3–4, rows 1–2 (top-right quarter)
  - Tile 3: column 3, rows 3–4 (bottom-right, left half)
  - Tile 4: column 4, rows 3–4 (bottom-right, right half)
- Small gap between tiles (`gap-2`), same corner rounding as other image sections (`rounded-lg`/`rounded-xl`)
- Mobile: same mosaic proportions preserved (grid scales down with the square container — no stacking into a single column), since the square aspect is part of the intended look at all breakpoints

## Image treatment

- Each tile: `<Image>` from `astro:assets`, `object-cover` + `w-full h-full` to fill its grid cell regardless of native aspect ratio
- `loading="eager"` on the big tile, `loading="lazy"` on the small tiles
- No captions, no hover/lightbox — static display, consistent with the existing `GallerySection`

## Acceptance criteria

- [ ] `heroImages` field (array of 4 `{ src, alt }`) added to the `eauze` collection schema, optional
- [ ] All four locale files (`fr`, `en`, `es`, `de`) populated with the same 4 placeholder image paths
- [ ] `EauzeHeroGallery.astro` created, rendering a bento grid (1 big tile + 3 smaller tiles) inside a square container, matching the layout above
- [ ] `InfoPageLayout.astro` renders `EauzeHeroGallery` only for the `eauze` collection, between the `<h1>` and the section nav, only when `heroImages` is present
- [ ] Images use Astro's `<Image />` component with `object-cover`
- [ ] Square proportions are preserved responsively (no breakpoint collapses it to a single column)
- [ ] `bun astro check` passes with no errors
