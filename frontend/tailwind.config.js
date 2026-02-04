/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Automatically detect system preference
  theme: {
    extend: {
      colors: {
        // Nubia Design System - Calm, Editorial, Academic
        nubia: {
          // Backgrounds
          'bg': 'var(--nubia-bg)',
          'bg-warm': 'var(--nubia-bg-warm)',
          'surface': 'var(--nubia-surface)',
          'surface-alt': 'var(--nubia-surface-alt)',
          
          // Text
          'text': 'var(--nubia-text)',
          'text-secondary': 'var(--nubia-text-secondary)',
          'text-muted': 'var(--nubia-text-muted)',
          'text-faint': 'var(--nubia-text-faint)',
          
          // Accent - Muted slate blue
          'accent': 'var(--nubia-accent)',
          'accent-subtle': 'var(--nubia-accent-subtle)',
          'accent-hover': 'var(--nubia-accent-hover)',
          
          // Borders
          'border': 'var(--nubia-border)',
          'border-subtle': 'var(--nubia-border-subtle)',
          'border-strong': 'var(--nubia-border-strong)',
          
          // Semantic
          'success': 'var(--nubia-success)',
          'success-subtle': 'var(--nubia-success-subtle)',
          'warning': 'var(--nubia-warning)',
          'warning-subtle': 'var(--nubia-warning-subtle)',
          'error': 'var(--nubia-error)',
          'error-subtle': 'var(--nubia-error-subtle)',
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
        'fade-in': 'fadeIn 400ms ease-out forwards',
        'slide-up': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down': 'slideDown 400ms cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 400ms cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'stagger-1': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 50ms forwards',
        'stagger-2': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 100ms forwards',
        'stagger-3': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 150ms forwards',
        'stagger-4': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 200ms forwards',
        'stagger-5': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 250ms forwards',
        'stagger-6': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) 300ms forwards',
        'result-pop': 'resultPop 500ms cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(4px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        resultPop: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(8px)' },
          '70%': { transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
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
