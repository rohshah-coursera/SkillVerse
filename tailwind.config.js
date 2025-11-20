/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coursera-blue': {
          50: '#E8F0FE',
          100: '#D1E1FD',
          200: '#A3C3FB',
          300: '#75A5F9',
          400: '#4285F4',
          500: '#4285F4',
          600: '#3367D6',
          700: '#2C5AA0',
          800: '#1E3D6E',
          900: '#10203C',
        },
        'coursera-gray': {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#0D1117',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

