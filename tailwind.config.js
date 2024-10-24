/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        yeseva: ["Yeseva", "serif"],
        garet: ["Garet", "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
