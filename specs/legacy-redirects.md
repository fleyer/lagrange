# Spec: Redirect legacy Wix URLs to the index page

## Intent

The site was previously built on Wix. Some old Wix URLs still appear as 404 in the web console. Redirect them permanently (301) to the home page so search engines drop the 404s and visitors following old links land on the site.

## Approach

Add a Cloudflare Pages `_redirects` file at `public/_redirects`. Astro copies `public/` into `dist/` unchanged, so the site stays fully static (no SSR, no endpoints, no config change).

Explicit per-URL rules are used instead of a catch-all: Cloudflare Pages evaluates redirects before static assets, so `/* / 301` would break `/_astro/*` files, and a `200` catch-all creates soft 404s in Google's eyes.

## Redirects

| Source | Destination | Status |
|--------|-------------|--------|
| `/la-salle` | `/` | 301 |
| `/l-alambic` | `/` | 301 |
| `/infos-et-reservation` | `/` | 301 |
| `/copie-de-le-tonneau` | `/` | 301 |

## Maintenance

To add a new legacy URL, append one line `/<path> / 301` to `public/_redirects`. No other file needs to change.

## Acceptance criteria

- [ ] `public/_redirects` exists and contains one 301 rule per URL in the table above
- [ ] `bun build` outputs `dist/_redirects` unchanged
- [ ] No `.astro`, `.ts` or `astro.config.mjs` changes
- [ ] After deploy, `curl -I https://<domain>/la-salle` returns `301` with `location: /` (same for each listed URL)
- [ ] Existing assets (`/_astro/*`, `/favicon.svg`) are still served with `200`
