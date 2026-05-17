// ================================================================
// MYSTERIUM FIDEI — Theme Toggle Component
// ================================================================
// A dropdown that appears when the user clicks the theme icon
// in the topbar. Shows all three themes with colour swatches
// and lets the user switch instantly.
// ================================================================

'use client'

import { useState } from 'react'
import { useTheme, THEMES, type Theme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    // Relative positioning so the dropdown anchors to this button
    <div className="relative">

      {/* Toggle button — moon/sun icon in the topbar */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
        title="Change theme"
        className="w-8 h-8 rounded-full flex items-center justify-center
                   transition-colors cursor-pointer"
        style={{
          backgroundColor: 'rgba(184, 135, 42, 0.15)',
          border: '0.5px solid rgba(184, 135, 42, 0.3)',
        }}
      >
        {/* Icon changes based on active theme */}
        <span className="text-sm" style={{ color: 'var(--color-sacred-gold)' }}>
          {theme === 'parchment' ? '☀' : '☽'}
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/*
            Invisible overlay — clicking anywhere outside
            the dropdown closes it. This is the standard
            pattern for click-away dismissal.
          */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Theme options panel */}
          <div
            className="absolute right-0 top-10 z-50 rounded-xl
                       shadow-lg overflow-hidden w-52"
            style={{
              backgroundColor: 'var(--theme-bg-secondary, white)',
              border: '0.5px solid var(--theme-border-strong)',
            }}
          >
            {/* Panel header */}
            <div
              className="px-3 py-2"
              style={{
                borderBottom: '0.5px solid var(--theme-border)',
              }}
            >
              <p
                className="text-[9px] font-medium tracking-[0.12em]
                           uppercase"
                style={{ color: 'var(--color-sacred-gold)' }}
              >
                Reading theme
              </p>
            </div>

            {/* Theme options */}
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as Theme)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5
                           transition-colors text-left cursor-pointer"
                style={{
                  backgroundColor:
                    theme === t.id
                      ? 'rgba(184, 135, 42, 0.1)'
                      : 'transparent',
                }}
              >
                {/* Colour swatch */}
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: t.preview,
                    border: '1.5px solid rgba(184, 135, 42, 0.5)',
                    // Active theme gets a gold ring
                    boxShadow:
                      theme === t.id
                        ? '0 0 0 2px rgba(184, 135, 42, 0.6)'
                        : 'none',
                  }}
                />

                {/* Theme name and description */}
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: 'var(--theme-text, var(--color-ink))' }}
                  >
                    {t.label}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      color: 'var(--theme-text-3, rgba(61,52,37,0.5))',
                    }}
                  >
                    {t.description}
                  </p>
                </div>

                {/* Active checkmark */}
                {theme === t.id && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: 'var(--color-sacred-gold)' }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}