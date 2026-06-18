# Spec: Gallery Section

## Intent

Replace the gallery placeholder with a masonry-style photo grid showcasing the refuge, the surrounding landscape, and the pilgrim experience. Images have different native dimensions and are displayed at their natural proportions — no forced uniform height, no cropping to a fixed ratio.

## Content structure

Images live under `src/assets/gallery/`. They are listed in a new `gallery` content collection defined in `src/content/config.ts`:

```ts
// src/content/config.ts
const gallery = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      images: z.array(
        z.object({
          src: image(),
          alt: z.string(),
        })
      ),
    }),
});
```

A single data file `src/content/gallery/images.json` lists every photo:

```json
{
  "images": [
    { "src": "../../assets/gallery/exterior.jpg", "alt": "..." },
    { "src": "../../assets/gallery/dortoir.jpg",  "alt": "..." }
  ]
}
```

`alt` text is in French (the base locale); no per-locale duplication needed unless translations are added later. The `alt` attribute is required and must be descriptive.

## Layout

- CSS multi-column masonry layout (`columns-2` on mobile, `columns-3` at `md`, optionally `columns-4` at `xl` if the image count warrants it)
- Each image fills its column width; height is determined by its natural aspect ratio — no `aspect-*` constraint
- `break-inside-avoid` on each item so images are never sliced across column breaks
- Uniform gap between items using `gap-*` or `space-y-*`
- Section has the same horizontal padding and vertical rhythm as other sections
- Section title (`galleryTitle` i18n key) centered above the grid, same typographic style as other section headings
- No captions, no lightbox, no hover effects — static display only

## Image treatment

- Rendered with Astro's `<Image />` component for automatic optimisation
- `width` set to the column pixel width (e.g. 600px) so Astro generates an appropriately sized output; `height` omitted or derived from the source so the natural ratio is preserved
- `loading="lazy"` on all images except optionally the first two
- Rounded corners consistent with the site aesthetic (`rounded-lg` or `rounded-xl`)
- No border or drop shadow

## Acceptance criteria

- [ ] `gallery` collection defined in `src/content/config.ts` with the schema above
- [ ] `src/content/gallery/images.json` exists with at least 6 placeholder entries (actual photos to be added later; placeholder entries must have valid `src` paths pointing to existing image files)
- [ ] `SectionGallery.astro` queries the collection with `getEntry()` and renders the masonry grid
- [ ] Images display at their native aspect ratio — no forced uniform height
- [ ] Layout is 2 columns on mobile and 3 columns at `md`+
- [ ] Astro `<Image />` component is used (no bare `<img>` tags)
- [ ] `bun astro check` passes with no errors
