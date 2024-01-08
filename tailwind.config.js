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
      }
    }
  },
  plugins: []
}
