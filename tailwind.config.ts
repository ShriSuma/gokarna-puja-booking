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
        marquee: "marquee 28s linear infinite",
        "bounce-gentle": "bounce-gentle 2.2s ease-in-out infinite",
        "pop-pulse": "pop-pulse 2.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow-maroon": "pulse-glow-maroon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dance-3d": "dance-3d 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        "dance-3d-wa": "dance-3d-wa 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pop-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.55), 0 10px 25px -5px rgba(0, 0, 0, 0.2)" },
          "50%": { boxShadow: "0 0 0 14px rgba(37, 211, 102, 0), 0 15px 30px -5px rgba(37, 211, 102, 0.3)" },
        },
        "pulse-glow-maroon": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(92, 26, 27, 0.55), 0 10px 25px -5px rgba(0, 0, 0, 0.2)" },
          "50%": { boxShadow: "0 0 0 14px rgba(92, 26, 27, 0), 0 15px 30px -5px rgba(92, 26, 27, 0.3)" },
        },
        "dance-3d": {
          "0%, 100%": {
            transform: "perspective(800px) translateY(0px) rotateX(0deg) rotateZ(0deg) scale(1)",
            boxShadow: "0 8px 16px -2px rgba(92, 26, 27, 0.25)",
          },
          "25%": {
            transform: "perspective(800px) translateY(-10px) rotateX(8deg) rotateZ(-2deg) scale(1.05)",
            boxShadow: "0 22px 30px -4px rgba(92, 26, 27, 0.4)",
          },
          "50%": {
            transform: "perspective(800px) translateY(-16px) rotateX(12deg) rotateZ(2deg) scale(1.09)",
            boxShadow: "0 28px 38px -4px rgba(92, 26, 27, 0.5), 0 0 20px rgba(184, 134, 11, 0.4)",
          },
          "75%": {
            transform: "perspective(800px) translateY(-8px) rotateX(6deg) rotateZ(-1deg) scale(1.04)",
            boxShadow: "0 18px 25px -3px rgba(92, 26, 27, 0.35)",
          },
        },
        "dance-3d-wa": {
          "0%, 100%": {
            transform: "perspective(800px) translateY(0px) rotateX(0deg) rotateZ(0deg) scale(1)",
            boxShadow: "0 8px 16px -2px rgba(37, 211, 102, 0.3)",
          },
          "25%": {
            transform: "perspective(800px) translateY(-10px) rotateX(8deg) rotateZ(2deg) scale(1.05)",
            boxShadow: "0 22px 30px -4px rgba(37, 211, 102, 0.45)",
          },
          "50%": {
            transform: "perspective(800px) translateY(-16px) rotateX(12deg) rotateZ(-2deg) scale(1.09)",
            boxShadow: "0 28px 38px -4px rgba(37, 211, 102, 0.55), 0 0 22px rgba(37, 211, 102, 0.4)",
          },
          "75%": {
            transform: "perspective(800px) translateY(-8px) rotateX(6deg) rotateZ(1deg) scale(1.04)",
            boxShadow: "0 18px 25px -3px rgba(37, 211, 102, 0.4)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
