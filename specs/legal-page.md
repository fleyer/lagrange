# Spec: Page mentions légales / confidentialité / cookies

## Intent

Create a dedicated legal page accessible via `/legal/` (FR), `/en/legal/`, `/de/legal/`, `/es/legal/`, grouping three sections:

1. **Mentions légales** — mandatory French legal notice (editor, host, intellectual property)
2. **Politique de confidentialité** — GDPR-compliant privacy policy explaining what data is collected (GTM/GA, contact form), why, and how
3. **Gestion des cookies** — explains the cookie banner choice and lets the visitor reset their consent

The page is required by French law (LCEN art. 6) and GDPR. It should be factual, clearly structured, and easy to scan.

## Content structure

A new `legal` content collection with one Markdown file per locale. Each file has frontmatter for metadata and the full content in the Markdown body, split into named sections via headings.

```
src/content/legal/
  fr.md
  en.md
  de.md
  es.md
```

### `src/content/legal/fr.md` (source of truth)

```yaml
---
title: Mentions légales & Confidentialité
description: Mentions légales, politique de confidentialité et gestion des cookies du site La Grange de Marie-France.
---
```

Body (Markdown) organised in three `## ` sections:
- `## Mentions légales`
- `## Politique de confidentialité`
- `## Gestion des cookies`

Translations in `en.md`, `de.md`, `es.md` mirror the same structure.

### Content for `fr.md`

**Mentions légales**
- Éditeur : Marie-France Lavigne, La Grange de Marie-France, 4 avenue de la Ténarèze, 32800 Éauze, France — Tél. : +33 6 61 24 48 04 — lagrangedemariefrance@gmail.com
- Hébergeur : Cloudflare Pages, 101 Townsend St, San Francisco, CA 94107, USA — cloudflare.com
- Directeur de publication : Marie-France Lavigne
- Propriété intellectuelle : all content (photos, texts) is the property of La Grange de Marie-France, all rights reserved. Reproduction without prior written consent is prohibited.

**Politique de confidentialité**
- Data collected: analytics data via Google Tag Manager / Google Analytics (anonymised IP), contact form data (name, email, message) processed via email only.
- Legal basis: legitimate interest for analytics (consent required via cookie banner); contractual necessity for contact data.
- Retention: analytics data 14 months; contact data until exchange is resolved.
- Rights: access, rectification, deletion, objection — contact lagrangedemariefrance@gmail.com or file a complaint with the CNIL (cnil.fr).
- No sale or sharing of data with third parties except Google Analytics.

**Gestion des cookies**
- The site uses a single analytics cookie (Google Analytics) only if the visitor clicks "Accepter" in the banner.
- Visitors can withdraw or change their consent at any time using the button below.
- Functional note: no strictly-necessary cookies are set.

## Interactive element: reset consent button

The "Gestion des cookies" section includes a client-side button that:
- Removes `localStorage.getItem("rgpd-consent")`
- Removes the `data-consent-set` attribute from `<html>`
- Shows the GDPR banner again (removes the `display:none` override or re-adds the banner to the DOM)

Since the banner is rendered server-side and already in the DOM (just hidden by CSS when `data-consent-set` is present), resetting simply removes the attribute and the localStorage key, which makes the banner visible again.

```html
<button id="reset-consent">Modifier mes préférences de cookies</button>
<script>
  document.getElementById("reset-consent")?.addEventListener("click", () => {
    localStorage.removeItem("rgpd-consent");
    document.documentElement.removeAttribute("data-consent-set");
    // gtag consent reset
    if (typeof gtag !== "undefined") {
      gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
    }
  });
</script>
```

The button label is localised in the Markdown frontmatter (`resetConsentLabel`).

## Page architecture

### New layout: `src/layouts/LegalLayout.astro`

A minimal page wrapper (not `PageLayout`) that includes:
- `<Head>` with the page's own title & description (from content collection)
- `<Header>` (same nav as main page)
- `<main>` with a single centred column (max-w-3xl) for the content
- `<Footer>`
- `<GdprBanner>` (so visitors can act on the cookie prompt even on this page)
- Flash-prevention script (same inline script as in `PageLayout`)

Does NOT include: hero, sections, GTM inline noscript (GTM is in `<Head>` already).

### New pages

```
src/pages/legal/index.astro          → /legal/   (FR)
src/pages/en/legal/index.astro       → /en/legal/
src/pages/de/legal/index.astro       → /de/legal/
src/pages/es/legal/index.astro       → /es/legal/
```

Each page passes its locale to `LegalLayout`.

### Head for legal pages

`Head.astro` currently generates canonical/OG only for the home routes. The legal pages need their own canonical URL.

Option: pass an optional `canonicalPath` prop to `Head.astro` (e.g., `"/legal/"`) so it can compute the correct canonical, hreflang, and OG tags. If omitted, it defaults to the existing home-page logic.

## Footer link

Add a "Mentions légales" link in `Footer.astro` pointing to the localised legal URL:
- FR: `/legal/`
- EN: `/en/legal/`
- DE: `/de/legal/`
- ES: `/es/legal/`

The link label is added to each `messages/*.json` file under key `footerLegal`.

## Acceptance criteria

- [ ] `src/content/legal/` exists with `fr.md`, `en.md`, `de.md`, `es.md` — each with complete content in all three sections
- [ ] `legal` collection defined in `src/content/config.ts` with a Zod schema (title, description, resetConsentLabel fields in frontmatter)
- [ ] `src/layouts/LegalLayout.astro` created — includes Head, Header, Footer, GdprBanner, flash-prevention script
- [ ] `Head.astro` accepts optional `canonicalPath` prop and uses it when provided
- [ ] Four page files created (fr, en, de, es), each rendering `LegalLayout` with its locale
- [ ] Legal page renders Markdown body as HTML (use Astro's `<Content />` component)
- [ ] Cookie reset button functional: removes localStorage key, removes `data-consent-set`, banner reappears
- [ ] `footerLegal` message key added to all four `messages/*.json`
- [ ] Footer renders a "Mentions légales" link pointing to the correct locale path
- [ ] `bun astro check` passes with no errors
- [ ] Pages accessible at `/legal/`, `/en/legal/`, `/de/legal/`, `/es/legal/`
