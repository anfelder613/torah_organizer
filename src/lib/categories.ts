// Category groupings for Halacha, Machshava, and Parsha. Topics in these sections
// live in subfolders under src/content/<section>/<category-slug>/<topic-slug>.yaml —
// the category slug (the first path segment of a content collection entry's `id`)
// is looked up here for display order, title, and emoji. For Parsha the "category"
// is one of the five Chumashim, and topics within it still sort by the annual-cycle
// `order` field rather than alphabetically (see sortWithinCategory below). Gemara
// has its own page structure (masechta/perek/daf), so it doesn't use this module.

export type CategorizedSection = "halacha" | "machshava" | "parsha";

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
  parsha: [
    { slug: "bereishit", title: "Bereishit", emoji: "🌍" },
    { slug: "shemot", title: "Shemot", emoji: "🔥" },
    { slug: "vayikra", title: "Vayikra", emoji: "🕯️" },
    { slug: "bamidbar", title: "Bamidbar", emoji: "🏜️" },
    { slug: "devarim", title: "Devarim", emoji: "📜" },
  ],
};

// Halacha/Machshava topics sort alphabetically within a category; Parsha sorts by
// its annual-cycle `order` field instead, since that's the order they're read in.
export const CATEGORY_SORT: Record<CategorizedSection, "alphabetical" | "order"> = {
  halacha: "alphabetical",
  machshava: "alphabetical",
  parsha: "order",
};

/** The category slug is the first path segment of a nested content collection entry id. */
export function categorySlugOf(entryId: string): string {
  return entryId.split("/")[0];
}
