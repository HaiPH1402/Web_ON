import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1769b8",
          600: "#125b9e",
          700: "#0f4c85",
          DEFAULT: "#1769b8",
          dark: "#0f4c85",
          light: "#2f8fd6",
        },
        accent: {
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        hover: "0 10px 30px -8px rgba(23,105,184,0.25)",
      },
      borderRadius: {
        xl: "0.9rem",
      },
    },
  },
  plugins: [],
};

export default config;
