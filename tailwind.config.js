/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Navy Blue (Trust & Professionalism)
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1a365d', // Main primary color
          950: '#102a43'
        },
        // Accent - Petroleum Gold (Industry Relevance)
        accent: {
          50: '#fdfaf3',
          100: '#faf3e0',
          200: '#f5e6c0',
          300: '#efd495',
          400: '#e6be64',
          500: '#d4a640',
          600: '#b8860b', // Main accent color
          700: '#9a6f09',
          800: '#7d5a0c',
          900: '#664a10',
          950: '#3d2b08'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
