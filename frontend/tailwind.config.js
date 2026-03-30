/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#f8f9ff',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'inverse-on-surface': '#eaf1ff',
        'inverse-primary': '#4edea3',
        'inverse-surface': '#27313f',
        'on-background': '#121c2a',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'on-primary': '#ffffff',
        'on-primary-container': '#00422b',
        'on-surface': '#121c2a',
        'on-surface-variant': '#3c4a42',
        outline: '#6c7a71',
        'outline-variant': '#bbcabf',
        primary: '#006c49',
        'primary-container': '#10b981',
        secondary: '#0058be',
        'secondary-container': '#2170e4',
        surface: '#f8f9ff',
        'surface-container': '#e6eeff',
        'surface-container-high': '#dee9fc',
        'surface-container-highest': '#d9e3f6',
        'surface-container-low': '#eff4ff',
        'surface-container-lowest': '#ffffff',
        tertiary: '#a43a3a',
        'tertiary-container': '#fc7c78'
      },
      boxShadow: {
        'ambient': '0 20px 50px -12px rgba(18, 28, 42, 0.08)',
      },
      borderRadius: {
        'xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
