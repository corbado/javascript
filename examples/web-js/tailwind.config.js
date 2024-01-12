/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        eloquent: 'var(--font-eloquent)',
      },
      colors: {
        lightBrown: 'var(--color-light-brown)',
        darkBrown: 'var(--color-dark-brown)',
        white: 'var(--color-white)',
        black: 'var(--color-black)',
      },
    },
  },
  plugins: [],
}

