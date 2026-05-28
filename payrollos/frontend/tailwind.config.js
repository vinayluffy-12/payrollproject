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
        primary: {
          navy: '#1A1F5E',
          DEFAULT: '#1A1F5E',
        },
        accent: {
          violet: '#5B5EA6',
          DEFAULT: '#5B5EA6',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#F8E8C1',
        },
        teal: {
          DEFAULT: '#0D7377',
          light: '#E2F3F3',
        },
        danger: {
          DEFAULT: '#C0392B',
          light: '#FADBD8',
        },
        surface: {
          DEFAULT: '#F0F2FD',
          dark: '#E1E4F8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1280px',
      },
    },
  },
  plugins: [],
}
