import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { unified, rehypeShiki } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkMermaid from "remark-mermaidjs";

// https://astro.build/config
export default defineConfig({
  site: "https://adrian-beria-blog.netlify.app/",
  // Astro 7 renders Markdown with its native pipeline by default; opt back into the
  // remark/rehype (unified) pipeline so our remark plugins (TOC + mermaid) keep
  // running. With a custom processor, syntax highlighting is no longer applied
  // automatically, so we add Astro's `rehypeShiki` plugin explicitly (the same shiki
  // css-variables theme the `--astro-code-*` vars in style.css are built for).
  markdown: {
    processor: unified({
      remarkPlugins: [remarkToc, remarkMermaid],
      rehypePlugins: [[rehypeShiki, { theme: "css-variables", wrap: true }]],
    }),
  },
  integrations: [mdx(), sitemap(), icon()],
  // Tailwind v4 plugs in through Vite now (the old @astrojs/tailwind integration is gone).
  vite: {
    plugins: [tailwindcss()],
  },
});
