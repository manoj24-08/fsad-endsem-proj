/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f2ff',
          100: '#ede6ff',
          200: '#daccff',
          300: '#c0a7ff',
          400: '#a377ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b0764'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(17, 24, 39, 0.10)',
        card: '0 8px 20px rgba(17, 24, 39, 0.08)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    },
  },
  plugins: [],
}
