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
        // Base colors from CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Primary brand colors
        primary: {
          DEFAULT: "rgb(75, 85, 99)", // gray-600
          hover: "rgb(31, 41, 55)", // gray-800 - darker for better contrast  
          light: "rgb(107, 114, 128)", // gray-500
          foreground: "rgb(255, 255, 255)", // White text on primary background
          50: "rgb(249, 250, 251)", // gray-50
          100: "rgb(243, 244, 246)", // gray-100
          500: "rgb(107, 114, 128)", // gray-500
          600: "rgb(75, 85, 99)", // gray-600
          700: "rgb(55, 65, 81)", // gray-700
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: "rgb(107, 114, 128)", // gray-500
          hover: "rgb(75, 85, 99)", // gray-600
          light: "rgb(156, 163, 175)", // gray-400
        },
        
        // Background colors
        bg: {
          primary: {
            DEFAULT: "var(--bg-primary)",
            dark: "var(--bg-primary)",
          },
          secondary: {
            DEFAULT: "var(--bg-secondary)",
            dark: "var(--bg-secondary)",
          },
          tertiary: {
            DEFAULT: "var(--bg-tertiary)",
            dark: "var(--bg-tertiary)",
          },
          modal: {
            DEFAULT: "rgb(255, 255, 255)",
            dark: "rgb(31, 41, 55)",
          },
          hover: {
            DEFAULT: "rgb(229, 231, 235)", // gray-200 - darker for light mode
            dark: "rgb(75, 85, 99)", // gray-600 - lighter for dark mode
          },
        },
        
        // Text colors
        text: {
          primary: {
            DEFAULT: "rgb(17, 24, 39)", // gray-900
            dark: "rgb(243, 244, 246)", // gray-100
          },
          secondary: {
            DEFAULT: "rgb(75, 85, 99)", // gray-600
            dark: "rgb(156, 163, 175)", // gray-400
          },
          tertiary: {
            DEFAULT: "rgb(107, 114, 128)", // gray-500
            dark: "rgb(107, 114, 128)", // gray-500
          },
          muted: {
            DEFAULT: "rgb(156, 163, 175)", // gray-400
            dark: "rgb(75, 85, 99)", // gray-600
          },
          accent: {
            DEFAULT: "rgb(75, 85, 99)", // gray-600
            dark: "rgb(107, 114, 128)", // gray-500
          },
        },
        
        // Border colors
        border: {
          primary: {
            DEFAULT: "rgb(229, 231, 235)", // gray-200
            dark: "rgb(75, 85, 99)", // gray-600
          },
          secondary: {
            DEFAULT: "rgb(209, 213, 219)", // gray-300
            dark: "rgb(55, 65, 81)", // gray-700
          },
          hover: {
            DEFAULT: "rgb(107, 114, 128)", // gray-500 - darker for better visibility
            dark: "rgb(156, 163, 175)", // gray-400 - lighter for dark mode
          },
        },
        
        // Icon colors
        icon: {
          primary: {
            DEFAULT: "rgb(75, 85, 99)", // gray-600
            dark: "rgb(156, 163, 175)", // gray-400
          },
          secondary: {
            DEFAULT: "rgb(107, 114, 128)", // gray-500
            dark: "rgb(107, 114, 128)", // gray-500
          },
          accent: {
            DEFAULT: "rgb(75, 85, 99)", // gray-600
            dark: "rgb(107, 114, 128)", // gray-500
          },
        },
        
        // Status colors
        success: {
          DEFAULT: "rgb(34, 197, 94)", // green-500
          dark: "rgb(74, 222, 128)", // green-400
          bg: "rgb(240, 253, 244)", // green-50
          "bg-dark": "rgb(20, 83, 45)", // green-900
        },
        warning: {
          DEFAULT: "rgb(245, 158, 11)", // amber-500
          dark: "rgb(251, 191, 36)", // amber-400
          bg: "rgb(255, 251, 235)", // amber-50
          "bg-dark": "rgb(120, 53, 15)", // amber-900
        },
        error: {
          DEFAULT: "rgb(239, 68, 68)", // red-500
          dark: "rgb(248, 113, 113)", // red-400
          bg: "rgb(254, 242, 242)", // red-50
          "bg-dark": "rgb(127, 29, 29)", // red-900
        },
        
        // Legacy color mappings (for backward compatibility)
        textSearch: {
          DEFAULT: "rgb(156, 163, 175)", // gray-400
          dark: "rgb(107, 114, 128)", // gray-500
        },
        iconBg: {
          DEFAULT: "rgb(243, 244, 246)", // gray-100
          dark: "rgb(55, 65, 81)", // gray-700
        },
        toolbarBg: {
          DEFAULT: "rgb(255, 255, 255)",
          dark: "rgb(17, 24, 39)",
        },
        contentBg: "rgb(31, 41, 55)", // gray-800
        darkBg: "rgb(17, 24, 39)", // gray-900
        colorFg01: "rgb(156, 163, 175)", // gray-400
        textBase: {
          DEFAULT: "rgb(75, 85, 99)", // gray-600
          dark: "rgb(156, 163, 175)", // gray-400
          bold: "rgb(55, 65, 81)", // gray-700
          "dark-bold": "rgb(209, 213, 219)", // gray-300
        },
        borderButton1: {
          DEFAULT: "rgb(229, 231, 235)", // gray-200
          dark: "rgb(75, 85, 99)", // gray-600
        },
        tableBorder: {
          DEFAULT: "rgb(209, 213, 219)", // gray-300
          dark: "rgb(75, 85, 99)", // gray-600
        },
        tableRowBorder: {
          DEFAULT: "rgb(229, 231, 235)", // gray-200
          dark: "rgb(55, 65, 81)", // gray-700
        },
        modalBg: {
          DEFAULT: "rgb(255, 255, 255)",
          dark: "rgb(31, 41, 55)",
        },
        color: {
          darkBlue: "rgb(75, 85, 99)", // Updated to gray-600 to match new theme
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
