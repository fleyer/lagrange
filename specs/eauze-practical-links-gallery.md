# Spec: Éauze Page — Practical Links Gallery (Market & Pool)

## Intent

In the "Ce que trouvent les pèlerins" section, replace the plain inline text links to the weekly market and the municipal swimming pool with a small 2-image visual gallery, each image wrapped in a link to the relevant page. Reuses the existing `HorizontalGallery` primitive rather than building a new layout from scratch. Wider aspect than the Armagnac gallery (shorter height relative to width), since there are only 2 images instead of 4.

## Content structure

Same centralization pattern as `ArmagnacGallery`: a small Éauze-specific wrapper component holds the (placeholder) images and takes only the translated `alt` text and locale-specific `href` as props.

```mdx
import PracticalLinksGallery from "../../components/eauze/PracticalLinksGallery.astro";

<PracticalLinksGallery
  marketAlt="Marché hebdomadaire d'Éauze"
  marketHref="https://www.armagnac-dartagnan.com/fetes-manifestations/marche-hebdomadaire-eauze/"
  poolAlt="Piscine municipale d'Éauze"
  poolHref="https://www.tourisme-occitanie.com/fr/fiche/equipement/piscine-municipale-d-eauze-eauze_TFOSITRA2_LOI_6684169/"
/>
```

- Placeholder assets: reuse existing resized files not yet used elsewhere on this page as decoration (`room-1-resized.jpg` for the market, `refuge-2-resized.jpg` for the pool) — swapped for real photos later
- `href` is per-locale (the market page exists in a locale-specific path for `fr`/`en`/`es`/`de`; the pool page is French-only, so all locales point to the same French URL)
- The plain-text sentence introducing the pool/market stays as prose (no inline markdown links anymore — the gallery below it carries the links)

## Component

`HorizontalGallery.astro` gains two additions (stays backward-compatible with its existing Armagnac usage):

- Each image item may carry an optional `href`; when present, the image renders inside an `<a href="..." target="_blank" rel="noopener">` instead of a bare `<Image>`
- A `height` prop (Tailwind class string) overrides the default `h-40 sm:h-56`, so this 2-image usage can request a shorter/wider strip (e.g. `h-28 sm:h-40`) without touching the Armagnac call site

New component: `src/components/eauze/PracticalLinksGallery.astro`

- Props: `marketAlt`, `marketHref`, `poolAlt`, `poolHref` (all `string`)
- Imports the 2 placeholder images once, renders `HorizontalGallery` with a wider `height` and the 2 linked images
- Same mobile behavior as `HorizontalGallery` (both images always visible here since there are only 2 — the "hide beyond index 2" rule never kicks in)

## Acceptance criteria

- [x] `HorizontalGallery.astro` supports an optional `href` per image (anchor-wrapped) and an optional `height` override, with no change to the existing Armagnac gallery's rendered output when neither is used
- [x] `PracticalLinksGallery.astro` created under `src/components/eauze/`, rendering exactly 2 linked images at a wider aspect than the Armagnac gallery
- [x] Both images link out (`target="_blank"`, `rel="noopener"`) to the market and pool pages respectively
- [x] Inline markdown links removed from the "Ce que trouvent les pèlerins" prose in all four locales; the gallery replaces them
- [x] All four locale `.mdx` files pass their own translated `alt` text and locale-appropriate `href`
- [x] `bun astro check` and `bun run build` pass with no errors
