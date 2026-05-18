'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): {
  breakpoint: Breakpoint
  mounted: boolean
} {
  // Start as not mounted — forces a re-render after
  // the browser has measured the real window width
  const [mounted, setMounted] = useState(false)
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')

  useEffect(() => {
    // Read the real window width and set both states together
    setBreakpoint(getBreakpoint())
    setMounted(true)

    function handleResize() {
      setBreakpoint(getBreakpoint())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { breakpoint, mounted }
}