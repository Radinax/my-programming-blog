import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        mono: ["Source Code Pro Variable", ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        // from gray-nurse-50 to white
        primary: "linear-gradient(360deg, #f6f7f6, #ffffff)",
      },
      colors: {
        black: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#1c1c1c",
        },
        light: {
          // gray-nurse-800
          primary: "#1c1c1c",
          secondary: "#007ebd",
          accent: "#f8860d",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
          text: "#1f2937",
          background: "#ffffff",
          // gray-nurse-800
          "select-text": "#333c35",
          "select-bg": "#9caca0",
        },
        dark: {
          primary: "#6e0b75",
          secondary: "#007ebd",
          accent: "#f8860d",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
          // gray-nurse-50
          text: "#f6f7f6",
          background: "#ffffff",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
