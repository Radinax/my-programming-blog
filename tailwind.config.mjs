/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        // Inter is shipped via @fontsource-variable/inter (imported in BaseHead);
        // make it the default sans so it actually applies (was a non-existent "iransans").
        sans: ["Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Neutral grayscale ramp (used for the header nav links, borders, etc.).
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
        // Brand base: dark slate text + the navy header surface + muted-on-dark text.
        light: {
          primary: "#1f2937", // main text / dark UI elements
          background: "#1A202C", // navy header surface + heading color
          text: "#cbd5e0", // muted text on dark surfaces (the hero intro)
        },
        // Accent — indigo. The one intentional color: links, tag pills, active
        // pagination, focus rings, title hover.
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
    },
  },
};
