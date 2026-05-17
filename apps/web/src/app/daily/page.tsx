// ================================================================
// MYSTERIUM FIDEI — Daily Sacred Page (placeholder)
// ================================================================
// This is the main screen of the app — the liturgical dashboard
// showing today's EF and OF readings, Office, saints, and
// the Servus thematic synthesis.
//
// This placeholder confirms routing and the brand system work.
// The full dashboard UI is built in Phase 3.
// ================================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Sacred',
}

export default function DailyPage() {
  return (
    <div className="flex items-center justify-center min-h-full
                    bg-parchment">
      <div className="text-center space-y-5 p-8">

        {/* App mark — cross in circle */}
        <div className="w-16 h-16 rounded-full border-2 border-sacred-gold
                        flex items-center justify-center mx-auto">
          <div className="w-11 h-11 rounded-full border border-sacred-gold/30
                          flex items-center justify-center">
            <span className="font-cinzel text-sacred-gold text-xs
                             tracking-widest">
              MF
            </span>
          </div>
        </div>

        {/* App name */}
        <div>
          <h1 className="font-cinzel text-2xl text-ink tracking-[0.15em]
                         font-medium">
            MYSTERIUM FIDEI
          </h1>
          <p className="font-cormorant italic text-sacred-gold text-lg mt-1">
            The Mystery of Faith
          </p>
        </div>

        {/* Discipline chips — confirming Tailwind brand colours work */}
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
              className={`${cls} text-[10px] font-medium font-sans
                         px-3 py-1 rounded-full tracking-wide`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Liturgical form chips */}
        <div className="flex gap-2 justify-center">
          <span className="chip-ef text-[10px] font-medium font-sans
                           px-3 py-1 rounded-full tracking-wide">
            Extraordinary Form · pre-1962
          </span>
          <span className="chip-of text-[10px] font-medium font-sans
                           px-3 py-1 rounded-full tracking-wide">
            Ordinary Form · post-1970
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-of-teal animate-pulse" />
          <p className="text-[10px] font-sans text-ink-2/40
                        tracking-[0.15em] uppercase">
            Daily Sacred dashboard — Phase 3
          </p>
        </div>

      </div>
    </div>
  )
}