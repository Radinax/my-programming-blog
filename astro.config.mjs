import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import expressiveCode from "astro-expressive-code";
import tailwind from "@astrojs/tailwind";

// Import rehype plugins
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  site: "https://adrian-beria-blog.netlify.app/",
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeMermaid],
    shikiConfig: { theme: "css-variables" },
  },
  integrations: [
    expressiveCode(),
    mdx({ syntaxHighlight: "shiki" }),
    sitemap(),
    tailwind(),
  ],
});
