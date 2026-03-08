/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        quickbee: {
          yellow:  '#FFC107',
          green:   '#1DB954',
          orange:  '#FF6B35',
          red:     '#E23744',
          light:   '#FFFDF5',
          gray:    '#F5F5F5',
          dark:    '#1C1C1E',
          muted:   '#8A8A8E',
        },
        // keep blinkit alias so old class names still work during migration
        blinkit: {
          yellow:  '#FFC107',
          green:   '#1DB954',
          orange:  '#FF6B35',
          red:     '#E23744',
          light:   '#FFFDF5',
          gray:    '#F5F5F5',
          dark:    '#1C1C1E',
          muted:   '#8A8A8E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
