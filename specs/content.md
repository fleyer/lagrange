# Spec: Content — Extraction & Markdown Storage

## Source

All content is extracted from **[lagrangedemariefrance.fr](https://www.lagrangedemariefrance.fr)**, the current website of the establishment. French is the source language; English translations are written from the French originals.

---

## Content map

### Hero
| Field | Value |
|-------|-------|
| Title | La Grange de Marie France |
| Tagline | *Au Pousse Pèlerins* — un lieu de repos et de joie sur le Chemin de Saint-Jacques |

### The Refuge (presentation)
Host welcome message and spirit of the place:
> "J'ai à coeur de vous offrir un temps de repos, de détente et surtout un moment de joie" — maison modeste et simple offrant le nécessaire pour une belle soirée et nuit.

### Accommodations — 3 units

| Name | Capacity | Beds | Features |
|------|----------|------|----------|
| Les Cépages | 6–7 pers. | 1×140, 1×90, 2×90 (2 rooms) | Kitchen, lounge, TV, covered balcony, shared bathroom |
| L'Alambic | 5–6 pers. | 3×90, 1×140+90 (2 rooms) | Kitchen, covered balcony, shared bathroom |
| Le Tonneau PMR | 4 pers. | 2×90 (en-suite), 1×140 (en-suite) | Wheelchair accessible, mechanical ventilation |

**Pricing (per person):**
- Night + breakfast: 35 €
- Half-board (standard): 55 €
- Half-board (terroir): 65 €
- Extras: heating/AC 3 €/split · top sheet +3 € · e-bike charge 2 €

### Dining

**Breakfast** (self-service): bread, butter, homemade jams, yogurt, cheese, egg, banana.

**Half-board standard (55 €):** local apéritif, starter (soup or salad), main (meat + vegetables), dessert, wine.

**Half-board terroir (65 €):** Pousse Rapière apéritif, local-produce salad, regional duck or beef, Côtes de Gascogne, trou gascon, croustade, Armagnac.

### Gallery
Photo grid — images to be provided by the owner. Placeholder until assets are available.

### Contact
- **Address:** 4 avenue de la Ténarèze, 32800 Éauze
- **Phone:** 06 61 24 48 04
- **Email:** lagrangedemariefrance@gmail.com
- **Bus stop:** 3 minutes away
- **Facebook:** lagrangedemariefrance

---

## Storage architecture

Content lives in `src/content/` as Markdown files, one per section per language. Components query them via Astro Content Collections — no text is hardcoded in `.astro` files.

### Folder structure

```
src/content/
  config.ts              — collection schemas (Zod)
  hero/
    fr.md
    en.md
  refuge/
    fr.md
    en.md
  accommodations/
    fr.md
    en.md
  dining/
    fr.md
    en.md
  contact/
    fr.md
    en.md
```

> Gallery has no Markdown content — images only. It is out of scope for this spec.

### Collection schema (`src/content/config.ts`)

Each collection uses a minimal schema with typed frontmatter for structured fields, and the Markdown body for longer prose.

```ts
// hero
{ title: z.string(), tagline: z.string() }

// refuge
{ title: z.string() }   // body = welcome prose

// accommodations
{
  title: z.string(),
  units: z.array(z.object({
    name: z.string(),
    capacity: z.string(),
    description: z.string(),
  })),
  pricing: z.array(z.object({ label: z.string(), price: z.string() })),
}

// dining
{ title: z.string() }   // body = meals description

// contact
{
  title: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  extras: z.array(z.string()).optional(),
}
```

### Language selection in components

Components receive the current locale as a prop from `index.astro` and call `getEntry(collection, locale)` to load the matching `.md` file:

```astro
---
// index.astro
const locale = Astro.currentLocale ?? "fr";
---
<SectionRefuge locale={locale} />
```

```astro
---
// SectionRefuge.astro
const { locale } = Astro.props;
const entry = await getEntry("refuge", locale);
const { Content } = await entry.render();
---
<section id="the-refuge">
  <h2>{entry.data.title}</h2>
  <Content />
</section>
```

This keeps Paraglide messages for UI strings (nav labels, switcher) and Content Collections for editorial content.

---

## Acceptance criteria

- [x] `src/content/config.ts` defines all five collections with Zod schemas
- [x] Each collection has `fr.md` and `en.md` files populated with extracted content
- [x] `SectionHero`, `SectionRefuge`, `SectionAccommodations`, `SectionDining`, `SectionContact` each load their content via `getEntry()`
- [x] French page renders French content; English page renders English content
- [x] No hardcoded editorial text remains in `.astro` component files
- [x] `bun run check` passes
