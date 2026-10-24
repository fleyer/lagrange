# Spec: Éauze & Chemin de Compostelle informational pages

## Intent

Improve organic search ranking by publishing two new, substantive informational pages:

1. **Éauze** — the town's Gallo-Roman history (Elusa), Armagnac heritage, and practical amenities a pilgrim arriving on foot will find.
2. **Chemin de Compostelle** — the Via Podiensis/GR65 route, Éauze's place on it between neighbouring stages, and pilgrim practicalities (credential/stamp, luggage transfer, season).

A prior keyword-gap audit (`specs/seo-v3.md`) found the site only ever *mentions* Éauze/the Camino in short metadata strings — no standalone page explains either in real depth. Real, unique, informative prose is also what earns rankings beyond keyword density (E-E-A-T).

This explicitly overrides `CLAUDE.md`'s "no additional pages" default for this one case, per the site owner's request — two new static pages, not sections squeezed onto the one-page homepage.

## Content outline

### Éauze page (per locale: fr/en/de/es)
- Intro: Éauze, a Gascon market town on the Camino, gateway to Bas-Armagnac
- `## Elusa, une cité gallo-romaine` (anchor `histoire`): civitas capital of Novempopulania; the *Trésor d'Éauze* coin hoard (discovered 1985, ~28,000 coins, displayed at the Musée archéologique d'Éauze)
- `## Capitale de l'Armagnac` (anchor `armagnac`): Bas-Armagnac AOC, distilleries, tastings
- `## Ce que trouvent les pèlerins` (anchor `commodites`): bakery, supermarket, pharmacy, restaurants, bus stop, bank/ATM — framed for someone arriving on foot
- `## Se loger à Éauze` (anchor `hebergement`): short paragraph + CTA back to the gîte

### Camino page (per locale)
- Intro: the Via Podiensis / GR65 and Éauze's place on it
- `## La Via Podiensis` (anchor `voie`): Le Puy-en-Velay to the Pyrenees, GR65 waymarking
- `## Éauze, étape sur le chemin` (anchor `etapes`): neighbouring stages (Montréal-du-Gers, Condom, Nogaro) — distances sourced from tourism sites/GPX tracks, **not an official topo-guide**; flagged for owner verification before publish
- `## Informations pratiques` (anchor `pratique`): créanciale/stamp, typical daily distances, luggage transport, best season
- `## Faire étape à La Grange` (anchor `sejour`): CTA back to the gîte

