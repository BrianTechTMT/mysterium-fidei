// ================================================================
// MYSTERIUM FIDEI — Bottom Tab Bar
// ================================================================
// Mobile navigation bar shown at the bottom on iPhone.
// Replaces the sidebar which is too wide for mobile screens.
// Five tabs: Daily, Notes, Servus, Review, Settings
// ================================================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/daily',
    label: 'Daily',
    icon: '📅',
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: '📖',
  },
  {
    href: '/notes/new',
    label: 'New',
    icon: '✏',
    primary: true,  // highlighted centre button
  },
  {
    href: '/review',
    label: 'Review',
    icon: '🃏',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: '⚙',
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor: 'var(--theme-card)',
        borderTop: '0.5px solid var(--theme-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 50,
        boxShadow: '0 -4px 20px rgba(28,22,16,0.08)',
      }}
    >
      {TABS.map(tab => {
        const isActive = pathname.startsWith(tab.href) &&
          !(tab.href === '/notes' && pathname === '/notes/new')

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-sacred-gold)',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(184,135,42,0.4)',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            </Link>
          )
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: isActive
                ? 'rgba(184,135,42,0.1)'
                : 'transparent',
            }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? 500 : 400,
                color: isActive
                  ? 'var(--color-sacred-gold)'
                  : 'var(--theme-text-3)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}