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

export const collections = { halacha, machshava, parsha };
