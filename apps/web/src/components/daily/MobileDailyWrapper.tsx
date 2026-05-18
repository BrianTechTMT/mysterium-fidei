// ================================================================
// MYSTERIUM FIDEI — Mobile Daily Wrapper
// ================================================================
// Uses CSS media queries instead of JavaScript for responsive
// layout — instant, no timing issues, works on all devices.
//
// CSS classes:
// .mobile-only  → visible only on screens < 768px
// .desktop-only → visible only on screens >= 768px
// ================================================================

'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { FormTabs } from './FormTabs'
import { ServusPanel } from './ServusPanel'
import { MobileDailyView } from './MobileDailyView'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'

const VESTMENT_HEX: Record<string, string> = {
  green: '#2E6B2E', purple: '#4B2E6B', white: '#C8C0A8',
  red: '#8B1A1A', rose: '#C47C8A', black: '#1C1610', gold: '#B8872A',
}

interface DayData {
  date: string
  season: string
  celebration: string
  liturgicalNote?: string
  celebrationType?: string
  weekNumber: number
  psalterWeek: number
  vestmentColour: string
  usccbLink?: string
  of: {
    celebration: string
    rank: string
    saints: {
      id: string
      name: string
      rank: string
      category: string[]
      description: string
      form: string
    }[]
    officeUrl: string
  }
  ef: {
    celebration: string
    rank: string
    saints: {
      id: string
      name: string
      rank: string
      category: string[]
      description: string
      form: string
      patronOf?: string[]
    }[]
    officeOfReadings: {
      secondReading: {
        author: string
        work: string
        text: string
      }
    }
  }
  readings: {
    firstReading: { reference: string; text: string; usccbLink?: string }
    psalm: { reference: string; text: string; antiphon: string }
    secondReading?: { reference: string; text: string } | null
    gospel: { reference: string; text: string; usccbLink?: string }
  }
  servusSynthesis: {
    theme: string
    body: string
    connections: { discipline: string; note: string }[]
  }
}

