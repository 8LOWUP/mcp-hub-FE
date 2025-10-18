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
                // 스크롤바 숨김 유틸리티
                '.scrollbar-hide': {
                    /* Firefox */
                    'scrollbar-width': 'none',
                    /* Safari and Chrome */
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
            };
            addUtilities(newUtilities, ['responsive']);
        }),
    ],
};

export default tailwindConfig;
