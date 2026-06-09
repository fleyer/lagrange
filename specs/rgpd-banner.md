# Spec: RGPD / Cookie Consent Banner

## Intent

Display a cookie consent banner on first visit. The visitor can accept or refuse. The choice is persisted in `localStorage` so the banner never reappears after a decision is made.

This is a static site with no analytics or third-party tracking scripts currently wired up — the banner is a good-faith RGPD notice that can be extended later if tracking is added.

## Content structure

A new `gdpr` content collection holds the localised banner copy:

```yaml
# src/content/gdpr/fr.md
---
message: Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter ou refuser leur utilisation.
accept: Accepter
refuse: Refuser
---
```

One file per locale (`fr`, `en`, `es`, `de`). The collection is locale-aware, resolved the same way as other collections (locale passed as prop).

## Behaviour

- On page load, check `localStorage.getItem("rgpd-consent")`.
- If the value is `"accepted"` or `"refused"`, the banner is **not shown**.
- If the key is absent, the banner is **shown**.
- Clicking **Accept** → sets `localStorage.setItem("rgpd-consent", "accepted")`, hides the banner.
- Clicking **Refuse** → sets `localStorage.setItem("rgpd-consent", "refused")`, hides the banner.
- Both actions are final for the session and all future visits (until storage is cleared).

## Flash prevention

A tiny inline `<script>` in `<head>` — before the banner component — adds the attribute `data-consent-set` to `<html>` if a consent value already exists in `localStorage`. The banner component renders with `hidden` by default and removes it only if `data-consent-set` is absent. This prevents a visible flash of the banner on return visits.

```html
<script>
  if (localStorage.getItem("rgpd-consent")) {
    document.documentElement.setAttribute("data-consent-set", "");
  }
</script>
```

The banner's initial visibility is controlled by CSS:

```css
[data-consent-set] #rgpd-banner {
  display: none;
}
```

## Component

`src/components/GdprBanner.astro`:

- Fetches the `gdpr` locale entry
- Renders a fixed bar at the **bottom** of the viewport (`position: fixed; bottom: 0`)
- Full viewport width, stone/warm background matching the site palette
- Message text on the left (or centered on mobile), two buttons on the right
- Buttons: Accept (filled, stone-900) and Refuse (ghost/outline)
- An inline `<script>` handles the click events and hides the banner

## Placement in `index.astro`

The banner is placed **outside `<main>`**, after `</main>`, and the flash-prevention inline script is added to `<head>`.

## Acceptance criteria

- [ ] `src/content/gdpr/` exists with `fr.md`, `en.md`, `es.md`, `de.md`
- [ ] `gdpr` collection defined in `content.config.ts`
- [ ] `GdprBanner.astro` component created and added to `index.astro`
- [ ] Flash-prevention inline script added to `<head>` in `index.astro`
- [ ] Banner is hidden on first load if consent is already stored
- [ ] Accept and Refuse buttons each persist the choice and hide the banner
- [ ] `bun astro check` passes with no errors
