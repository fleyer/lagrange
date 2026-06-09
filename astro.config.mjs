// @ts-check
import paraglide from "@inlang/paraglide-astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
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
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
