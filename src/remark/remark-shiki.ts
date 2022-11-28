import type * as shiki from "shiki";
import { getHighlighter } from "shiki";
import { visit } from "unist-util-visit";

const LANG_REGEX = /^([a-z]+){(\d+(?:,\d+)*)}$/;

/**
 * getHighlighter() is the most expensive step of Shiki. Instead of calling it on every page,
 * cache it here as much as possible. Make sure that your highlighters can be cached, state-free.
 * We make this async, so that multiple calls to parse markdown still share the same highlighter.
 */
const highlighterCacheAsync = new Map<string, Promise<shiki.Highlighter>>();

const remarkShiki = async (
  { langs = [], theme = "github-dark", wrap = false },
  scopedClassName?: string | null
) => {
  let highlighterAsync = highlighterCacheAsync.get(theme);
  if (!highlighterAsync) {
    highlighterAsync = getHighlighter({ theme }).then((hl) => {
      hl.setColorReplacements({
        "#000001": "var(--astro-code-color-text)",
        "#000002": "var(--astro-code-color-background)",
        "#000004": "var(--astro-code-token-constant)",
        "#000005": "var(--astro-code-token-string)",
        "#000006": "var(--astro-code-token-comment)",
        "#000007": "var(--astro-code-token-keyword)",
        "#000008": "var(--astro-code-token-parameter)",
        "#000009": "var(--astro-code-token-function)",
        "#000010": "var(--astro-code-token-string-expression)",
        "#000011": "var(--astro-code-token-punctuation)",
        "#000012": "var(--astro-code-token-link)",
      });
      return hl;
    });
    highlighterCacheAsync.set(theme, highlighterAsync);
  }
  const highlighter = await highlighterAsync;

  // NOTE: There may be a performance issue here for large sites that use `lang`.
  // Since this will be called on every page load. Unclear how to fix this.
  for (const lang of langs) {
    await highlighter.loadLanguage(lang);
  }

  return () => (tree: any) => {
    visit(tree, "code", (node) => {
      let lang: string;
      let highlightedLines: number[] = [];

      if (typeof node.lang === "string") {
        let nodeLang = node.lang;
        const match = LANG_REGEX.exec(node.lang);
        if (match) {
          nodeLang = match[1];
          highlightedLines = match[2]
            .split(",")
            .map((lineString) => parseInt(lineString));
        }

        const langExists = highlighter.getLoadedLanguages().includes(nodeLang);
        if (langExists) {
          lang = nodeLang;
        } else {
          console.warn(
            `The language "${nodeLang}" doesn't exist, falling back to plaintext.`
          );
          lang = "plaintext";
        }
      } else {
        lang = "plaintext";
      }

      const lineOptions = highlightedLines.map((line) => ({
        line,
        classes: ["highlighted"],
      }));
      let html = highlighter!.codeToHtml(node.value, { lang, lineOptions });

      // Q: Couldn't these regexes match on a user's inputted code blocks?
      // A: Nope! All rendered HTML is properly escaped.
      // Ex. If a user typed `<span class="line"` into a code block,
      // It would become this before hitting our regexes:
      // &lt;span class=&quot;line&quot;

      // Replace "shiki" class naming with "astro" and add "is:raw".
      html = html.replace(
        '<pre class="shiki"',
        `<pre is:raw class="astro-code${
          scopedClassName ? " " + scopedClassName : ""
        }"`
      );
      // Add "user-select: none;" for "+"/"-" diff symbols
      if (node.lang === "diff") {
        html = html.replace(
          /<span class="line"><span style="(.*?)">([\+|\-])/g,
          '<span class="line"><span style="$1"><span style="user-select: none;">$2</span>'
        );
      }
      // Handle code wrapping
      // if wrap=null, do nothing.
      if (wrap === false) {
        html = html.replace(/style="(.*?)"/, 'style="$1; overflow-x: auto;"');
      } else if (wrap === true) {
        html = html.replace(
          /style="(.*?)"/,
          'style="$1; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"'
        );
      }

      // Apply scopedClassName to all nested lines
      if (scopedClassName) {
        html = html.replace(
          /\<span class="line"\>/g,
          `<span class="line ${scopedClassName}"`
        );
      }

      node.type = "html";
      node.value = html;
      node.children = [];
    });
  };
};

export default remarkShiki;
