/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adding custom font family
      fontFamily: {
        italianno: ['"Italianno"', 'cursive'],
      },
      
      // Adding custom animations and keyframes
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
        customBounce: 'customBounce 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        customBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [],
}
