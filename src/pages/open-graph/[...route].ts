import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const entries = await getCollection("meta");

const pages = Object.fromEntries(
  entries.map((entry) => [entry.id, entry.data]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: "La Grange de Marie France",
    description: page.description,
    logo: { path: "./src/assets/lagrange-logo.png", size: [120] },
    bgGradient: [[255, 255, 255]],
    border: { color: [168, 142, 106], width: 6, side: "inline-start" },
    font: {
      title: {
        color: [41, 37, 36],
        size: 64,
        families: ["Noto Serif"],
        weight: "Normal",
      },
      description: {
        color: [87, 83, 78],
        size: 34,
        families: ["Noto Sans"],
        weight: "Normal",
      },
    },
    fonts: [
      "https://api.fontsource.org/v1/fonts/noto-serif/latin-400-normal.ttf",
      "https://api.fontsource.org/v1/fonts/noto-sans/latin-400-normal.ttf",
    ],
  }),
});
