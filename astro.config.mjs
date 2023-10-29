import fs from "node:fs";

import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";

const prettyCodeOptions = {
  theme: JSON.parse(fs.readFileSync("./themes/darkly-color-theme.json")),
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    drafts: true,
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: [],
        },
      ],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  site: "https://www.youssefm.com",
  trailingSlash: "never",
});
