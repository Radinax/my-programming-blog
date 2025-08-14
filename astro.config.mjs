import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import tailwind from "@astrojs/tailwind";
import remarkMermaid from "remark-mermaidjs";

export default defineConfig({
  site: "https://adrian-beria-blog.netlify.app/",
  markdown: {
    remarkPlugins: [remarkToc, remarkMermaid],
    rehypePlugins: [],
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "css-variables", wrap: true },
  },
  integrations: [mdx({ syntaxHighlight: "shiki" }), sitemap(), tailwind()],
});
