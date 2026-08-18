// Category groupings for Halacha and Machshava. Topics in these two sections live
// in subfolders under src/content/<section>/<category-slug>/<topic-slug>.yaml — the
// category slug (the first path segment of a content collection entry's `id`) is
// looked up here for display order, title, and emoji. Parsha has no categories
// (it sorts by annual-cycle `order` instead) and Gemara has its own page structure,
// so neither uses this module.

export type CategorizedSection = "halacha" | "machshava";

export interface Category {
  slug: string;
  title: string;
  emoji: string;
}

export const CATEGORIES: Record<CategorizedSection, Category[]> = {
  machshava: [
    { slug: "god-creation-providence", title: "God, Creation & Providence", emoji: "🌌" },
    { slug: "human-nature-spiritual-life", title: "Human Nature & Spiritual Life", emoji: "🧠" },
    { slug: "torah-mitzvot-prayer", title: "Torah, Mitzvot & Prayer", emoji: "📖" },
    { slug: "good-evil-suffering-justice", title: "Good, Evil, Suffering & Justice", emoji: "⚖️" },
    { slug: "am-yisrael-exile-redemption", title: "Am Yisrael, Exile & Redemption", emoji: "🇮🇱" },
    { slug: "prophecy-afterlife-ultimate-reality", title: "Prophecy, Afterlife & Ultimate Reality", emoji: "🔮" },
  ],
  halacha: [
    { slug: "shabbat-moadim", title: "Shabbat & Moadim", emoji: "🕯️" },
    { slug: "tefillah-berachot", title: "Tefillah & Berachot", emoji: "🙏" },
    { slug: "personal-mitzvot", title: "Personal Mitzvot", emoji: "👕" },
    { slug: "kashrut", title: "Kashrut", emoji: "🍽️" },
    { slug: "family-lifecycle", title: "Family & Lifecycle", emoji: "👨‍👩‍👧" },
    { slug: "bein-adam-lachaveiro", title: "Bein Adam LaChaveiro", emoji: "⚖️" },
  ],
};

/** The category slug is the first path segment of a nested content collection entry id. */
export function categorySlugOf(entryId: string): string {
  return entryId.split("/")[0];
}
