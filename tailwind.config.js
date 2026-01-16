/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // ← OS設定に自動追従
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
