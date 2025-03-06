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
        textLightSearch: "#BECADC",
        textDarkSearch: "rgba(199, 199, 199, 1)",
        iconLightBg: "rgba(229, 231, 235, 1)",
        iconDarkBg: "rgba(55, 65, 81, 1)",
        toolbarBg: "rgba(27, 27, 27, 1.0)",
        contentBg: "rgba(43, 43, 43, 1)",
        darkBg: "rgba(18, 18, 18, 1)",
        colorFg01: "rgba(153, 153, 153, 1)",
        borderLightButton1: "#d0d3da",
        borderDarkButton1: "#444",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
