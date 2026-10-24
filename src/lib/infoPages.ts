export const infoPageSlugs = {
  eauze: { fr: "eauze", en: "eauze", de: "eauze", es: "eauze" },
  camino: {
    fr: "chemin-de-compostelle",
    en: "camino-de-santiago",
    de: "jakobsweg",
    es: "camino-de-santiago",
  },
} as const;

export type InfoPageCollection = keyof typeof infoPageSlugs;
