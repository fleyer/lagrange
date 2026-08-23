# Spec: SEO v3 — Keyword coverage audit & targeted improvements

## Context

A keyword audit of all `src/content/` files revealed gaps between the target searches defined in v1 and the actual copy present on the site. This version closes those gaps so every high-intent query has at least one natural occurrence in a crawlable location (title, meta description, or visible page body).

---

## Keyword audit results

| Keyword | Present? | Notes |
|---|---|---|
| `saint-jacques-de-compostelle` (full form) | Partial | Only in `meta/fr.md` description. Absent from EN/DE/ES equivalents. |
| `camino de santiago` | Yes | In `hero/es.md`, all 4 `meta/` files. Good coverage. |
| `refuge` | Yes | `gallery/` alt texts, all 4 `meta/` files, `refuge/en.md` title. |
| `hotel` | **No** | Not found anywhere — pilgrims often search "hotel éauze" even for non-hotel stays. |
| `rooms` | Partial | One occurrence in `accommodations/en.md` body ("2 rooms"). Not present as a deliberate keyword. |
| `eauze` / `éauze` | Yes | All 4 `meta/` files. Good coverage. |
| `gers` | Yes | All 4 `meta/` files. Good coverage. |

---

## Why these keywords matter

Pilgrims searching for accommodation do not always know the local vocabulary (gîte, refuge, albergue). They often fall back to generic terms like "hotel" or "rooms". Google also cross-references query vocabulary with synonyms, but an explicit presence in copy is stronger. Targeting both the pilgrim-specific terms **and** the generic alternatives maximises the chance of appearing in the top results across the full range of intents.

---

## P1 — Add "hotel" as a secondary keyword in meta descriptions

The word "hotel" captures a distinct intent bucket (generic lodging search). Add it naturally as a soft synonym in the description for each locale without changing the positioning of the site.

Suggested updated descriptions (delta only — additions in **bold**):

| Locale | Updated `description` |
|---|---|
| FR | `Gîte, refuge et hébergement pour pèlerins à Éauze (Gers), sur le Chemin de Saint-Jacques-de-Compostelle. **Alternative à l'hôtel** pour un accueil chaleureux, repas, WiFi. Contactez Marie France.` |
| EN | `Welcoming hostel and refuge for pilgrims in Éauze (Gers), on the Camino de Santiago / Way of Saint James. **A cosy alternative to a hotel** — warm welcome, meals, WiFi. Contact Marie France.` |
| DE | `Herzliche Herberge und Unterkunft für Jakobspilger in Éauze (Gers), auf dem Jakobsweg. **Gemütliche Alternative zum Hotel** — warme Aufnahme, Mahlzeiten, WLAN. Kontakt: Marie France.` |
| ES | `Albergue y refugio para peregrinos en Éauze (Gers), en el Camino de Santiago. **Una alternativa acogedora al hotel** — acogida cálida, comidas, WiFi. Contacta con Marie France.` |

---

## P1 — Add full "Saint-Jacques-de-Compostelle" form to EN/DE/ES meta

The full proper noun is a high-value keyword in all languages. French already uses it. Add the natural equivalent in each locale:

| Locale | Where to add | Phrase to include |
|---|---|---|
| EN | `meta/en.md` title or description | `Way of Saint James / Saint-Jacques-de-Compostelle` |
| DE | `meta/de.md` title | `Jakobsweg / Camino de Santiago` (already has Jakobsweg — add Camino variant) |
| ES | `meta/es.md` description | `Camino de Santiago / Santiago de Compostela` |

---

## P2 — Strengthen "rooms" keyword in accommodations content

A pilgrim searching "rooms in éauze" should land on this site. The accommodation body currently mentions "2 rooms" only in passing. Each locale's `accommodations/*.md` should include a natural sentence that surfaces the word as a keyword (e.g., "We offer two private rooms and a shared dormitory.").

Files to update: `accommodations/fr.md`, `accommodations/en.md`, `accommodations/de.md`, `accommodations/es.md`.

---

## P3 — Extend target query table

Add the following queries as secondary targets now covered by the above changes:

| Language | Additional queries |
|---|---|
| FR | `hotel éauze` · `chambre éauze` · `saint-jacques-de-compostelle éauze` |
| EN | `hotel éauze` · `rooms éauze` · `saint james way éauze` |
| DE | `hotel éauze` · `zimmer éauze` · `camino éauze` |
| ES | `hotel éauze` · `habitaciones éauze` · `santiago compostela éauze` |

---

## Out of scope for v3

- Structured data for individual rooms (`schema.org/HotelRoom`) — overkill for a 2-room property.
- Blog / long-form content targeting informational queries ("stages on the camino") — separate content strategy decision.

---

## Acceptance criteria

- [ ] `meta/fr.md` description includes "hôtel" as secondary keyword
- [ ] `meta/en.md` description includes "hotel" and "Saint-Jacques-de-Compostelle"
- [ ] `meta/de.md` description includes "Hotel" and both "Jakobsweg" + "Camino de Santiago"
- [ ] `meta/es.md` description includes "hotel" and "Santiago de Compostela"
- [ ] All 4 `accommodations/*.md` files mention rooms explicitly as a keyword
- [ ] `bun astro check` passes with no new errors
