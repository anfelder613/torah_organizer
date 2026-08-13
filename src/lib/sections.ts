// Shared section metadata for the three top-level collections.
// Kept in a plain .ts module (rather than declared inside .astro frontmatter) so
// getStaticPaths and the page body can both reference it without relying on
// Astro's frontmatter scoping.

export type Section = "halacha" | "machshava" | "parsha";

export const SECTION_IDS: Section[] = ["halacha", "machshava", "parsha"];

export const SECTION_META: Record<Section, { title: string; description: string }> = {
  halacha: { title: "Halacha", description: "Jewish law, organized by topic." },
  machshava: { title: "Machshava", description: "Jewish thought, organized by theme." },
  parsha: { title: "Parsha", description: "Resources organized by the weekly Torah portion." },
};

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  article: "Article",
  shiur: "Shiur",
  "sefer-purchase": "Buy Sefer",
  "whatsapp-group": "WhatsApp Group",
  other: "Other",
};
