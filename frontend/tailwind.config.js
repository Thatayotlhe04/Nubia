/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nubia Design System - Calm, Editorial, Academic
        nubia: {
          // Backgrounds
          'bg': '#FAFAF8',
          'bg-warm': '#F7F6F3',
          'surface': '#FFFFFF',
          'surface-alt': '#F5F4F1',
          
          // Text
          'text': '#1A1A1A',
          'text-secondary': '#5C5C5C',
          'text-muted': '#8A8A8A',
          'text-faint': '#ADADAD',
          
          // Accent - Muted slate blue
          'accent': '#4A5568',
          'accent-subtle': '#E8EBF0',
          'accent-hover': '#3D4756',
          
          // Borders
          'border': '#E5E5E3',
          'border-subtle': '#EFEFED',
          'border-strong': '#D1D1CF',
          
          // Semantic
          'success': '#3D7A5F',
          'success-subtle': '#E8F3ED',
          'warning': '#9A7B4F',
          'warning-subtle': '#F9F5ED',
          'error': '#9B4F4F',
          'error-subtle': '#F9EDEE',
        }
      },
      fontFamily: {
        // Editorial serif for body text
        'serif': ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        // Clean sans for UI elements
        'sans': ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Monospace for formulas and code
        'mono': ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'base': ['1rem', { lineHeight: '1.625rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'reading': '75ch',
        'content': '56rem',
        'prose': '65ch',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        nubia: {
          css: {
            '--tw-prose-body': '#1A1A1A',
            '--tw-prose-headings': '#1A1A1A',
            '--tw-prose-links': '#4A5568',
            '--tw-prose-bold': '#1A1A1A',
            '--tw-prose-counters': '#5C5C5C',
            '--tw-prose-bullets': '#8A8A8A',
            '--tw-prose-hr': '#E5E5E3',
            '--tw-prose-quotes': '#5C5C5C',
            '--tw-prose-quote-borders': '#E5E5E3',
            '--tw-prose-captions': '#5C5C5C',
            '--tw-prose-code': '#1A1A1A',
            '--tw-prose-pre-code': '#1A1A1A',
            '--tw-prose-pre-bg': '#F5F4F1',
            '--tw-prose-th-borders': '#E5E5E3',
            '--tw-prose-td-borders': '#EFEFED',
          },
        },
      },
    },
  },
  plugins: [],
}
