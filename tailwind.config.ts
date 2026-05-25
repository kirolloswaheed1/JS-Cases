import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JS Cases brand palette
        // Warm beige background + deep maroon accent
        brand: {
          bg: '#CCC0B4',        // page background
          'bg-soft': '#D9CFC4',  // slightly lighter beige
          'bg-deep': '#B8AC9F',  // slightly darker beige
          paper: '#FFFFFF',      // cards / panels
          cream: '#F2EDE6',      // very soft cream
          ink: '#000000',        // primary text
          'ink-soft': '#1A1A1A',
          muted: '#6B6258',      // muted text on beige
          primary: '#690001',    // CTA / accent maroon
          'primary-hover': '#520001',
          'primary-soft': '#F0E0E0',
          'primary-label': '#FFFFFF',
          outline: '#690001',
          stroke: '#A89E92',     // subtle border on beige
          'stroke-soft': '#C0B5A8',
          danger: '#690001',
          warning: '#8A6A00',
          info: '#1F4A6B',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(105,0,1,0.08)',
        pop: '0 8px 24px rgba(105,0,1,0.25)',
        card: '0 2px 10px rgba(0,0,0,0.06)',
        inset: 'inset 0 0 0 1px rgba(105,0,1,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
