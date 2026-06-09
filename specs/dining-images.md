# Spec: Dining Section — Meal Images

## Intent

Enrich each meal entry in the dining section with a photograph displayed side-by-side with the meal details. Images alternate left/right between meals to create rhythm and visual interest without repeating a single layout pattern.

## Content structure

Each meal object in the dining YAML files gains an optional `image` field pointing to a local asset:

```yaml
meals:
  - name: Petit déjeuner
    note: en libre service
    image: ../../assets/dining/breakfast.jpg
    items:
      - Pain
      - beurre
      ...
```

Images live under `src/assets/dining/`. One image per meal, named consistently across locales (the image field is locale-independent — the same file can be referenced in all language files).

## Layout

- Each meal renders as a horizontal row: image on one side, text on the other
- First meal: image on the **left**, text on the right
- Second meal: image on the **right**, text on the left
- Third meal: image on the **left**, text on the right
- … and so on (index % 2 determines the order)
- Image and text are equal-width columns (`grid-cols-2`) at `sm` breakpoint and above
- On mobile: image stacks above the text
- Thin horizontal rule between meals (unchanged from current layout)
- If a meal has no image, it renders text-only centered (backwards-compatible)

## Image treatment

- Fixed aspect ratio — `aspect-[4/3]` — so all images are the same height regardless of source dimensions
- `object-fit: cover` to fill the box without distortion
- Rounded corners consistent with the site's general aesthetic
- No caption needed

## Acceptance criteria

- [ ] `image` field added as `image().optional()` in the dining collection schema in `content.config.ts`
- [ ] All four locale files (`fr`, `en`, `es`, `de`) reference the same image paths
- [ ] `SectionDining.astro` renders the alternating image/text layout using Astro's `<Image />` component
- [ ] Layout is two equal columns at `sm`+, stacked on mobile
- [ ] Meals without an image fall back to centered text-only
- [ ] `bun astro check` passes with no errors
