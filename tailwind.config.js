/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'serif'],
      },
      colors: {
        claude: {
          bg: '#F9F9F7',
          text: '#3A3A3A',
          darkBg: '#1A1A1A',
          darkText: '#EAEAEA',
          accent: '#D96C5B'
        }
      }
    },
  },
  plugins: [],
}