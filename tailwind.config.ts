import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6ee',
          100: '#fde8d3',
          200: '#fbcda6',
          300: '#f8aa6e',
          400: '#f47d34',
          500: '#f15a12',
          600: '#e24108',
          700: '#bb2f09',
          800: '#95260e',
          900: '#79220f',
        },
      },
    },
  },
  plugins: [],
}
export default config
