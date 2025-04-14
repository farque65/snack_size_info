/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
      },
      colors: {
        background: '#F8F9FF',
        primary: '#FF7262',
        'primary-hover': '#FF8A7D',
        secondary: '#00C4CC',
        'secondary-hover': '#00D6DE',
        accent: '#7D2AE8',
        'accent-hover': '#8F45F2',
        success: '#00C48C',
        'success-hover': '#00D69C',
        warning: '#FFB800',
        'warning-hover': '#FFC526',
        charcoal: '#051B2C',
        muted: '#6B7280',
        interactive: '#2563EB',
        border: '#E2E8F0',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};