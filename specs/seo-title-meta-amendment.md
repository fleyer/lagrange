# Spec: SEO amendment — Title & meta description rewrite

Amends `specs/seo-v3.md` (meta description wording) and `specs/seo.md` (title format).

## Context

A manual SERP check on google.fr (France, personalization off, 2026-10-28) showed the homepage ranks poorly on generic queries but well on the brand name:

| Query | Organic position of `lagrangedemariefrance.fr` |
|---|---|
| `gite eauze` | Page 3 (~25th) |
| `gîte pèlerin eauze` | Page 2 (~17th) |
| `gîte étape eauze` | Not in pages 1–2 |
| `au pousse pèlerins eauze` | Page 1 (2nd) |

Directories and pilgrim portals (chemindecompostelle.com, Podiensis, haltesverscompostelle.eu) also list the gîte and often outrank the site itself.

The current FR title, `Gîte La Grange - Au Pousse Pèlerins, à Éauze`, is brand-first and does not contain the phrase "gîte pèlerin" or "GR 65". Target query terms should come first, with the brand kept after them so brand-query ranking is not lost.

All values live in `src/content/meta/{fr,en,de,es}.md` (`title`, `description`), consumed by `src/components/Head.astro`. No `.astro` change is required.

---

## Changes

### Titles — target phrase first, brand second, ≤ ~65 characters

| Locale | New `title` |
|---|---|
| FR | `Gîte pèlerin à Éauze – La Grange, Au Pousse Pèlerins (GR 65)` |
| EN | `Pilgrim Hostel in Éauze – La Grange, Au Pousse Pèlerins (GR 65)` |
| DE | `Pilgerherberge in Éauze – La Grange, Au Pousse Pèlerins (GR 65)` |
| ES | `Albergue en Éauze – La Grange, Au Pousse Pèlerins (GR 65)` |

Rationale: the first words match "gîte pèlerin Éauze" (the best-placed non-brand opportunity, currently page 2). "GR 65" adds the route keyword used by pilgrim searches. "Au Pousse Pèlerins" stays in the title to preserve the brand-query rank.

### Descriptions — ≤ 155 characters, concrete offer, call to action

| Locale | New `description` |
|---|---|
| FR | `Gîte pèlerin à Éauze (Gers), sur la Via Podiensis (GR 65) : chambres, gîtes indépendants, repas du soir et petit-déjeuner. Réservez auprès de Marie-France.` |
| EN | `Pilgrim hostel in Éauze (Gers) on the Via Podiensis (GR 65) of the Camino de Santiago: rooms, private gîtes, evening meal, breakfast. Book with Marie-France.` |
| DE | `Pilgerherberge in Éauze (Gers) an der Via Podiensis (GR 65) des Jakobswegs: Zimmer, Gîtes, Abendessen und Frühstück. Anfrage bei Marie-France.` |
| ES | `Albergue de peregrinos en Éauze (Gers), en la Via Podiensis (GR 65) del Camino de Santiago: habitaciones, gîtes, cena y desayuno. Reserva con Marie-France.` |

Rationale: the description does not affect ranking directly, but it affects click-through rate. It now lists what is actually offered (rooms, gîtes, meals) instead of generic "warm welcome, WiFi".

`ogLocale` is unchanged. `og:title` and `og:description` follow automatically since `Head.astro` reuses the same values.

---

## Relationship to `seo-v3.md`

`seo-v3.md` P1 proposes adding "alternative à l'hôtel" / "alternative to a hotel" to the descriptions. That change has not been applied. This amendment **replaces** the description wording from seo-v3 P1 for all four locales. The "hotel" synonym is dropped here because it attracts a different intent (hotel-booking searches) in which directories dominate, and it dilutes the description. The `accommodations/*.md` "rooms" keyword (seo-v3 P2) is unaffected.

The full "Saint-Jacques-de-Compostelle" form (seo-v3 P1, second table) is not in the new titles for length reasons. It stays in the FR body copy and can be added to the EN/DE/ES body copy separately if wanted.

---

## Out of scope

- Off-site actions (Google Business Profile reviews, backlinks from Tourisme Gers, the Éauze tourist office, Podiensis, Gîtes-refuges). These matter more than metadata for "gite eauze" but are not code changes.
- JSON-LD changes (`sameAs`, opening hours), covered by `specs/google-maps-visibility.md`.
- Titles for the Éauze, Camino and Gallery pages.

---

## Measurement

Compare in Search Console, Performance → Queries, 4–6 weeks after deployment against the same period before:

- Position and CTR for `gîte pèlerin eauze`
- Position for `gite eauze` and `gîte étape eauze`
- Position for `au pousse pèlerins eauze` (must stay at or near 2nd or better)

Note: the sample is small (≈50 impressions per query per month), so only large movements are meaningful.

---

## Acceptance criteria

- [x] `meta/fr.md` title and description match the tables above
- [x] `meta/en.md` title and description match the tables above
- [x] `meta/de.md` title and description match the tables above
- [x] `meta/es.md` title and description match the tables above
- [x] No title exceeds 70 characters and no description exceeds 160 characters (titles 57–63, descriptions 142–157)
- [x] Each title contains the brand "Au Pousse Pèlerins" and "GR 65"
- [x] `bun astro check` passes with no new errors
- [x] `specs/seo-v3.md` P1 (hotel wording) is marked as superseded by this spec
