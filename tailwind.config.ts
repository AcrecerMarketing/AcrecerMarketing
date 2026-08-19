import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        ink: {
          950: "#0b0713",
          900: "#120c1f",
          800: "#1b1330",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #e11d48 50%, #f59e0b 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(225,29,72,0.15) 50%, rgba(245,158,11,0.15) 100%)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
