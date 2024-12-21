/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#004aad',
        'primary-25': '#004aad40',
        'secondary': {
          100: '#E2E2D5',
          200: '#888883',
        },
      },
    },
  },
  plugins: [],
}

