// ================================================================
// MYSTERIUM FIDEI — Root Layout (with Theme System)
// ================================================================

import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: {
    template: '%s | Mysterium Fidei',
    default: 'Mysterium Fidei',
  },
  description:
    'A Catholic theology study app rooted in both forms of the ' +
    'Roman Rite. Study Scripture, theology, philosophy, apologetics, ' +
    'and spirituality with Servus — an AI servant guided by humility.',
  keywords: [
    'Catholic theology',
    'Extraordinary Form',
    'Tridentine',
    'Douay-Rheims',
    'Divinum Officium',
    'Catholic study',
    'Liturgy of the Hours',
  ],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="parchment">
      <body>
        {/*
          Inline script runs before React hydrates.
          Reads localStorage and sets data-theme on <html>
          immediately — prevents any flash of wrong theme.
          This is the industry standard pattern for
          theme persistence without flicker.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('mf-theme');
                  var valid = ['parchment', 'sanctum', 'scriptorium'];
                  var theme = valid.includes(saved) ? saved : 'parchment';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />

        <ThemeProvider>
          <div className="min-h-screen grid grid-rows-[56px_1fr]">

            {/* ---- Topbar ------------------------------------ */}
            <header
              className="flex items-center px-5 gap-4 sticky top-0 z-50"
              style={{
                backgroundColor: 'var(--color-sanctum-black)',
                borderBottom: '2px solid var(--color-sacred-gold)',
              }}
            >
              {/* App name */}
              <div
                className="text-sm font-medium flex-shrink-0
                           leading-tight tracking-widest"
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  color: 'var(--color-sacred-gold)',
                }}
              >
                MYSTERIUM
                <span
                  className="block text-[10px] font-light
                             tracking-[0.15em] normal-case"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  Fidei
                </span>
              </div>

              {/* Divider */}
              <div
                className="w-px h-7 flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              />

              {/* Search */}
              <div className="flex-1 max-w-md">
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search notes, scripture, theology..."
                    className="bg-transparent text-xs outline-none w-full"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="ml-auto flex items-center gap-3">

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Servus badge */}
                <div
                  className="text-[11px] font-medium px-3 py-1
                             rounded-full tracking-wide cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(184,135,42,0.15)',
                    border: '0.5px solid rgba(184,135,42,0.3)',
                    color: 'var(--color-sacred-gold-lt)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  ✦ Servus
                </div>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center
                             justify-center text-white text-xs
                             font-medium cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-apologetics)',
                    border: '2px solid rgba(184,135,42,0.4)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  BT
                </div>

              </div>
            </header>

            {/* ---- Page content ------------------------------ */}
            <main className="overflow-auto relative">
              {/*
                Parchment texture overlay — pure CSS SVG noise filter.
                The pseudo-element approach doesn't work in React so
                we use a absolutely positioned div instead.
                pointer-events-none means it never blocks clicks.
                Only visible on parchment theme — hidden on dark themes.
              */}
              <div
                aria-hidden="true"
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                  opacity: 0.06,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
              </div>
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}