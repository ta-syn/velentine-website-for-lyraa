/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-pink': '#FF0080',
                'neon-cyan': '#00F0FF',
                'neon-purple': '#B026FF',
                'dark-bg': '#0A0E27',
                'dark-surface': '#1A1F3A',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                rajdhani: ['Rajdhani', 'sans-serif'],
            },
            animation: {
                heartbeat: 'heartbeat 1.5s ease-in-out infinite',
                glitch: 'glitch 0.3s linear infinite',
                float: 'float 3s ease-in-out infinite',
            },
            keyframes: {
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)', filter: 'brightness(1.2)' },
                },
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
