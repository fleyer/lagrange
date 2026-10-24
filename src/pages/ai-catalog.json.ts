import { getEntry } from "astro:content";
import type { APIRoute } from "astro";

function stripHtml(value: string): string {
  return value
    .replace(/<\/?br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const siteOrigin = site?.toString().replace(/\/$/, "") ?? "";
  const siteBase = `${siteOrigin}${base}`;

  const [accommodations, contact] = await Promise.all([
    getEntry("accommodations", "fr"),
    getEntry("contact", "fr"),
  ]);

  if (!accommodations || !contact) {
    throw new Error("Missing content for ai-catalog.json generation");
  }

  const catalog = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hébergements — La Grange de Marie-France",
    description: accommodations.data.description,
    url: `${siteBase}/#accommodations`,
    numberOfItems: accommodations.data.units.length,
    itemListElement: accommodations.data.units.map((unit, i) => ({
      "@type": "Accommodation",
      position: i + 1,
      identifier: unit.id,
      name: unit.name,
      occupancy: unit.capacity,
      description: stripHtml(unit.description),
    })),
    offers: accommodations.data.pricing.map((p) => ({
      "@type": "Offer",
      name: p.label,
      price: p.price,
      priceCurrency: "EUR",
    })),
    provider: {
      "@type": "LodgingBusiness",
      name: "La Grange - Au Pousse Pèlerins",
      address: {
        "@type": "PostalAddress",
        streetAddress: "4 avenue de la Ténarèze",
        addressLocality: "Éauze",
        postalCode: "32800",
        addressCountry: "FR",
      },
      telephone: contact.data.phone,
      email: contact.data.email,
      url: siteBase,
    },
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
