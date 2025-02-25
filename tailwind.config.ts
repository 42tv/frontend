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
        toolbarBg: "#1b1b1b", // Example color
        contentBg: "#2b2b2b", // Example color
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
