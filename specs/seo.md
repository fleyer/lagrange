# Spec: SEO

## Target searches

The site must appear on Google when someone searches for (all languages matter equally — most pilgrims are foreign):

| Language | Target queries |
|---|---|
| FR | `gîte éauze` · `refuge éauze` · `hébergement éauze` · `gîte pèlerin éauze` · `chemin de saint-jacques éauze` |
| EN | `hostel éauze` · `pilgrim accommodation éauze` · `camino de santiago éauze` · `where to sleep éauze` |
| DE | `pilgerherberge éauze` · `jakobsweg éauze` · `unterkunft éauze` · `herberge éauze` |
| ES | `albergue éauze` · `peregrino éauze` · `camino de santiago éauze` · `alojamiento éauze` |

## Audit: what is missing today

| Signal | Current state | Gap |
|---|---|---|
| `<title>` | Generic, no location | Must include **Éauze**, **gîte**, **refuge** |
| `<meta description>` | Vague, no keywords | Must include target keywords |
| Open Graph | None | Needed for social sharing & link previews |
| Structured data | None | `LodgingBusiness` JSON-LD is critical for local search |
| Sitemap | None | Needed for Google to index all 4 locales |
| `robots.txt` | None | Explicit allow-all needed |
| `<link rel="canonical">` | None | Prevents duplicate content between locales |
| `hreflang` | None | Needed for multilingual signal to Google |
| Google Business Profile | Unknown | Not a code task — must be done separately |

## Advice on each point

### 1. Title & meta description (highest impact)

Each locale must have a keyword-rich title and description in its own language — not a translation of the French one, but a version optimised for the local search terms used by pilgrims of that nationality.

The formula: **`{proper name} — {accommodation type in local language} à/in/en Éauze · {trail name in local language}`**

| Locale | Title | Description |
|---|---|---|
| FR | `La Grange de Marie France — Gîte pèlerin à Éauze · Chemin de Saint-Jacques` | `Gîte, refuge et hébergement pour pèlerins à Éauze (Gers), sur le Chemin de Saint-Jacques-de-Compostelle. Accueil chaleureux, repas, WiFi. Contactez Marie France.` |
| EN | `La Grange de Marie France — Pilgrim Hostel in Éauze · Camino de Santiago` | `Welcoming hostel and refuge for pilgrims in Éauze (Gers), on the Camino de Santiago / Way of Saint James. Warm welcome, meals, WiFi. Contact Marie France.` |
| DE | `La Grange de Marie France — Pilgerherberge in Éauze · Jakobsweg` | `Herzliche Herberge und Unterkunft für Jakobspilger in Éauze (Gers), auf dem Jakobsweg. Warme Aufnahme, Mahlzeiten, WLAN. Kontakt: Marie France.` |
| ES | `La Grange de Marie France — Albergue de peregrinos en Éauze · Camino de Santiago` | `Albergue y refugio para peregrinos en Éauze (Gers), en el Camino de Santiago. Acogida cálida, comidas, WiFi. Contacta con Marie France.` |

These must be stored in the content layer (new `site/meta` Markdown files per locale), not hard-coded in `.astro` files.

> **Key principle:** each language version targets the vocabulary native speakers actually type, not a word-for-word translation. "Hostel" ranks in English; "Herberge" and "Pilgerherberge" rank in German; "Albergue" ranks in Spanish.

### 2. Structured data — `LodgingBusiness` JSON-LD (high impact for local search)

