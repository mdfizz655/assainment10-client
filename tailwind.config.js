/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Dark Navy
        accent: "#FACC15",  // Lightning Yellow
      },
    },
  },
  plugins: [],
};