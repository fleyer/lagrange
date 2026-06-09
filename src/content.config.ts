import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const hero = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/hero" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
  }),
});

const refuge = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/refuge" }),
  schema: z.object({
    title: z.string(),
  }),
});

const accommodations = defineCollection({
  loader: glob({ pattern: "??.md", base: "./src/content/accommodations" }),
  schema: z.object({
    title: z.string(),
    units: z.array(
      z.object({
        name: z.string(),
        capacity: z.string(),
        description: z.string(),
      }),
    ),
    pricing: z.array(
      z.object({
        label: z.string(),
        price: z.string(),
      }),
    ),
  }),
});

const accommodationsImages = defineCollection({
  loader: glob({ pattern: "index.md", base: "./src/content/accommodations" }),
  schema: ({ image }) =>
    z.object({
      units: z.array(
        z.object({
          id: z.string(),
          images: z.array(image()),
        }),
      ),
    }),
});

const dining = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/dining" }),
  schema: z.object({
    title: z.string(),
  }),
});

const contact = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/contact" }),
  schema: z.object({
    title: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    extras: z.array(z.string()).optional(),
  }),
});

export const collections = {
  hero,
  refuge,
  accommodations,
  accommodationsImages,
  dining,
  contact,
};
