# Spec: SEO

## Target searches

The site must appear on Google when someone searches for (all languages matter equally — most pilgrims are foreign):

| Language | Target queries |
|---|---|
| FR | `gîte éauze` · `refuge éauze` · `hébergement éauze` · `gîte pèlerin éauze` · `chemin de saint-jacques éauze` |
| EN | `hostel éauze` · `pilgrim accommodation éauze` · `camino de santiago éauze` · `where to sleep éauze` |
| DE | `pilgerherberge éauze` · `jakobsweg éauze` · `unterkunft éauze` · `herberge éauze` |
| ES | `albergue éauze` · `peregrino éauze` · `camino de santiago éauze` · `alojamiento éauze` |

---

## v1 — Initial implementation (done)

### What was built

| Signal | Status |
|---|---|
| `<title>` + `<meta name="description">` — localised, keyword-rich, from content layer | ✅ done |
| `LodgingBusiness` JSON-LD in `<head>` | ✅ done |
| Open Graph tags (type, url, title, description, image w/ dimensions, locale, alternate locales) | ✅ done |
| `hreflang` (fr/en/de/es + x-default) + `canonical` | ✅ done |
| `@astrojs/sitemap` integration, configured for all 4 locales | ✅ done |
| `/public/robots.txt` | ✅ done |
| OG image generation via `astro-og-canvas` at `/open-graph/{locale}.png` | ✅ done |
| Content collection `meta` (title, description, ogLocale per locale) | ✅ done |

### Localised meta copy

| Locale | Title | Description |
|---|---|---|
| FR | `La Grange de Marie France — Gîte pèlerin à Éauze · Chemin de Saint-Jacques` | `Gîte, refuge et hébergement pour pèlerins à Éauze (Gers), sur le Chemin de Saint-Jacques-de-Compostelle. Accueil chaleureux, repas, WiFi. Contactez Marie France.` |
| EN | `La Grange de Marie France — Pilgrim Hostel in Éauze · Camino de Santiago` | `Welcoming hostel and refuge for pilgrims in Éauze (Gers), on the Camino de Santiago / Way of Saint James. Warm welcome, meals, WiFi. Contact Marie France.` |
| DE | `La Grange de Marie France — Pilgerherberge in Éauze · Jakobsweg` | `Herzliche Herberge und Unterkunft für Jakobspilger in Éauze (Gers), auf dem Jakobsweg. Warme Aufnahme, Mahlzeiten, WLAN. Kontakt: Marie France.` |
| ES | `La Grange de Marie France — Albergue de peregrinos en Éauze · Camino de Santiago` | `Albergue y refugio para peregrinos en Éauze (Gers), en el Camino de Santiago. Acogida cálida, comidas, WiFi. Contacta con Marie France.` |

### v1 acceptance criteria

- [x] Each locale page has a keyword-rich, localised `<title>` and `<meta name="description">` from the content layer
- [x] `LodgingBusiness` JSON-LD is present in `<head>` on all pages
- [x] Open Graph tags are present, pointing to a real OG image
- [x] `hreflang` and `canonical` tags are correct on all 4 locale pages
- [x] `/sitemap-index.xml` is generated at build time
- [x] `/robots.txt` exists
- [ ] Google Business Profile is created/claimed (out of code scope — tracked separately)

---

## v2 — Fixes and enhancements

### Domain migration — deferred (blocks all SEO until done)

`astro.config.mjs` currently has `site: "https://fleyer.github.io"` — the developer's GitHub Pages staging URL. Every SEO-critical URL generated from it (sitemap entries, canonical, hreflang, OG image) will be wrong once the site goes live on the real domain.

`lagrangedemariefrance.fr` is currently in use by an existing Wix website. The domain switch to this Astro site is a separate migration step, not a code change to make now. Until the domain is cut over, the staging URL is intentional.

**When the domain is ready to switch:**
- `astro.config.mjs` — change `site` to `"https://lagrangedemariefrance.fr"`
- `public/robots.txt` — update sitemap URL to `https://lagrangedemariefrance.fr/sitemap-index.xml`
- Point the DNS / GitHub Pages custom domain setting to the new domain

### P1 — Twitter / X Card tags

Pilgrims share on WhatsApp (reads OG) but also on X/Facebook (reads Twitter Card). Both sets of tags should be present. WhatsApp already works via OG; Twitter Card is missing.

Add to `src/components/Head.astro` after the Open Graph block:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
```

### P1 — `og:site_name`

Standard property expected by most link-preview renderers. Prevents the site name from being inferred (sometimes wrongly) from the URL.

Add to `src/components/Head.astro` inside the Open Graph block:

```html
<meta property="og:site_name" content="La Grange de Marie France" />
```

### P1 — `og:image:alt`

Image alt text for the OG image improves accessibility and is used by some platforms. Requires a new field in the content layer so each locale can provide a translated alt string.

- `src/content.config.ts` — add `ogImageAlt: z.string()` to the `meta` schema
- `src/content/meta/{fr,en,de,es}.md` — add localised `ogImageAlt` value
- `src/components/Head.astro` — add `<meta property="og:image:alt" content={ogImageAlt} />` after `og:image:height`

Suggested alt values:

| Locale | `ogImageAlt` |
|---|---|
| FR | `La Grange de Marie France — Gîte pèlerin à Éauze` |
| EN | `La Grange de Marie France — Pilgrim Hostel in Éauze` |
| DE | `La Grange de Marie France — Pilgerherberge in Éauze` |
| ES | `La Grange de Marie France — Albergue de peregrinos en Éauze` |

### P1 — `amenityFeature` completeness in JSON-LD

The current `amenityFeature` array in `Head.astro` uses bare strings (`["WiFi", "Garage vélos et motos", "Arrêt de bus"]`). The correct schema.org pattern is `LocationFeatureSpecification` objects, and several amenities from the spec are missing.

Replace with:

```json
"amenityFeature": [
  { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
  { "@type": "LocationFeatureSpecification", "name": "Bicycle storage", "value": true },
  { "@type": "LocationFeatureSpecification", "name": "Motorcycle storage", "value": true },
  { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
  { "@type": "LocationFeatureSpecification", "name": "Meals", "value": true },
  { "@type": "LocationFeatureSpecification", "name": "Bus stop", "value": true }
]
```

### P2 — Apple touch icon

Improves appearance when a pilgrim bookmarks the site to their iOS home screen. Low effort: add a 180×180px PNG to `/public/` and reference it in `Head.astro`.

- `/public/apple-touch-icon.png` — 180×180px image (crop or reuse an existing asset)
- `src/components/Head.astro` — add `<link rel="apple-touch-icon" sizes="180x180" href={...} />`

### Out of scope for v2

- Google Business Profile — register/claim at business.google.com with the property details from the JSON-LD block. Highest local impact; not a code change.
- Performance / Core Web Vitals — separate concern.

---

## v2 acceptance criteria

- [ ] Twitter Card tags present on all locale pages
- [ ] `og:site_name` present on all locale pages
- [ ] `og:image:alt` present on all locale pages, localised
- [ ] `amenityFeature` uses `LocationFeatureSpecification` objects and covers all 6 amenities
- [ ] Apple touch icon present and linked in `<head>`
- [ ] `bun astro check` passes with no new errors
- [ ] Domain cutover done: `site` in `astro.config.mjs` and `robots.txt` updated to `lagrangedemariefrance.fr`
- [ ] Sitemap validated post-cutover: all 4 locale URLs use `lagrangedemariefrance.fr`
- [ ] JSON-LD validated at validator.schema.org
- [ ] OG preview validated at opengraph.xyz per locale
