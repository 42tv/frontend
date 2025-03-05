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
        textDarkSearch: "rgba(199, 199, 199, 0.4)",
        iconLightBg: "rgba(229, 231, 235, 0.7)",
        iconDarkBg: "rgba(55, 65, 81, 0.7)",
        toolbarBg: "rgba(27, 27, 27, 1.0)",
        contentBg: "rgba(43, 43, 43, 0.7)",
        darkBg: "rgba(18, 18, 18, 0.7)",
        colorFg01: "rgba(153, 153, 153, 0.7)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
