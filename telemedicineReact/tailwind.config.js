/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#012f33',
          light: '#024b4f', // Slightly lighter shade
          dark: '#001f22' // Darker shade
        },
      }
    }
  },
  plugins: [],
}