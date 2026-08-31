/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070814',
        surface: {
          50: '#1a1b35',
          100: '#15162c',
          200: '#101124',
          300: '#0c0d1c',
          400: '#080914',
        },
        brand: {
          purple: '#9333ea',
          violet: '#a855f7',
          neon: '#c084fc',
          cyan: '#00f2fe',
          teal: '#4facfe',
          blue: '#3b82f6',
          pink: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981',
        },
        algorand: {
          light: '#00ffff',
          primary: '#00d2ff',
          dark: '#0052cc',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.45)',
        'glow-pink': '0 0 25px -5px rgba(244, 63, 94, 0.45)',
        'glow-teal': '0 0 35px -5px rgba(79, 172, 254, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
