/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: 'var(--font-roboto)',
      },
      colors: {
        lightBrown: 'var(--color-light-indigo)',
        darkBrown: 'var(--color-dark-indigo)',
        white: 'var(--color-white)',
        black: 'var(--color-black)',
      },
    },
  },
  plugins: [],
};
