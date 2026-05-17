// ================================================================
// MYSTERIUM FIDEI — Root Layout
// ================================================================
// This wraps every single page in the app.
// In Next.js App Router, layout.tsx is the persistent shell —
// it renders once and stays mounted as the user navigates.
//
// What lives here:
// - HTML metadata (title, description)
// - The persistent topbar
// - The main content area where pages render
//
// NOTE — Tailwind v4:
// Custom colour opacity modifiers (bg-sacred-gold/15) require
// the colour to be defined as an rgb value in @theme to work.
// We use inline style for custom colour + opacity combinations,
// and standard Tailwind classes for everything else.
// ================================================================

import type { Metadata } from 'next'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/*
          App shell — two rows:
          Row 1: 56px topbar (fixed height, always visible)
          Row 2: 1fr — fills all remaining screen height
        */}
        <div className="min-h-screen grid grid-rows-[56px_1fr]">

          {/* ---- Topbar ---------------------------------------- */}
          <header
            className="flex items-center px-5 gap-4 sticky top-0 z-50"
            style={{
              backgroundColor: 'var(--color-sanctum-black)',
              borderBottom: '2px solid var(--color-sacred-gold)',
            }}
          >

            {/* App name */}
            <div
              className="text-sm font-medium flex-shrink-0 leading-tight
                         tracking-widest"
              style={{
                fontFamily: 'var(--font-cinzel)',
                color: 'var(--color-sacred-gold)',
              }}
            >
              MYSTERIUM
              <span
                className="block text-[10px] font-light tracking-[0.15em]
                           normal-case"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Fidei
              </span>
            </div>

            {/* Vertical divider */}
            <div
              className="w-px h-7 flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />

            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Search icon */}
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

            {/* Right side — Servus badge + avatar */}
            <div className="ml-auto flex items-center gap-3">

              {/* Servus badge */}
              <div
                className="text-[11px] font-medium px-3 py-1 rounded-full
                           tracking-wide cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'rgba(184,135,42,0.15)',
                  border: '0.5px solid rgba(184,135,42,0.3)',
                  color: 'var(--color-sacred-gold-lt)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ✦ Servus
              </div>

              {/* User avatar — BT for BrianTechTMT */}
              {/*
                In Phase 4 this will pull initials from the auth session.
                Hardcoded for now.
              */}
              <div
                className="w-8 h-8 rounded-full flex items-center
                           justify-center text-white text-xs font-medium
                           cursor-pointer"
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

          {/* ---- Page content ---------------------------------- */}
          {/*
            overflow-auto allows the page to scroll
            while the topbar stays fixed above it.
          */}
          <main className="overflow-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}