import type { Config } from "tailwindcss";

import { TECH_COLORS } from "./sanity/lib/techColors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Warna badge teknologi datang dari Sanity (dinamis), jadi di-safelist
  // agar Tailwind tetap men-generate class-nya.
  safelist: TECH_COLORS,
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgBody: "#E5E5E5",
      },
    },
    keyframes: {
      wave: {
        "0%, 60%, 100%": { transform: "rotate(0deg)" },
        "10%": { transform: "rotate(14deg)" },
        "20%": { transform: "rotate(-8deg)" },
        "30%": { transform: "rotate(14deg)" },
        "40%": { transform: "rotate(-4deg)" },
        "50%": { transform: "rotate(10deg)" },
      },
    },
    animation: {
      wave: "wave 2s infinite",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
