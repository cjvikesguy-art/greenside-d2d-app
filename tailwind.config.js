/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rolex-green': '#004d33',
        'gold': '#c5a059',
      }
    },
  },
  plugins: [],
}
