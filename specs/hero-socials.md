# Social Links & Hero CTA

## Intent

Surface the owner's social/contact links as icon buttons in the **contact section** (not the hero), where visitors naturally look for ways to reach out. The hero instead gets a single subtle call-to-action button that draws the eye downward toward the contact section.

## Social links — contact section

### Content structure (unchanged)

`src/content/site/socials.md` holds the list of links. The schema and file format are unchanged from the original implementation.

### Placement

- Rendered inside `SectionContact.astro`, below the address block
- A row of icon-only circular ghost buttons, horizontally centered
- Same icon mapping and href construction as before (see below)

### Icon mapping

| type | icon |
|---|---|
| `facebook` | `Facebook` |
| `email` | `Mail` |
| `phone` | `Phone` |
| `whatsapp` | `MessageCircle` |

### href construction

| type | href |
|---|---|
| `facebook` | `value` as-is |
| `email` | `mailto:${value}` |
| `phone` | `tel:${value}` |
| `whatsapp` | `https://wa.me/${value}` |

## Hero CTA button

### Intent

A single, understated button anchored below the tagline in the hero section. It hints at reaching out / joining the journey without being transactional ("Book now"). Clicking it scrolls to `#contact`.

### Content structure

Each hero locale file gains a `cta` field:

```yaml
# fr.md
---
title: La Grange de Marie France
tagline: Au Pousse Pèlerins — un lieu de repos et de joie sur le Chemin de Saint-Jacques
cta: Nous rejoindre
---
```

Translations:
- `fr`: Nous rejoindre
- `en`: Join us
- `es`: Únete a nosotros
- `de`: Begleite uns

### Rendering

- `<a href="#contact">` styled as a ghost outline button with white border and text to sit naturally on the hero image
- Positioned below the tagline with some top margin
- Subtle — no fill, no heavy shadow

## Acceptance criteria

- [x] `src/content/site/socials.md` exists with all four links
- [x] `site` collection is defined in `content.config.ts` with the schema
- [ ] Social icons removed from `SectionHero.astro`
- [ ] Social icons rendered in `SectionContact.astro` below the address block
- [ ] `cta` field added to the hero schema and all four locale files
- [ ] Hero renders a ghost outline CTA button linking to `#contact`
- [ ] `bun astro check` passes with no errors
