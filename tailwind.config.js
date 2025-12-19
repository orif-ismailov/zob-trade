/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Olive Brown (Trust & Industry)
        primary: {
          50: '#f7f7f5',
          100: '#edece6',
          200: '#d9d7cc',
          300: '#c0bda9',
          400: '#a19c7f',
          500: '#857f5f',
          600: '#6b6449',
          700: '#514c38',
          800: '#3a3728',
          900: '#242011', // Main primary color
          950: '#14120a'
        },
        // Accent - Warm Gold (Complementary)
        accent: {
          50: '#fefcf5',
          100: '#fcf6e4',
          200: '#f9ecc4',
          300: '#f3dc99',
          400: '#ebc862',
          500: '#e0b03a',
          600: '#c9932a', // Main accent color
          700: '#a77320',
          800: '#875b1e',
          900: '#6f4b1c',
          950: '#40290d'
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
