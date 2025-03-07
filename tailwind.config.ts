import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // primaryBg: "",
        textSearch: {
          DEFAULT: "rgba(189, 187, 187, 1)",
          dark: "rgba(117, 113, 113, 1)",
        },
        iconBg: {
          DEFAULT: "rgba(235, 229, 229, 1)", // from iconLightBg
          dark: "rgba(55, 65, 81, 1)", // from iconDarkBg
        },
        toolbarBg: "rgba(27, 27, 27, 1)",
        contentBg: "rgba(43, 43, 43, 1)",
        darkBg: "rgba(18, 18, 18, 1)",
        colorFg01: "rgba(153, 153, 153, 1)",
        textBase: {
          DEFAULT: "rgba(75, 75, 75, 1)",
          dark: "rgba(153, 153, 153, 1)",
          bold: "rgba(50, 50, 50, 1)",
          "dark-bold": "rgba(128, 128, 128, 1)",
        },
        borderButton1: {
          DEFAULT: "rgba(208, 211, 218, 1)", // from borderLightButton1
          dark: "rgba(68, 68, 68, 1)", // from borderDarkButton1
        },
        tableBorder: {
          DEFAULT: "rgb(173, 177, 180)", // from borderLightButton1
          dark: "rgb(94, 92, 92)", // from borderDarkButton1
        },
        tableRowBorder: {
          DEFAULT: "rgb(212, 214, 218)", // from borderLightButton1
          dark: "rgb(61, 61, 61)", // from borderDarkButton1
        },
        color: {
          darkBlue: "rgb(52, 107, 165)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
