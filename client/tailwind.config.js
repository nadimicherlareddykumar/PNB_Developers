/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#fdf8f3',
        'bg-secondary': '#f5f0eb',
        'bg-dark': '#0a0a0f',
        'bg-card': '#111118',
        'accent-rose': '#e4a4bd',
        'accent-green': '#22c55e',
        'accent-red': '#ef4444',
        'text-dark': '#262626',
        'text-light': '#f8fafc',
        'text-muted': 'rgba(38, 38, 38, 0.7)',
      },
      fontFamily: {
        'spartan': ['League Spartan', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
