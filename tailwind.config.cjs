/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const em = (px, base) => `${round(px / base)}em`;

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
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
              marginTop: em(32, 20),
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
            "[data-line]": {
              paddingLeft: "1.1428571em",
              paddingRight: "1.1428571em",
            },
            "[data-highlighted-line]": {
              display: "inline-block",
              minWidth: "100%",
              backgroundColor: "#c8c8ff1a",
              borderLeft: "2px solid #2a69a9",
              paddingLeft: "1.0178571em",
            },
            "p > img": {
              marginLeft: "auto",
              marginRight: "auto",
            },
          },
        },
        lg: {
          css: {
            h2: {
              marginTop: em(44, 30),
            },
            pre: {
              paddingLeft: 0,
              paddingRight: 0,
            },
            "[data-line]": {
              paddingLeft: "2.6428571em",
              paddingRight: "2.6428571em",
            },
            "[data-highlighted-line]": {
              paddingLeft: "2.5178571em",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
