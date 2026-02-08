/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Keeps your custom fonts
        sans: ['Inter', 'sans-serif'],
        serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'serif'],
      },
      colors: {
        // Keeps your custom 'claude' theme colors
        claude: {
          bg: '#F9F9F7',
          text: '#3A3A3A',
          darkBg: '#1A1A1A',
          darkText: '#EAEAEA',
          accent: '#D96C5B'
        }
      },
      // Optional: This customizes the 'prose' (blog) styles to match your theme automatically
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.claude.text'),
            '--tw-prose-headings': '#111',
            '--tw-prose-links': theme('colors.blue.600'),
            '--tw-prose-invert-body': theme('colors.claude.darkText'),
            '--tw-prose-invert-headings': '#fff',
            '--tw-prose-invert-links': theme('colors.blue.400'),
          },
        },
      }),
    },
  },
  plugins: [
    // This is the specific line that fixes your header/hierarchy issue
    require('@tailwindcss/typography'),
  ],
}