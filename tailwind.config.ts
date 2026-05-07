import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandstone: {
          50: "#faf6f0",
          100: "#f3ebe0",
          200: "#e5d5c2",
          300: "#d4b896",
          400: "#c1946a",
          500: "#b0784a",
          600: "#9c623f",
          700: "#814d36",
          800: "#6a412f",
          900: "#58372a",
        },
        maroon: {
          DEFAULT: "#5c1a1b",
          light: "#7a2426",
          deep: "#3d1011",
        },
        saffron: {
          muted: "#c9a24d",
          light: "#e8d4a8",
        },
        brass: {
          DEFAULT: "#b8860b",
          light: "#d4af37",
        },
        parchment: "#f7f3eb",
        ink: "#2c1810",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "temple-dots":
          "radial-gradient(circle at 1px 1px, rgba(92,26,27,0.07) 1px, transparent 0)",
        "temple-lotus":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-4 8-12 12-12 22s8 14 12 22c4-8 12-12 12-22S34 13 30 5z' fill='none' stroke='%235c1a1b' stroke-opacity='0.06'/%3E%3C/svg%3E\")",
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
