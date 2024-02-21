/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      screens: {
        maxCap: '1440px',
        'xl': '1320px',
        '2xl': '1743px'
      },
      colors: {
        'figma-gray': '#bdbdbd',
        'figma-green': '#3cb043',
        'placeholder': '#B9BDC2',
        'attr-button': '#F3F4F6',
        'table-text': '#667085',
        'light-green': '#ECF7EC',
        'table-bg': '#FCFCFD',
        'product-text': '#676767',
        'red-color': '#E1000F',
        'yellow-color': '#F2BF08',
        'sidebar-text': '#1D2939',
        'active-link': '#F7FCF7',
        'profile-text': '#344054'
      },
      gridTemplateRows: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      gridRow: {
        'span-9': 'span 9 / span 9',
      },
      fontFamily: {
        'inter': ['inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'plus-jakarta-sans': ['Plus Jakarta Sans']
      },
      animation:{
        'ping': 'ping 1s linear infinite'},
   
    }
  },
  plugins: []
}
