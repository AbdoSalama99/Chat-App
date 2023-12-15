/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      screens: {
        sm: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
}
