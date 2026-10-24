import { getEntry } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const siteOrigin = site?.toString().replace(/\/$/, "") ?? "";
  const siteBase = `${siteOrigin}${base}`;

  const [meta, hero, accommodations, dining, contact, eauze, camino] =
    await Promise.all([
      getEntry("meta", "fr"),
      getEntry("hero", "fr"),
      getEntry("accommodations", "fr"),
      getEntry("dining", "fr"),
      getEntry("contact", "fr"),
      getEntry("eauze", "fr"),
      getEntry("camino", "fr"),
    ]);

  if (
    !meta ||
    !hero ||
    !accommodations ||
    !dining ||
    !contact ||
    !eauze ||
    !camino
  ) {
    throw new Error("Missing content for llms.txt generation");
  }

  const lines = [
    `# ${meta.data.title}`,
    "",
    `> ${meta.data.description}`,
    "",
    hero.data.tagline,
    "",
    "## Pages",
    "",
    `- [Accueil](${siteBase}/): présentation du gîte, hébergements, restauration, galerie et réservation.`,
    `- [Hébergements](${siteBase}/#accommodations): ${accommodations.data.description ?? ""}`,
    `- [Restauration](${siteBase}/#dining): ${dining.data.meals.map((m) => m.name).join(", ")}.`,
    `- [Réservation](${siteBase}/#reservation): ${contact.data.address} — ${contact.data.email}${contact.data.phone ? ` — ${contact.data.phone}` : ""}`,
    `- [Éauze](${siteBase}/eauze/): ${eauze.data.description}`,
    `- [Chemin de Compostelle](${siteBase}/chemin-de-compostelle/): ${camino.data.description}`,
    `- [Mentions légales](${siteBase}/legal/)`,
    "",
    "## Données structurées",
    "",
    `- [Catalogue des hébergements (JSON)](${siteBase}/ai-catalog.json)`,
    "",
    "## Autres langues",
    "",
    `- English: ${siteBase}/en/ (also /en/eauze/, /en/camino-de-santiago/)`,
    `- Deutsch: ${siteBase}/de/ (also /de/eauze/, /de/jakobsweg/)`,
    `- Español: ${siteBase}/es/ (also /es/eauze/, /es/camino-de-santiago/)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
