// ================================================================
// MYSTERIUM FIDEI — Daily Sacred Page (theme-aware placeholder)
// ================================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Sacred',
}

export default function DailyPage() {
  return (
    <div
      className="flex items-center justify-center min-h-full"
      style={{ backgroundColor: 'var(--theme-bg, var(--color-parchment))' }}
    >
      <div className="text-center space-y-5 p-8">

        {/* App mark */}
        <div
          className="w-16 h-16 rounded-full flex items-center
                     justify-center mx-auto"
          style={{ border: '2px solid var(--color-sacred-gold)' }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ border: '0.5px solid rgba(184,135,42,0.3)' }}
          >
            <span
              className="text-xs tracking-widest"
              style={{
                fontFamily: 'var(--font-cinzel)',
                color: 'var(--color-sacred-gold)',
              }}
            >
              MF
            </span>
          </div>
        </div>

        {/* App name */}
        <div>
          <h1
            className="text-2xl tracking-[0.15em] font-medium"
            style={{
              fontFamily: 'var(--font-cinzel)',
              color: 'var(--theme-text, var(--color-ink))',
            }}
          >
            MYSTERIUM FIDEI
          </h1>
          <p
            className="text-lg mt-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              color: 'var(--color-sacred-gold)',
            }}
          >
            The Mystery of Faith
          </p>
        </div>

        {/* Discipline chips */}
        <div className="flex gap-2 justify-center flex-wrap pt-2">
          {[
            { label: 'Philosophy',   cls: 'chip-philosophy'   },
            { label: 'Apologetics',  cls: 'chip-apologetics'  },
            { label: 'Bible',        cls: 'chip-bible'        },
            { label: 'Theology',     cls: 'chip-theology'     },
            { label: 'Spirituality', cls: 'chip-spirituality' },
          ].map(({ label, cls }) => (
            <span
              key={label}
              className={`${cls} text-[10px] font-medium px-3 py-1
                         rounded-full tracking-wide`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Form chips */}
        <div className="flex gap-2 justify-center">
          <span
            className="chip-ef text-[10px] font-medium px-3 py-1
                       rounded-full tracking-wide"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Extraordinary Form · pre-1962
          </span>
          <span
            className="chip-of text-[10px] font-medium px-3 py-1
                       rounded-full tracking-wide"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Ordinary Form · post-1970
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-of-teal)' }}
          />
          <p
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--theme-text-3, rgba(61,52,37,0.4))',
            }}
          >
            Daily Sacred dashboard — Phase 3
          </p>
        </div>

      </div>
    </div>
  )
}