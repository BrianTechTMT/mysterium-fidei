import type { Config } from 'tailwindcss'

// ================================================================
// MYSTERIUM FIDEI — Tailwind v4 Config
// ================================================================
// In Tailwind v4, theme values (colours, fonts, spacing) moved
// to globals.css inside @theme {}.
// This config file only needs content paths now.
// ================================================================

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config