Facts gathered so far (verify before publishing — see Acceptance criteria):
- Trésor d'Éauze: hoard of ~28,000 Gallo-Roman coins + ~50 jewelry pieces (~120 kg), found 18 Oct 1985, buried after 261 AD, shown at the Musée archéologique d'Éauze. Sources: [musees-occitanie.fr](https://musees-occitanie.fr/en/musee/musee-archeologique-le-tresor-deauze/), [guide-tourisme-france.com](https://www.guide-tourisme-france.com/VISITER/musee-archeologique-tresor--eauze-15367.htm)
- Route distances: Montréal-du-Gers → Éauze ≈ 17 km; Éauze → Nogaro ≈ 20 km; Éauze → Condom (via Montréal-du-Gers) ≈ 34.6 km as one long stage. Sources: [armagnac-dartagnan.com](https://www.armagnac-dartagnan.com/en/have-to-do/litinerance/the-compostelle-paths-of-the-gers/), [jerusalemway.org](https://www.jerusalemway.org/en/stage/eauze-condom/)

## Content collections

```ts
const infoPage = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(z.object({ label: z.string(), anchor: z.string() })),
});

const eauze = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/eauze" }), schema: infoPage });
const camino = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/camino" }), schema: infoPage });
```

Files: `src/content/eauze/{fr,en,de,es}.md`, `src/content/camino/{fr,en,de,es}.md`. Same shape as the existing `legal` collection, minus `resetConsentLabel`.

## Layout

New `src/layouts/InfoPageLayout.astro`, modeled on `src/layouts/LegalLayout.astro`: same doctype/head/GTM-consent/Header/Footer/GdprBanner skeleton and `getEntry()`-inside-layout pattern, but:
- Props: `locale` and `collection: "eauze" | "camino"` only — no `slug` prop (see routing below).
- No consent-reset button (not relevant here).
- A bottom CTA block linking to `/#accommodations` and `/#reservation` (locale-aware), reusing the existing `accommodationsCta`/`reservationCta` Paraglide messages.
- Kept separate from `LegalLayout` (different concerns, no shared editing risk).

## Routing

Localized slugs per language (not one slug reused across locales):

| Page | fr | en | de | es |
|---|---|---|---|---|
| Éauze | `/eauze/` | `/en/eauze/` | `/de/eauze/` | `/es/eauze/` |
| Camino | `/chemin-de-compostelle/` | `/en/camino-de-santiago/` | `/de/jakobsweg/` | `/es/camino-de-santiago/` |

Centralized once in `src/lib/infoPages.ts`:
```ts
export const infoPageSlugs = {
  eauze:  { fr: "eauze", en: "eauze", de: "eauze", es: "eauze" },
  camino: { fr: "chemin-de-compostelle", en: "camino-de-santiago", de: "jakobsweg", es: "camino-de-santiago" },
} as const;
```
Imported by `InfoPageLayout.astro`, `Header.astro`, and `RefugeSection.astro` — no duplicated maps. No dynamic routing, no SSR — stays fully static per `CLAUDE.md`.

## Head / hreflang

`Head.astro`'s current hreflang block appends one `hreflangSuffix` uniformly across all locale base paths — correct for `/legal/` (same slug everywhere) but wrong once the Camino page has a different slug per locale. Add an optional prop:
```ts
hreflangPaths?: Record<string, string>; // full path per locale, overrides hreflangSuffix when given
```
`InfoPageLayout` builds this map from `infoPageSlugs[collection]` and passes it. Existing callers (`LegalLayout`, homepage) are unaffected. No new JSON-LD type — the existing `Hostel` schema stays as the one entity on every page (consistent with `specs/google-maps-visibility.md`'s entity-consistency concern).

## Navigation & internal linking

- `Header.astro`: fix the pre-existing bug where in-page anchors (`#welcome`, `#the-refuge`, etc.) are bare fragments that only resolve on the homepage — prefix them with the current locale's home path so they work from the new pages too. Add two nav links (Éauze, Camino) using `infoPageSlugs`.
- `messages/{fr,en,de,es}.json`: add `navEauze`, `navCamino` keys.
- `RefugeSection.astro`: one small contextual link to each new page near the existing discover/getting-there CTAs, using new `learnMoreEauze`/`learnMoreCamino` message keys.
- Both new pages link back to `/#accommodations` and `/#reservation`.

## Sitemap

No `astro.config.mjs` change — `@astrojs/sitemap` crawls generated static routes automatically, same as `/legal/` today.

## Acceptance criteria

- [x] `infoPage` zod schema + `eauze`/`camino` collections added to `src/content.config.ts`
- [x] 8 markdown files written with genuinely unique, substantive prose per locale
- [ ] Historical/geographical facts (Trésor d'Éauze, GR65 stage distances) verified by the site owner against a real source before publishing live — flagged in content as sourced from tourism sites, not an official topo-guide
- [x] `src/lib/infoPages.ts` created with the slug map, reused by layout/header/section
- [x] `InfoPageLayout.astro` created, reused by both pages, no duplicated HTML skeleton
- [x] `Head.astro` gains the optional `hreflangPaths` prop, existing callers unaffected
- [x] 8 page files created, each a thin wrapper passing `locale`/`collection`
- [x] `Header.astro`: nav links added in all 4 message files, anchors fixed to resolve from any page
- [x] `RefugeSection.astro`: one contextual link added to each new page
- [x] Both new pages link back to `/#accommodations` and `/#reservation` (locale-aware)
- [ ] `bun astro check` passes
- [ ] Pages reachable at all 8 URLs; sitemap includes them after build
