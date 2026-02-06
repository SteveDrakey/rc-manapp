/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rc: {
          50: '#edfcf5',
          100: '#d3f8e6',
          200: '#aaf0d1',
          300: '#7ADCB4',
          400: '#42c692',
          500: '#22ae78',
          600: '#148d60',
          700: '#10714f',
          800: '#115a40',
          900: '#104a36',
          950: '#06291e',
        },
        shark: {
          50: '#f5f5f6',
          100: '#e5e6e7',
          200: '#c9cbce',
          300: '#a8adb2',
          400: '#7a8088',
          500: '#5a6068',
          600: '#434950',
          700: '#32373d',
          800: '#282c31',
          900: '#1E2124',
          950: '#161819',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
