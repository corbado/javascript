/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--primary-font)', 'sans-serif'],
        secondary: ['var(--secondary-font)', 'sans-serif'],
      },
      fontSize: {
        'cd-1': '0.75rem',
        'cd-2': '0.85rem',
        'cd-3': '1rem',
        'cd-4': '24px',
        'cd-5': '28px',
      },
      spacing: {
        'cd-1': '0.25rem',
        'cd-2': '0.3rem',
        'cd-3': '0.4rem',
        'cd-4': '0.5rem',
        'cd-5': '0.6rem',
        'cd-6': '0.7rem',
        'cd-7': '0.75rem',
        'cd-8': '0.8rem',
        'cd-9': '0.85rem',
        'cd-10': '1rem',
        'cd-11': '1.1rem',
        'cd-12': '1.2rem',
        'cd-13': '1.3rem',
        'cd-14': '1.4rem',
        'cd-15': '1.5rem',
        'cd-16': '2rem',
        'cd-17': '2.5rem',
      },
      colors: {
        'error-color': 'var(--error-color)',
        'light-color': 'var(--light-color, #8F9BBF)',
        'primary-color': 'var(--primary-color, #1953ff)',
        'text-color': 'var(--text-color, #535e80)',
        'secondary-font-color': 'var(--secondary-font-color, --primary-color)',
        'primary-hover-color': 'var(--primary-hover-color, --primary-color)',
        'secondary-border-color': 'var(--secondary-border-color, --primary-color)',
        'secondary-background-color': 'var(--secondary-background-color, #fff)',
        'disabled-color': 'var(--text-color, #535e80)',
        'email-provider-btn-color': 'var(--email-provider-btn-color, #fff)'
      },
      borderRadius: ({ theme }) => ({
        ...theme('spacing'),
      }),
      keyframes: {
        'cd-spin': {
          'from': { transform: 'rotate(0turn)' },
          'to': { transform: 'rotate(1turn)' },
        }
      },
      animation: {
        'cd-spin': 'cd-spin 1s ease infinite',
      },
      screens: {
        'cd-sm': '576px',
      },
    },
  },
  plugins: [],
}

