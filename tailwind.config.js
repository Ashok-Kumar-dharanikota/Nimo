/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#27170c',
        sage: '#A4B47C',
        chocolate: '#3E2B1F',
        terracotta: '#E67E22',
        background: '#fbf9f4',
        surface: '#fbf9f4',
        onSurface: '#1b1c19',
        onSurfaceVariant: '#4f453f',
        surfaceContainerHighest: '#e4e2dd',
        surfaceContainerLow: '#f5f3ee',
        surfaceContainerLowest: '#ffffff',
        surfaceVariant: '#e4e2dd',
        canvas: '#F2EFE9',
        secondary: '#566434',
        surfaceContainer: '#f0eee9',
        tertiaryContainer: '#4d2400',
        onTertiaryContainer: '#e37c1f',
        outline: '#81756e',
        outlineVariant: '#d2c4bc',
        primaryContainer: '#3e2b1f',
        onPrimaryContainer: '#ad9181',
        
        // Dark theme equivalents
        darkPrimary: '#dfc0af',
        darkSage: '#bdcd93',
        darkChocolate: '#dfc0af',
        darkTerracotta: '#ffb783',
        darkBackground: '#1b1c19',
        darkSurface: '#1b1c19',
        darkOnSurface: '#fbf9f4',
        darkOnSurfaceVariant: '#d2c4bc',
        darkSurfaceContainerHighest: '#4f453f',
        darkSurfaceContainerLow: '#30312e',
        darkSurfaceContainerLowest: '#1b1c19',
        darkSurfaceVariant: '#4f453f',
        darkCanvas: '#2e2e2e',
        darkSecondary: '#d9eaad',
        darkSurfaceContainer: '#30312e',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      spacing: {
        'unit': '8px',
        'gutter': '16px',
      }
    },
  },
  plugins: [],
}
