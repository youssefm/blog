import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export function remarkReadingTime(): RemarkPlugin {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesToRead = readingTime.minutes;
  };
}
