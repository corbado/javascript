/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: 'var(--font-roboto)',
      },
      colors: {
        lightIndigo: 'var(--color-light-indigo)',
        darkIndigo: 'var(--color-dark-indigo)',
        white: 'var(--color-white)',
        black: 'var(--color-black)',
      },
    },
  },
  plugins: [],
};
