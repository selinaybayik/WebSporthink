/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        darkBg: "#020617",
        darkCard: "#0f172a",
        darkBorder: "#1e293b",
      },
    },
  },

  plugins: [],
};