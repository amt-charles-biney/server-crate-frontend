/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      screens: {
        maxCap: '1440px'
      },
      colors: {
        'figma-gray': '#bdbdbd',
        'figma-green': '#3cb043',
        'placeholder': '#B9BDC2',
        'attr-button': '#F3F4F6',
        'table-text': '#667085',
        'light-green': '#ECF7EC',
        'table-bg': '#FCFCFD'
      },
      gridTemplateRows: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      gridRow: {
        'span-9': 'span 9 / span 9',
      },
      fontFamily: {
        'inter': ['inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}
