import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkShiki from "./src/remark/remark-shiki";

// https://astro.build/config
export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    sitemap(),
    tailwind(),
  ],
  markdown: {
    drafts: true,
    remarkPlugins: [await remarkShiki({})],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: [],
        },
      ],
    ],
    extendDefaultPlugins: true,
    syntaxHighlight: false,
  },
  site: "https://www.youssefm.com",
  trailingSlash: "never",
});
