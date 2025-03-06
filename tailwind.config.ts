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
          DEFAULT: "rgb(189, 187, 187)",
          dark: "rgb(117, 113, 113)",
        },
        iconBg: {
          DEFAULT: "rgb(235, 229, 229)", // from iconLightBg
          dark: "rgba(55, 65, 81, 1)", // from iconDarkBg
        },
        toolbarBg: "rgba(27, 27, 27, 1.0)",
        contentBg: "rgba(43, 43, 43, 1)",
        darkBg: "rgba(18, 18, 18, 1)",
        colorFg01: "rgba(153, 153, 153, 1)",
        textBase: {
          DEFAULT: "rgba(75, 75, 75, 1)",
          dark: "rgba(153, 153, 153, 1)",
        },
        borderButton: {
          DEFAULT: "#d0d3da", // from borderLightButton1
          dark: "#444", // from borderDarkButton1
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
