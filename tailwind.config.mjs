import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["geist", ...defaultTheme.fontFamily.sans],
        mono: ["Source Code Pro Variable", ...defaultTheme.fontFamily.mono],
        geist: ["geist"],
      },
      backgroundImage: {
        // from gray-nurse-50 to white
        primary: "linear-gradient(360deg, #f6f7f6, #ffffff)",
      },
      colors: {
        "gray-nurse": {
          50: "#f6f7f6",
          100: "#d8dfd9",
          200: "#c2cdc4",
          300: "#9caca0",
          400: "#778a7c",
          500: "#5d6f61",
          600: "#49584d",
          700: "#3d4841",
          800: "#333c35",
          900: "#2d342e",
          950: "#171c19",
        },
        light: {
          // gray-nurse-800
          primary: "#043943",
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
