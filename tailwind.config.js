/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#000000',
        blue: '#002C9E',
        'blue-mid': '#1A44A8',
        'blue-soft': '#3361B8',
        'blue-pale': '#D6E0F5',
        'blue-lite': '#EBF0FA',
        gold: '#FFFF00',
        'gold-lt': '#FFFF00',
        'gray-dk': '#4a5e78',
        gray: '#7a90aa',
        'gray-lt': '#b8cce0',
        bg: '#f2f7fc',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
