/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "social-button-shadow":
          "0 0 2px 0 rgba(0, 0, 0, 0.12),0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 0 0 rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 0, 0, 0.24)",
      },
      colors: {
        base: "hsl(0, 0%, 95%)",
        subtitle: "hsl(218, 4%, 50%)",
        primaryBlue: "hsl(212, 100% 22%)",
        accent: "rgb(41, 109, 210)",
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
        cloud1: {
          "0%": {
            opacity: "0",
            transform: "translateX(-60%) translateY(-50%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(-50%) translateY(-50%)",
          },
        },
        cloud2: {
          "0%": {
            opacity: "0",
            transform: "translateX(60%) translateY(30%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(60%) translateY(20%)",
          },
        },
      },

      // translate-x-[75%] translate-y-[20%]

      animation: {
        fadeIn: "fadeIn 350ms forwards",
        fadeOut: "fadeIn 350ms forwards reverse",
        popIn: "popIn 350ms forwards",
        popOut: "popIn 350ms forwards reverse",
        cloud1: "cloud1 550ms linear 0s 1 normal none running",
        cloud2: "cloud2 550ms linear 0s 1 normal none running",
      },
    },
  },
  plugins: [],
};
