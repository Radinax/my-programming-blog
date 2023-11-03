import { defineCollection, z } from "astro:content";

const CATEGORIES = [
  "typescript",
  "react",
  "frontend",
  "backend",
  "sql",
  "nosql",
  "svelte",
  "astro",
  "solidjs",
  "web3",
  "concept",
] as const;

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.array(z.enum(CATEGORIES)),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    published: z.boolean().default(false),
  }),
});

export const collections = { blog };
