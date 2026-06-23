import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";
import GithubSlugger from "github-slugger";

export const CATEGORIES = [
  "aws",
  "talk",
  "system-design",
  "ai",
  "leetcode",
  "data",
  "python",
  "ML",
  "R",
  "roadmap",
  "oop",
  "typescript",
  "javascript",
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
  "utilities",
  "management",
] as const;

/**
 * Reproduce the slug Astro <= 4 generated for a content entry (github-slugger on
 * the filename, minus extension). The Content Layer's glob loader keys entries by
 * `id`, which defaults to the raw file path — so without this every `/blog/<slug>`
 * URL would change. A fresh slugger per call keeps it stateless (no dedupe drift).
 */
const toSlug = (entry: string): string => new GithubSlugger().slug(entry.replace(/\.mdx?$/, ""));

const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => toSlug(entry),
  }),
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
