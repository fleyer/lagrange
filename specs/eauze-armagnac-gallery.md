# Spec: Éauze Page — Armagnac Section Horizontal Gallery

## Intent

Add a small horizontal photo strip to the "Capitale de l'Armagnac" section (anchor `armagnac`) on the Éauze page: pictures of the local eau-de-vie production (stills, vines, barrels). All images sit on a single row, same height, widths adjusting to fill the row evenly. On narrow (mobile) screens only 2 images show — no horizontal scrolling, no carousel, the rest are simply hidden.

## Content structure

Each locale `.mdx` body imports a small Éauze-specific wrapper component and only supplies translated `alt` text — the image files themselves are centralized in one place, not re-imported per locale:

```mdx
import ArmagnacGallery from "../../components/eauze/ArmagnacGallery.astro";

<h2 id="armagnac">Capitale de l'Armagnac</h2>

<ArmagnacGallery alts={[
  "Un alambic à Armagnac",
  "Distillation de l'Armagnac",
  "Vignes autour d'Éauze",
  "Fûts de vieillissement de l'Armagnac",
]} />
```

Placeholder assets for now: the existing resized files (`alambic1-resized.jpg`, `alambic3-resized.jpg`, `cepage5-resized.jpg`, `tonneau5-resized.jpg`), same files across all four locales — swapping in real photos later only touches `ArmagnacGallery.astro`, not every locale file. All four locale `.mdx` files place this under their own `armagnac` heading.

## Components

- `src/components/HorizontalGallery.astro` — generic, reusable primitive (any info-page section could use it)
  - Props: `images: { src: ImageMetadata; alt: string }[]` (any length ≥ 2)
  - Single flex row, fixed height (`h-40` mobile / `h-56` on `sm`+); each image is `flex-1` so widths split the row evenly regardless of native aspect ratio, `object-cover` to fill the fixed height
  - No scrolling, no wrapping — strictly one row
  - Items from index 2 onward are `hidden` below the `sm` breakpoint, so mobile always shows exactly the first 2 images; all images show at `sm` and above
  - `rounded-lg` corners, small gap between images, consistent with other gallery/image treatments on the site
- `src/components/eauze/ArmagnacGallery.astro` — Éauze-page-specific wrapper
  - Props: `alts: [string, string, string, string]`
  - Imports the 4 placeholder assets once and renders `HorizontalGallery` with them, pairing each with the locale's `alt` text
  - Lives under `src/components/eauze/` alongside `EauzeHeroGallery.astro`, the folder for components specific to this one page

## Acceptance criteria

- [x] `HorizontalGallery.astro` created, rendering a single-row strip of equal-height images
- [x] `ArmagnacGallery.astro` created under `src/components/eauze/`, centralizing the 4 placeholder image imports behind an `alts` prop
- [x] Mobile (`<sm`): only the first 2 images render visibly
- [x] `sm` and above: all images in the array render, same row, same height
- [x] No horizontal scroll/overflow at any breakpoint
- [x] Placed under the `armagnac` heading in all four Éauze locale files (`fr`, `en`, `es`, `de`), each only passing translated `alts`
- [x] `bun astro check` and `bun run build` pass with no errors
