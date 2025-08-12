import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import expressiveCode from "astro-expressive-code";
import remarkMermaid from "remark-mermaidjs";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://adrian-beria-blog.netlify.app/",
  markdown: {
    remarkPlugins: [remarkToc, remarkMermaid],
    shikiConfig: { theme: "css-variables" },
  },
  integrations: [
    expressiveCode(),
    mdx({ syntaxHighlight: "shiki" }),
    sitemap(),
    tailwind(),
  ],
});
