import { defineCollection, z } from "astro:content";

const CATEGORIES = ["typescript", "linux"] as const;

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    published: z.boolean().default(false),
  }),
});

export const collections = { blog };
