/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        yeseva: ["Yeseva", "serif"],
        garet: ["Garet", "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
    },
    screens: {
      "sm-m": "320px", // Small mobile devices
      "md-m": "375px", // Medium mobile devices
      "lg-m": "414px", // Large mobile devices
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
