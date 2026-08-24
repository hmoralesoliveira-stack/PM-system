import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#F7F7F5',
        card: '#FFFFFF',
        border: '#E4E2DD',
        accent: '#2F6F4E',
      },
    },
  },
  plugins: [],
};
export default config;
