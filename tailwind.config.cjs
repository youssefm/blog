/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
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
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
