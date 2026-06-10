// @ts-check
import paraglide from "@inlang/paraglide-astro";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  site: "https://lagrangedemariefrance.fr",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "de", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    paraglide({
      project: "./project.inlang",
      outdir: "./src/paraglide",
    }),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: {
          fr: "fr",
          en: "en",
          de: "de",
          es: "es",
        },
      },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
