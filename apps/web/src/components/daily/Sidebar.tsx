// ================================================================
// MYSTERIUM FIDEI — Sidebar
// ================================================================
// Left column of the Daily Sacred three-column layout.
// Discipline navigation, today's study plan, daily review button.
// 'use client' because it uses useState for interactivity.
// ================================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'

const DISCIPLINES = [
  { id: 'philosophy',   label: 'Philosophy',   colour: '#7A4A10' },
  { id: 'apologetics',  label: 'Apologetics',  colour: '#7A1F2E' },
  { id: 'bible',        label: 'Bible',        colour: '#0F6E56' },
  { id: 'theology',     label: 'Theology',     colour: '#2B3B6B' },
  { id: 'spirituality', label: 'Spirituality', colour: '#3D5C3A' },
]

const INITIAL_PLAN = [
  { label: 'Office of Readings', done: true  },
  { label: 'Lauds & meditation', done: true  },
  { label: 'Gospel note',        done: false },
  { label: 'Saint study',        done: false },
  { label: 'Servus session',     done: false },
  { label: 'Flashcard review',   done: false },
  { label: 'Vespers',            done: false },
]

export function Sidebar() {
  const [activeDisc, setActiveDisc] = useState('theology')
  const [plan, setPlan] = useState(INITIAL_PLAN)

  const toggle = (i: number) =>
    setPlan(prev =>
      prev.map((item, idx) =>
        idx === i ? { ...item, done: !item.done } : item
      )
    )

  const done = plan.filter(i => i.done).length

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto flex-shrink-0"
      style={{
        width: '210px',
        backgroundColor: 'var(--theme-sidebar, #F0EBE0)',
        borderRight: '0.5px solid var(--theme-border)',
      }}
    >
      {/* Streak bar */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          borderBottom: '0.5px solid var(--theme-border)',
          backgroundColor: 'rgba(184,135,42,0.07)',
        }}
      >
        <span>🔥</span>
        <span
          className="text-[10px] font-medium"
          style={{ color: 'var(--color-sacred-gold)' }}
        >
          7-day streak
        </span>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: 'var(--color-sacred-gold)' }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-3 pb-1">
        <p className="section-label">Navigate</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 pb-2">
        {[
          { href: '/daily',     icon: '📅', label: 'Daily Sacred' },
          { href: '/notes',     icon: '📖', label: 'My Notes'     },
          { href: '/notes/new', icon: '✏',  label: 'New Note'     },
          { href: '/review',    icon: '🃏', label: 'Review'       },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 10px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--theme-text-2)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div
        className="mx-3"
        style={{ height: '0.5px', backgroundColor: 'var(--theme-border)' }}
      />

      {/* Disciplines */}
      <div className="px-3 pt-3 pb-1">
        <p className="section-label">Disciplines</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 pb-2">
        {DISCIPLINES.map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDisc(d.id)}
            className="flex items-center gap-2.5 px-2 py-2
                       rounded-lg w-full text-left cursor-pointer
                       transition-all"
            style={{
              backgroundColor:
                activeDisc === d.id
                  ? 'rgba(184,135,42,0.1)'
                  : 'transparent',
              borderLeft:
                activeDisc === d.id
                  ? `2px solid ${d.colour}`
                  : '2px solid transparent',
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: d.colour }}
            />
            <span
              className="text-xs font-medium"
              style={{
                color:
                  activeDisc === d.id
                    ? d.colour
                    : 'var(--theme-text-2)',
              }}
            >
              {d.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div
        className="mx-3"
        style={{
          height: '0.5px',
          backgroundColor: 'var(--theme-border)',
        }}
      />

      {/* Today's plan */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <p className="section-label">Today&apos;s plan</p>
        <span
          className="text-[9px] font-medium"
          style={{ color: 'var(--color-sacred-gold)' }}
        >
          {done}/{plan.length}
        </span>
      </div>
      <div className="flex flex-col px-3 pb-3 gap-1">
        {plan.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-2 w-full text-left
                       cursor-pointer py-0.5"
          >
            <div
              className="w-4 h-4 rounded flex-shrink-0 flex
                         items-center justify-center"
              style={{
                backgroundColor: item.done
                  ? 'var(--color-of-teal)'
                  : 'transparent',
                border: item.done
                  ? 'none'
                  : '0.5px solid var(--theme-border-strong)',
              }}
            >
              {item.done && (
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-[11px]"
              style={{
                color: item.done
                  ? 'var(--theme-text-3)'
                  : 'var(--theme-text-2)',
                textDecoration: item.done ? 'line-through' : 'none',
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* New note button */}
      <div className="px-3 pb-2">
        <Link
          href="/notes/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(184,135,42,0.08)',
            border: '0.5px solid rgba(184,135,42,0.25)',
            color: 'var(--color-sacred-gold)',
            fontSize: '12px',
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ✏ New note
        </Link>
      </div>

      {/* Daily review button — pinned to bottom */}
      <div className="mt-auto p-3">
        <button
          className="w-full py-2 px-3 rounded-lg text-xs font-medium
                     text-white flex items-center gap-2 justify-center
                     cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-apologetics)' }}
        >
          ▶ Daily Review (8 due)
        </button>
      </div>
    </aside>
  )
}