/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          dark: '#2a2a2a',
          gray: '#6b7280',
          white: '#ffffff',
        },
        gold: {
          50: '#fdf8e8',
          100: '#f9ecc5',
          200: '#f3d787',
          300: '#edc249',
          400: '#e8b022',
          500: '#d4a017',
          600: '#b8860b',
          700: '#9a6f0a',
          800: '#7a5908',
          900: '#5c4306',
        },
        premium: {
          white: '#fafafa',
          light: '#f5f5f5',
          gray: '#e5e5e5',
          dark: '#171717',
          black: '#0a0a0a',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          heavy: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['7rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #d4a017, #f3d787, #b8860b)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin 12s linear infinite reverse',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'noise': 'noise 0.5s steps(2) infinite',
        'gradient-x': 'gradientX 4s ease infinite',
        'scale-up': 'scaleUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'blur-in': 'blurIn 0.5s ease-out',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        noise: {
          '0%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
          '100%': { transform: 'translate(5%, 0)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(20px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'gold': '0 4px 14px 0 rgba(212, 160, 23, 0.39)',
        'premium': '0 20px 60px rgba(0, 0, 0, 0.3)',
        'card': '0 2px 40px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
