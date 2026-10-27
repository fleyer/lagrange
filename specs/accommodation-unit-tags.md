# Spec: Accommodation Unit Tags

## Intent

Each accommodation unit's `description` currently ends with a free-text, comma-separated list of amenities/features (e.g. "Cuisine équipée, salon, TV, balcon couvert, climatisation, sanitaires partagés." or "Salle d'eau privative, ventilation mécanique."), baked into the HTML-ish description string. Extract that list into a dedicated `tags` field so it can be rendered as discrete badges/chips on the accommodation card instead of inline prose, and so the description keeps only the room layout details.

## Content structure

Each unit in `src/content/accommodations/{fr,en,es,de}.md` gains a `tags` array of short strings, alongside the existing `description`:

```yaml
units:
  - id: tonneau
    name: Le Tonneau PMR
    capacity: 4 personnes
    description: |
      2 chambres · Accès PMR</br>
      chambre 1 : 2 lits 90</br>
      chambre 2 : 1 lit en 140</br>
      </br>
      Nuit à partir de 50€ pour 2 personnes, sans service.
    tags:
      - Salle d'eau privative
      - Ventilation mécanique
```

- `tags` is a flat list of short labels (no HTML, no trailing punctuation), one per amenity/feature.
- The amenity sentence is removed from `description` once its items move to `tags`. Any remaining trailing sentence that isn't an amenity list (e.g. the Tonneau's pricing note) stays in `description`.
- Apply the same extraction to all four locales (`fr`, `en`, `de`, `es`) for all three units (`cepages`, `alambic`, `tonneau`), keeping tag wording/order equivalent across locales.
- Note: `en.md` currently phrases the shared-bathroom amenity as a separate sentence ("... air conditioning. Shared bathroom.") rather than comma-joined — normalize it to a tag like the other locales (e.g. `Shared bathroom` becomes its own tag, not a lingering sentence in `description`).

## Schema change

In `src/content.config.ts`, the `accommodations` collection's unit schema gains a `tags` field:

```ts
units: z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    capacity: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
),
```

## Rendering

In `AccommodationsSection.astro`, render `unit.tags` as a row of badges inside the card body, below the description (or in place of where the amenity sentence used to sit visually). Use existing daisyUI `badge` styling consistent with the site's design tokens — no new ad-hoc CSS. No JS needed (static list render).

## Acceptance criteria

- [ ] `tags: z.array(z.string())` added to the `accommodations` unit schema in `content.config.ts`
- [ ] All four locale files (`fr`, `en`, `es`, `de`) have the amenity list moved from `description` into `tags` for all three units
- [ ] `description` no longer contains the comma-separated amenity sentence; non-amenity trailing text (e.g. Tonneau's pricing note) is preserved
- [ ] `en.md`'s "Shared bathroom" sentence is folded into `tags` rather than left as prose
- [ ] `AccommodationsSection.astro` renders `unit.tags` as badges on each card
- [ ] `bun astro check` passes with no errors
