/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dim: '#8B6914',
          subtle: 'rgba(201,168,76,0.08)',
          glow: 'rgba(201,168,76,0.15)',
        },
        ink: {
          50: '#F0EDE6',
          100: '#D6D0C4',
          200: '#A09B8C',
          300: '#5C5750',
          400: '#2A2822',
          500: '#1E2030',
          600: '#181923',
          700: '#13141C',
          800: '#0D0E13',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Cormorant Garamond', 'Georgia', 'serif'],
        ui: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      maxWidth: {
        reader: '700px',
      },
    },
  },
  plugins: [],
}