A JSON-LD block in `<head>` tells Google exactly what this place is. For a gîte/hostel the right schema type is `LodgingBusiness` (or `Hostel`). The `description` field should be in the current page locale so it matches what Google shows in international results.

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "La Grange de Marie France",
  "description": "Pilgrim hostel on the Camino de Santiago in Éauze",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4 avenue de la Ténarèze",
    "addressLocality": "Éauze",
    "postalCode": "32800",
    "addressCountry": "FR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 43.8610716, "longitude": 0.1033391 },
  "telephone": "+33661244804",
  "email": "lagrangedemariefrance@gmail.com",
  "amenityFeature": ["WiFi", "Garage vélos et motos", "Arrêt de bus","bicycle","moto", "parking", "food"],
  "url": "https://lagrangedemariefrance.fr"
}
```

This is rendered as an inline `<script type="application/ld+json">` in `<head>`.

### 3. Open Graph tags (medium impact)

Required for proper link previews on WhatsApp, Facebook, etc. (pilgrims share on social):

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.jpg" />  <!-- 1200×630px photo of the gîte -->
<meta property="og:url" content="https://lagrangedemariefrance.fr" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="fr_FR" />
```

The `og:locale` tag must reflect the current page's language (`fr_FR`, `en_US`, `de_DE`, `es_ES`), and `og:locale:alternate` should list the others. The `og:title` and `og:description` must use the same locale-specific copy as the `<title>` and `<meta name="description">`.

A dedicated OG image (photo of the exterior or a welcoming interior shot) should be added to `/public/`.

### 4. Sitemap + `robots.txt` (medium impact)

Add the official `@astrojs/sitemap` integration. It requires `site` to be set in `astro.config.mjs`:

```js
export default defineConfig({
  site: "https://lagrangedemariefrance.fr",
  // ...
})
```

`robots.txt` in `/public/`:
```
User-agent: *
Allow: /
Sitemap: https://lagrangedemariefrance.fr/sitemap-index.xml
```

### 5. `hreflang` + canonical (medium impact)

With 4 locales (fr, en, de, es), Google needs `<link rel="alternate" hreflang="...">` tags in each page's `<head>` pointing to the other locale URLs. This avoids duplicate-content penalties and routes the right language to the right user.

```html
<link rel="alternate" hreflang="fr" href="https://lagrangedemariefrance.fr/" />
<link rel="alternate" hreflang="en" href="https://lagrangedemariefrance.fr/en/" />
<link rel="alternate" hreflang="de" href="https://lagrangedemariefrance.fr/de/" />
<link rel="alternate" hreflang="es" href="https://lagrangedemariefrance.fr/es/" />
<link rel="alternate" hreflang="x-default" href="https://lagrangedemariefrance.fr/" />
<link rel="canonical" href="https://lagrangedemariefrance.fr{currentPath}" />
```

### 6. Google Business Profile (highest local impact — not a code task)

This is arguably the most impactful action for local searches like "gîte éauze". Register or claim the listing at **business.google.com** with:
- Name: La Grange de Marie France
- Category: Hostel / Gîte
- Address: 4 avenue de la Ténarèze, 32800 Éauze
- Website, phone, email
- Photos of the property
- Opening hours / check-in hours

Once verified, the listing appears in the Google Maps "local pack" at the top of results.

## Implementation scope (code changes)

1. Add `site/meta` content collection with localised title, description, og:image alt
2. Inject `<title>`, `<meta name="description">`, Open Graph, `hreflang`, `canonical`, and JSON-LD into each locale's `<head>` — preferably via a shared `<Head>` component
3. Add `@astrojs/sitemap` integration and set `site` in `astro.config.mjs`
4. Add `/public/robots.txt`
5. Add an OG image to `/public/` (1200×630 px)

## Acceptance criteria

- [ ] Each locale page has a keyword-rich, localised `<title>` and `<meta name="description">` from the content layer
- [ ] `LodgingBusiness` JSON-LD is present in `<head>` on all pages
- [ ] Open Graph tags are present, pointing to a real OG image
- [ ] `hreflang` and `canonical` tags are correct on all 4 locale pages
- [ ] `/sitemap-index.xml` is generated at build time and lists all 4 locales
- [ ] `/robots.txt` exists and references the sitemap
- [ ] `bun astro check` passes with no new errors
- [ ] Google Business Profile is created/claimed (out of code scope — tracked separately)
