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
      animation: {
        bounce: "custom-bounce 0.8s ease-in-out infinite",
      },
      keyframes: {
        "custom-bounce": {
          "0%, 100%": { transform: "translateY(-3%)" }, 
          "50%": { transform: "translateY(0)" },
        },
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
