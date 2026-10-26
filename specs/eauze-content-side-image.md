# Spec: Info Page Content — Side-by-Side Image

## Intent

Let a paragraph in an info-page body (e.g. the Gallo-Roman treasure paragraph on the Éauze page, `histoire` section) be paired with an image laid out beside it — equal columns on larger screens, stacked on mobile — instead of always being full-width above/below the text. Reusable: any info-page content file (`eauze`, `camino`) can wrap any paragraph in it.

> **Revision note:** the first version of this spec tried a raw `<img>` tag with a float, embedded directly in plain `.md` body content. That doesn't work — Astro only optimizes images in Markdown through the `![]()` syntax or through `astro:assets`/`image()` on schema fields; a raw `<img src="...">` with a relative path is passed through untouched and never resolves. The project moved to MDX instead, which allows importing and using a real Astro component in the body with a properly optimized image. This revision documents the implemented approach.

## Content structure

- `@astrojs/mdx` is added to `astro.config.mjs`
- The `eauze` collection's loader in `src/content.config.ts` reads `*.mdx` instead of `*.md`; all four locale files (`fr`, `en`, `es`, `de`) are renamed `.mdx`
- Each locale file imports the component and the image as ordinary ESM statements right after the frontmatter, then wraps the paragraph:

```mdx
---
title: ...
---

import SideBySide from "../../components/SideBySide.astro";
import treasureImage from "../../assets/room-2-resized.jpg";

<h2 id="histoire">...</h2>

<SideBySide src={treasureImage} alt="Trésor monétaire d'Elusa">
Le 18 octobre 1985, un chantier de construction met au jour...
</SideBySide>
```

- The image is a normal `src/assets/` file imported in the `.mdx` body, so it goes through the same Vite/Astro image pipeline as everywhere else in the site (optimized, responsive, output as `_astro/*.webp`)
- Placeholder asset for now: `src/assets/room-2-resized.jpg`, reused across all four locales (same file, per-locale `alt` text)

## Component

New component: `src/components/SideBySide.astro`, mirroring the existing alternating image/text layout already used in `DiningSection.astro`.

- Props: `src: ImageMetadata`, `alt: string`, `side?: "left" | "right"` (default `"right"`)
- Default slot holds the paragraph text
- `Image` from `astro:assets`, `aspect-[4/3]` + `object-cover`, `rounded-lg`
- Layout: `grid-cols-2` at `sm`+ (image/text side by side), stacked on mobile; `side="left"` reorders the image to the second grid column via `sm:[&>*:first-child]:order-2`
- Not limited to the treasure paragraph — any info-page `.mdx` body can use it

## Acceptance criteria

- [x] `@astrojs/mdx` installed (pinned exact version) and registered in `astro.config.mjs`
- [x] `eauze` collection loader reads `*.mdx`; all four locale files renamed and migrated
- [x] `SideBySide.astro` created, rendering image + text in equal columns on `sm`+, stacked on mobile
- [x] Treasure paragraph in all four locales wrapped in `<SideBySide>` with the placeholder asset
- [x] `bun astro check` and `bun run build` pass with no errors; the image appears as an optimized `_astro/*.webp` in the build output
