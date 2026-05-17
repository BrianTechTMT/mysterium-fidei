// ================================================================
// MYSTERIUM FIDEI — Theme Context (React 19 compatible)
// ================================================================
// React 19 is stricter about setState inside useEffect.
// Fix: initialise state lazily from localStorage directly
// in useState — no setState call needed inside the effect.
// The effect only handles the DOM attribute update.
// ================================================================

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

// ---- Types ----------------------------------------------------

export type Theme = 'parchment' | 'sanctum' | 'scriptorium'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// ---- Theme metadata ------------------------------------------

export const THEMES: {
  id: Theme
  label: string
  description: string
  preview: string
}[] = [
  {
    id: 'parchment',
    label: 'Parchment',
    description: 'Warm cream · daylight study',
    preview: '#F5F0E8',
  },
  {
    id: 'sanctum',
    label: 'Sanctum',
    description: 'Cathedral black · night prayer',
    preview: '#0E0A05',
  },
  {
    id: 'scriptorium',
    label: 'Scriptorium',
    description: 'Candlelit · focused reading',
    preview: '#1C1610',
  },
]

// ---- Helpers -------------------------------------------------

const VALID_THEMES: Theme[] = ['parchment', 'sanctum', 'scriptorium']

function isValidTheme(value: string | null): value is Theme {
  return value !== null && VALID_THEMES.includes(value as Theme)
}

/**
 * Reads the saved theme from localStorage.
 * Returns 'parchment' if nothing is saved or we are on the server.
 * This runs as the lazy initialiser for useState — only once,
 * before the first render. No useEffect needed for reading.
 */
function getInitialTheme(): Theme {
  // Guard: localStorage does not exist during server-side rendering
  if (typeof window === 'undefined') return 'parchment'
  const saved = localStorage.getItem('mf-theme')
  return isValidTheme(saved) ? saved : 'parchment'
}

// ---- Context -------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ---- Provider ------------------------------------------------

export function ThemeProvider({ children }: { children: ReactNode }) {
  // useState lazy initialiser — the function runs once on mount,
  // reads localStorage, returns the saved theme or 'parchment'.
  // No setState inside useEffect needed at all.
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // This effect only syncs the DOM attribute when theme changes.
  // It does NOT call setState — so React 19 is happy.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  // The [theme] dependency means this runs:
  // 1. After the first render (sets the initial data-theme)
  // 2. After any theme change (updates data-theme to new value)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('mf-theme', newTheme)
    // We do NOT call setAttribute here — the useEffect above
    // handles the DOM update after the state change re-renders.
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ---- Hook ----------------------------------------------------

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return context
}