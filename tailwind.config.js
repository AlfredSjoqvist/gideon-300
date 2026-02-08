/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Modern Sans for body text (clean, readable)
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Classic Serif for headings (editorial feel)
        serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'Merriweather', 'serif'],
      },
      colors: {
        claude: {
          bg: '#F9F9F7',       // Warm/Paper background
          text: '#2D2D2D',     // Softer black for reading
          accent: '#D96C5B',   // Muted accent
          darkBg: '#131313',   // Deep OLED black
          darkText: '#E0E0E0'  // Off-white
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.claude.text'),
            '--tw-prose-headings': '#111',
            '--tw-prose-links': '#CC5500', // Burnt orange/link color (more editorial than standard blue)
            '--tw-prose-bold': '#000',
            '--tw-prose-counters': theme('colors.gray.500'),
            '--tw-prose-bullets': theme('colors.gray.400'),
            '--tw-prose-hr': theme('colors.gray.200'),
            '--tw-prose-quotes': '#111',
            '--tw-prose-quote-borders': theme('colors.gray.300'),
            '--tw-prose-captions': theme('colors.gray.500'),
            '--tw-prose-code': '#111',
            '--tw-prose-pre-code': theme('colors.gray.200'),
            '--tw-prose-pre-bg': '#2d2d2d',
            '--tw-prose-invert-body': theme('colors.claude.darkText'),
            '--tw-prose-invert-headings': '#fff',
            '--tw-prose-invert-links': '#FF8C42', // Brighter orange for dark mode
            '--tw-prose-invert-bold': '#fff',
            '--tw-prose-invert-hr': theme('colors.gray.700'),
          },
        },
        // Custom modifiers for specific elements
        lg: {
          css: {
            h1: {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '800',
              fontSize: '2.5rem',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
            },
            h2: {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '700',
              fontSize: '1.75rem',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottomWidth: '1px', // The "Newspaper Section" look
              borderColor: theme('colors.gray.200'),
            },
            h3: {
              fontFamily: theme('fontFamily.sans'), // Switch to Sans for sub-headers (modern touch)
              fontWeight: '600',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: theme('colors.gray.500'),
              marginTop: '2rem',
            },
            h4: {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: 'bold',
              fontSize: '1.25rem',
              marginTop: '1.5rem',
            },
            'a': {
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s',
              '&:hover': {
                color: theme('colors.gray.900'),
                textDecoration: 'underline',
              },
            },
            blockquote: {
              fontFamily: theme('fontFamily.serif'),
              fontStyle: 'italic',
              borderLeftColor: theme('colors.claude.accent'),
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}