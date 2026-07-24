import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — §1.3
        brand: {
          green: "#1B6B3A",
          "green-dark": "#13502B",
          "green-light": "#2E8B57",
          gold: "#C8A84B",
          "gold-dark": "#A8893A",
        },
        cream: "#FAF9F6",
        ink: "#1A1A1A",
        danger: "#D32F2F",
      },
      fontFamily: {
        // Wired to next/font CSS variables in app/layout.tsx
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px", // §1.1 desktop max width
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 28px rgba(0,0,0,0.14)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Hero slideshow Ken Burns — gentle zoom paired with a slow horizontal
        // drift. Two variants alternate per slide so motion changes direction.
        "ken-burns-ltr": {
          "0%": { transform: "scale(1.06) translate3d(-2%, -1%, 0)" },
          "100%": { transform: "scale(1.16) translate3d(2%, 1%, 0)" },
        },
        "ken-burns-rtl": {
          "0%": { transform: "scale(1.16) translate3d(2%, 1%, 0)" },
          "100%": { transform: "scale(1.06) translate3d(-2%, -1%, 0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "ken-burns-ltr": "ken-burns-ltr 14s ease-in-out infinite alternate",
        "ken-burns-rtl": "ken-burns-rtl 14s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
