/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50:  '#FAF8F5',
          100: '#F5F0E8',
          200: '#EDE6D6',
          300: '#D4C5A9',
          400: '#C9B48C',
          500: '#B5A07A',
          600: '#9A8560',
        },
        charcoal: {
          50:  '#F5F5F5',
          100: '#E0E0E0',
          200: '#9E9E9E',
          300: '#6B6B6B',
          400: '#4A4A4A',
          500: '#2E2E2E',
          600: '#1A1A1A',
        },
        gold: {
          light:   '#D4B96A',
          DEFAULT: '#B8953E',
          dark:    '#8B6F2E',
        },
        islamic: {
          green:      '#2D6A4F',
          'green-light': '#40916C',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
        arabic:  ['var(--font-amiri)', 'serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #B8953E 0%, #D4B96A 100%)',
        'gradient-charcoal': 'linear-gradient(135deg, #1A1A1A 0%, #2E2E2E 100%)',
        'gradient-beige': 'linear-gradient(135deg, #FAF8F5 0%, #EDE6D6 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.3) 100%)',
      },
      boxShadow: {
        'card':     '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glass':    '0 8px 32px rgba(0, 0, 0, 0.08)',
        'navbar':   '0 2px 16px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-in':   'slideIn 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'counter':    'counter 2s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        counter: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
