import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  markdown: { shikiConfig: { theme: "css-variables" } },
  integrations: [mdx({ syntaxHighlight: "shiki" }), sitemap(), tailwind()],
});
