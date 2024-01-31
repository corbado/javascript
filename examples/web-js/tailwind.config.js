/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
};
