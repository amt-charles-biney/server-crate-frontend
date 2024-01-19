/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'figma-gray': '#bdbdbd',
        'figma-green': '#3cb043'
      },
      gridTemplateRows: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      gridRow: {
        'span-9': 'span 9 / span 9',
      },
      fontFamily: {
        'inter': ['inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
