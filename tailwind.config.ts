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
        iconLightBg: "#e5e7eb", // gray-200 in default Tailwind is #e5e7eb
        iconDarkBg: "#374151", // gray-700 in default Tailwind is #374151
        toolbarBg: "#1b1b1b", // Example color
        contentBg: "#2b2b2b", // Example color
        colorFg01: "#999",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
