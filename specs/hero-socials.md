# Hero — Social Links Bar

## Intent

Add a row of icon-only social link buttons anchored to the bottom of the hero section. Links are configurable via a content file so the owner can update them without touching component code.

## Content structure

A new locale-independent file `src/content/site/socials.md` holds the list of social links. Because this data is shared across all locales, it lives in a dedicated `site` collection rather than inside the `hero` locale files.

```yaml
---
links:
  - type: facebook
    value: "https://www.facebook.com/lagrangedemariefrance"
  - type: email
    value: "lagrangedemariefrance@gmail.com"
  - type: phone
    value: "+33661244804"
  - type: whatsapp
    value: "+33661244804"
---
```

`value` semantics per type:
- `facebook` — full URL
- `email` — address only; component prepends `mailto:`
- `phone` — digits only, no spaces; component prepends `tel:`
- `whatsapp` — international number without `+`; component builds `https://wa.me/<value>`

## Collection schema (`content.config.ts`)

```ts
const site = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/site" }),
  schema: z.object({
    links: z.array(
      z.object({
        type: z.enum(["facebook", "email", "phone", "whatsapp"]),
        value: z.string(),
      })
    ),
  }),
});
```

## Component changes (`SectionHero.astro`)

- Fetch `getEntry("site", "socials")` in the frontmatter.
- Add an `absolute bottom-6 left-0 right-0` container inside `#hero`, centered horizontally.
- Render each link as an `<a>` with DaisyUI classes `btn btn-circle btn-ghost` and `text-white`.
- Display **icon only** — no visible label. Each anchor gets an `aria-label` for accessibility.

### Icon mapping

Use `@lucide/astro` named imports:

| type | Lucide component |
|---|---|
| `facebook` | `Facebook` |
| `email` | `Mail` |
| `phone` | `Phone` |
| `whatsapp` | `MessageCircle` (Lucide has no WhatsApp brand icon) |

### href construction

| type | href |
|---|---|
| `facebook` | `value` as-is |
| `email` | `mailto:${value}` |
| `phone` | `tel:${value}` |
| `whatsapp` | `https://wa.me/${value}` |

## Acceptance criteria

- [ ] `src/content/site/socials.md` exists with all four links
- [ ] `site` collection is defined in `content.config.ts` with the schema above
- [ ] Social bar is absolutely positioned at the bottom of the hero, horizontally centered
- [ ] Each link renders as a circular ghost button containing only an icon
- [ ] Each anchor has a descriptive `aria-label`
- [ ] Adding or removing an entry in `socials.md` is reflected without touching any `.astro` file
- [ ] `bun astro check` passes with no errors
