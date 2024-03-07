import { defineCollection, z } from "astro:content";

export const CATEGORIES = [
  "typescript",
  "react",
  "redux",
  "remix",
  "nextjs",
  "tanstack",
  "frontend",
  "bootstrap",
  "review",
  "backend",
  "sql",
  "postgresql",
  "sqlite",
  "test",
  "jest",
  "end-to-end",
  "graphql",
  "prisma",
  "node",
  "express",
  "mongodb",
  "nosql",
  "svelte",
  "astro",
  "solidjs",
  "web3",
  "concept",
  "cypress",
  "sequelize",
  "tailwind",
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
