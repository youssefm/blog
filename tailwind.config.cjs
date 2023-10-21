/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        amber: { 650: "#c76508" },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      lineHeight: {
        14: "3.5rem",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "70ch",
            h2: {
              color: colors.amber["500"],
            },
            a: {
              "&:hover": {
                color: colors.amber["600"],
              },
            },
            li: {
              marginTop: 0,
              marginBottom: 0,
            },
            pre: {
              paddingLeft: 0,
              paddingRight: 0,
            },
            "pre > code": {
              display: "inline-block",
              minWidth: "100%",
            },
            ".line": {
              paddingLeft: "1.1428571em",
              paddingRight: "1.1428571em",
            },
            ".line.highlighted": {
              display: "inline-block",
              minWidth: "100%",
              backgroundColor: "#c8c8ff1a",
              borderLeft: "2px solid #2a69a9",
              paddingLeft: "1.0178571em",
            },
          },
        },
        lg: {
          css: {
            pre: {
              paddingLeft: 0,
              paddingRight: 0,
            },
            ".line": {
              paddingLeft: "2.6428571em",
              paddingRight: "2.6428571em",
            },
            ".line.highlighted": {
              paddingLeft: "2.5178571em",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
