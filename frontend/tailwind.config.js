/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue-500
        secondary: '#1e293b', // slate-800
        background: '#0f172a', // slate-900
        card: '#1e293b', // slate-800
        bullish: '#22c55e', // green-500
        bearish: '#ef4444', // red-500
      }
    },
  },
  plugins: [],
}