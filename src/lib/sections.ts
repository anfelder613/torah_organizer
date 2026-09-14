// Shared section metadata for the four top-level collections.
// Kept in a plain .ts module (rather than declared inside .astro frontmatter) so
// getStaticPaths and the page body can both reference it without relying on
// Astro's frontmatter scoping.

// "google-docs" is a placeholder section — curator-authored Google Docs, still being
// shaped (structure/content TBD). It's built as its own isolated, uncategorized
// collection specifically so it stays trivial to remove later if it doesn't end up
// belonging in the public version of the site: delete src/content/google-docs/, drop
// its entry here, in src/content.config.ts, the nav link in Layout.astro, and the
// homepage card in src/pages/index.astro — no other collection references it.
export type Section = "halacha" | "machshava" | "parsha" | "rabbanim" | "google-docs";

export const SECTION_IDS: Section[] = ["halacha", "machshava", "parsha", "rabbanim", "google-docs"];

export const SECTION_META: Record<Section, { title: string; description: string }> = {
  halacha: { title: "Halacha", description: "Jewish law, organized by topic." },
  machshava: { title: "Machshava", description: "Jewish thought, organized by theme." },
  parsha: { title: "Parsha", description: "Resources organized by the weekly Torah portion." },
  rabbanim: { title: "Rabbanim", description: "Divrei Torah and shiurim, organized by rabbi." },
  "google-docs": { title: "Google Docs", description: "Curated Google Docs — structure and content still being finalized." },
};

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  article: "Article",
  shiur: "Shiur",
  "sefer-purchase": "Buy Sefer",
  "whatsapp-group": "WhatsApp Group",
  other: "Other",
};
