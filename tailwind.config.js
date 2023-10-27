/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14471E',
        secondary: '#68904D',
        neutral: '#C8D2D1',
        warm: '#DA6A00',
        orange: '#EE9B01',
      },
    },
  },
  plugins: [],
};
