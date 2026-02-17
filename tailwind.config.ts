import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f3f0',
          100: '#e8e4dc',
          200: '#d0c8bc',
          300: '#b5a99a',
          400: '#9a8c7e',
          500: '#7d6f63',
          600: '#5c5149',
          700: '#3c3530',
          800: '#201c1a',
          900: '#0d0b0a',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-up':    'slideUp 0.3s ease forwards',
        'bookmark-in': 'bookmarkIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bookmarkIn: {
          from: { opacity: '0', transform: 'scale(0.9) translateY(8px)' },
          to:   { opacity: '1', transform: 'scale(1)   translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config