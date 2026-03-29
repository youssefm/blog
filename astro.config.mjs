import fs from "node:fs";

import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";

import { remarkReadingTime } from "./src/plugins/reading-time";

const prettyCodeOptions = {
  theme: JSON.parse(fs.readFileSync("./themes/darkly-color-theme.json")),
};

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), tailwind()],
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
      rehypeKatex,
    ],
    remarkPlugins: [remarkMath, remarkReadingTime],
  },
  site: "https://www.youssefm.com",
  trailingSlash: "never",
});
