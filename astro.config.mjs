import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://adrian-beria-blog.netlify.app/",
  markdown: {
    remarkPlugins: [remarkToc],
    shikiConfig: { theme: "css-variables" },
  },
  integrations: [mdx({ syntaxHighlight: "shiki" }), sitemap(), tailwind()],
});
