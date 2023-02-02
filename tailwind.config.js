/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "350px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        clrGold: "#fcd054",
        clrDark: "#070707",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
