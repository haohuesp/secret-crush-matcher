/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shy Love Theme Colors
        'crush-pink': '#FF6B9D',
        'crush-pink-light': '#FFB6C1',
        'crush-pink-dark': '#E91E63',
        'crush-purple': '#C9A7FF',
        'crush-purple-light': '#E8DAFF',
        'crush-cream': '#FFF5F5',
        'crush-cream-dark': '#FFE4E4',
        'blush': '#FFCCD5',
        'heart-red': '#FF4D6D',
      },
      fontFamily: {
        'cute': ['Nunito', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'shy-tremble': 'shyTremble 0.3s ease-in-out infinite',
        'blush-appear': 'blushAppear 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shyTremble: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '75%': { transform: 'translateX(2px) rotate(1deg)' },
        },
        blushAppear: {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.5)',
        'glow-purple': '0 0 20px rgba(201, 167, 255, 0.5)',
      },
    },
  },
  plugins: [],
}
