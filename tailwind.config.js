/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          900: '#1a2e1a', // very dark green
          800: '#2c4a2c', // dark green
          700: '#3e663e', // medium-dark green
          600: '#4f824f', // medium green
          500: '#619e61', // base green
          400: '#7cb57c', // lighter green
        },
        surface: {
          dark: '#121212',
          DEFAULT: '#1e1e1e',
          light: '#2c2c2c',
        }
      }
    },
  },
  plugins: [],
}

