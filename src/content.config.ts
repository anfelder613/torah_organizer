import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared schema for every topic file across all three sections.
// See CLAUDE.md "Content structure & schema" for the authoritative reference.
const resourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  type: z.enum(["article", "shiur", "sefer-purchase", "whatsapp-group", "other"]),
  author: z.string().optional(),
  language: z.enum(["english", "hebrew", "yiddish", "mixed"]).optional(),
  format: z.enum(["audio", "video", "text"]).optional(),
  description: z.string().optional(),
});

const topicSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // Explicit display order within a section. Used for Parsha (annual-cycle order);
  // omitted for Halacha/Machshava, which sort alphabetically by title instead.
  order: z.number().optional(),
  resources: z.array(resourceSchema).default([]),
});

const halacha = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/halacha" }),
  schema: topicSchema,
});

const machshava = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/machshava" }),
  schema: topicSchema,
});

const parsha = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/parsha" }),
  schema: topicSchema,
});

// Gemara: one file per perek (chapter) of a masechta. Each perek lists its dapim
// (amudim), each carrying a Sefaria text link. The shiur link lives at the perek
// level, not per-daf: per-daf shiur URL patterns (e.g. YUTorah's daf.cfm) have
// twice turned out to be dead/retired despite looking real in search results, and
// a per-daf catalog like AllDaf uses arbitrary numeric IDs with no derivable
// pattern. One verified shiur per perek is small enough to actually confirm real.
const dafSchema = z.object({
  daf: z.string(), // e.g. "2a"
  sefariaUrl: z.string().url(),
});

const shiurSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  author: z.string().optional(),
});

const perekSchema = z.object({
  masechta: z.string(), // e.g. "Berachot"
  title: z.string(), // e.g. "Perek 1: Me'eimatai"
  order: z.number(), // chapter number within the masechta
  shiur: shiurSchema.optional(),
  dapim: z.array(dafSchema),
});

const gemara = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/gemara" }),
  schema: perekSchema,
});

export const collections = { halacha, machshava, parsha, gemara };
