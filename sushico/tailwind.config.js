/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sushico: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          anthracite: '#2d2d2d',
          red: '#c41e24',
          'red-dark': '#9e1a1f',
          gold: '#c9a96e',
          cream: '#f5f0e8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
