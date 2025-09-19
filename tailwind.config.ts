import plugin from 'tailwindcss/plugin';

const tailwindConfig = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.decoration-accent': {
          'text-decoration-color': 'var(--accent-color-1)',
        },
        '.hover\\:decoration-accent:hover': {
          'text-decoration-color': 'var(--accent-color-1)',
        },
      };
      addUtilities(newUtilities, ['responsive']);
    }),
  ],
};

export default tailwindConfig;