import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{html,vue,js}'],
  parts: ['base', 'components', 'utilities'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