export function MobileDailyWrapper({ day }: { day: DayData }) {
  const [servusOpen, setServusOpen] = useState(false)

  const formatted = new Date(
    day.date + 'T12:00:00'
  ).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const servusContext = {
    gospel: {
      reference: day.readings.gospel.reference,
      text: day.readings.gospel.text,
    },
    firstReading: {
      reference: day.readings.firstReading.reference,
    },
    efSaint: day.ef.saints[0]?.name,
    ofSaint: day.of.saints[0]?.name,
    synthesis: day.servusSynthesis.theme,
  }

  return (
    <>
      {/* ====================================================
          MOBILE LAYOUT — shown only on screens < 768px
          via CSS .mobile-only class
          ==================================================== */}
      <div
        className="mobile-only"
        style={{
          flexDirection: 'column',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
        }}
      >
        <MobileDailyView
          day={day}
          onOpenServus={() => setServusOpen(true)}
        />
        <BottomTabBar />

        {/* Servus full-screen overlay on mobile */}
        {servusOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              backgroundColor: 'var(--theme-bg)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--theme-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-sanctum-black)',
              }}
            >
              <span style={{ color: 'var(--color-sacred-gold)', fontSize: '14px' }}>✦</span>
              <span
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  color: 'var(--color-sacred-gold)',
                  flex: 1,
                }}
              >
                SERVUS
              </span>
              <button
                onClick={() => setServusOpen(false)}
                style={{
                  background: 'none',
                  border: '0.5px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ServusPanel context={servusContext} />
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          DESKTOP LAYOUT — shown only on screens >= 768px
          via CSS .desktop-only class
          ==================================================== */}
      <div
        className="desktop-only"
        style={{
          flexDirection: 'row',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Sidebar */}
        <div style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* Date bar */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              backgroundColor: 'var(--theme-bg-secondary, #DFD09A)',
              borderBottom: '0.5px solid var(--theme-border)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--theme-text)' }}>
              {formatted}
            </span>
            <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--theme-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: VESTMENT_HEX[day.vestmentColour] ?? '#2E6B2E' }} />
              <span style={{ fontSize: '10px', textTransform: 'capitalize', color: 'var(--theme-text-2)' }}>{day.vestmentColour}</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-apologetics)' }}>
              {day.season} · Week {day.weekNumber} · Psalter {day.psalterWeek}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--theme-text-3)' }}>Hours</span>
              {['Readings', 'Lauds', 'Daytime', 'Vespers', 'Compline'].map((h, i) => (
                <div key={h} title={h} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i < 2 ? 'var(--color-sacred-gold)' : 'var(--theme-border)', cursor: 'pointer' }} />
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="section-label">Mass Readings</p>
                <span style={{ fontSize: '9px', color: 'var(--theme-text-3)' }}>Douay-Rheims</span>
              </div>

              <div className="mf-card" style={{ padding: '16px' }}>
                <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sacred-gold)', marginBottom: '4px' }}>First Reading</p>
                <p style={{ fontSize: '11px', color: 'var(--theme-text-3)', marginBottom: '10px' }}>{day.readings.firstReading.reference}</p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '16px', lineHeight: 1.7, color: 'var(--theme-text)' }}>{day.readings.firstReading.text}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {['Note ↗', 'Ask Servus', 'Flashcard'].map(action => (
                    <button key={action} style={{ fontSize: '10px', fontWeight: 500, padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'rgba(184,135,42,0.08)', color: 'var(--color-sacred-gold)', border: '0.5px solid rgba(184,135,42,0.3)' }}>{action}</button>
                  ))}
                </div>
              </div>

              <div className="mf-card" style={{ padding: '16px' }}>
                <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sacred-gold)', marginBottom: '4px' }}>Responsorial Psalm</p>
                <p style={{ fontSize: '11px', color: 'var(--theme-text-3)', marginBottom: '10px' }}>{day.readings.psalm.reference}</p>
                {day.readings.psalm.antiphon && (
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '14px', fontStyle: 'italic', color: 'var(--color-sacred-gold)', borderLeft: '2px solid var(--color-sacred-gold)', padding: '6px 12px', marginBottom: '10px', backgroundColor: 'rgba(184,135,42,0.05)', borderRadius: '0 6px 6px 0' }}>
                    <span style={{ fontWeight: 600 }}>℟.</span> {day.readings.psalm.antiphon}
                  </p>
                )}
                <p className="section-label" style={{ marginBottom: '6px' }}>Psalm verses</p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '16px', lineHeight: 1.7, color: 'var(--theme-text)' }}>{day.readings.psalm.text}</p>
              </div>

              {day.readings.secondReading && (
                <div className="mf-card" style={{ padding: '16px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sacred-gold)', marginBottom: '4px' }}>Second Reading</p>
                  <p style={{ fontSize: '11px', color: 'var(--theme-text-3)', marginBottom: '10px' }}>{day.readings.secondReading.reference}</p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '16px', lineHeight: 1.7, color: 'var(--theme-text)' }}>{day.readings.secondReading.text}</p>
                </div>
              )}

              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(122,31,46,0.04)', border: '0.5px solid rgba(122,31,46,0.15)', borderLeft: '3px solid var(--color-apologetics)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-apologetics)' }}>✦ Holy Gospel</p>
                  <span style={{ fontSize: '9px', color: 'var(--theme-text-3)', marginLeft: 'auto' }}>Douay-Rheims</span>
                </div>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '13px', fontStyle: 'italic', color: 'var(--color-apologetics)', marginBottom: '10px' }}>{day.readings.gospel.reference}</p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '16px', lineHeight: 1.7, color: 'var(--theme-text)' }}>{day.readings.gospel.text}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {['Note ↗', 'Ask Servus', 'Lectio Divina'].map(action => (
                    <button key={action} style={{ fontSize: '10px', fontWeight: 500, padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'rgba(122,31,46,0.06)', color: 'var(--color-apologetics)', border: '0.5px solid rgba(122,31,46,0.2)' }}>{action}</button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height: '0.5px', backgroundColor: 'var(--theme-border)', margin: '0 20px' }} />
            <FormTabs ef={day.ef} of={day.of} />

            <div style={{ padding: '0 20px 20px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>✦ Servus · Today&apos;s Meditation Arc</p>
              <div className="mf-card" style={{ padding: '16px', borderLeft: '3px solid var(--color-sacred-gold)', backgroundColor: 'rgba(184,135,42,0.03)' }}>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 500, color: 'var(--theme-text)', marginBottom: '12px' }}>{day.servusSynthesis.theme}</p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', lineHeight: 1.75, color: 'var(--theme-text-2)', marginBottom: '16px' }}>{day.servusSynthesis.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {day.servusSynthesis.connections.map((c: { discipline: string; note: string }) => (
                    <div key={c.discipline} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span className={`chip-${c.discipline.toLowerCase()}`} style={{ fontSize: '9px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>{c.discipline}</span>
                      <span style={{ fontSize: '12px', color: 'var(--theme-text-2)' }}>{c.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Servus panel */}
        <ServusPanel context={servusContext} />
      </div>
    </>
  )
}