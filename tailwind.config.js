/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#14471E",
        secondary: "#68904D",
        neutral: "#C8D2D1",
        warm: "#DA6A00",
        orange: "#EE9B01",
      },
      keyframes: {
        fadeIn: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        },

        popIn: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 350ms forwards",
        fadeOut: "fadeIn 350ms forwards reverse",
        popIn: "popIn 350ms forwards",
        popOut: "popIn 350ms forwards reverse",
      },
    },
  },
  plugins: [],
};
