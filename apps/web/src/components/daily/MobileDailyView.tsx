// ================================================================
// MYSTERIUM FIDEI — Mobile Daily Sacred View
// ================================================================
// Single column layout for iPhone.
// Shows the same data as the desktop view but:
// - No sidebar (replaced by bottom tab bar)
// - No Servus side panel (replaced by floating button → sheet)
// - Cards stack vertically and scroll
// - Readings are collapsible to save space
// ================================================================

'use client'

import { useState } from 'react'

interface MobileDailyViewProps {
  day: {
    date: string
    season: string
    celebration: string
    liturgicalNote?: string
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
      }[]
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
  onOpenServus: () => void
}

const VESTMENT_HEX: Record<string, string> = {
  green: '#2E6B2E', purple: '#4B2E6B', white: '#C8C0A8',
  red: '#8B1A1A', rose: '#C47C8A', black: '#1C1610', gold: '#B8872A',
}

// Collapsible reading card
function ReadingCard({
  label,
  reference,
  text,
  antiphon,
  isGospel,
  colour,
  usccbLink,
}: {
  label: string
  reference: string
  text: string
  antiphon?: string
  isGospel?: boolean
  colour?: string
  usccbLink?: string
}) {
  const [expanded, setExpanded] = useState(label === '✦ Holy Gospel')

  return (
    <div
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: isGospel
          ? '0.5px solid rgba(122,31,46,0.2)'
          : '0.5px solid var(--theme-border)',
        borderLeft: isGospel
          ? '3px solid var(--color-apologetics)'
          : '3px solid var(--color-sacred-gold)',
        backgroundColor: isGospel
          ? 'rgba(122,31,46,0.03)'
          : 'var(--theme-card)',
      }}
    >
      {/* Header — tap to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isGospel
                ? 'var(--color-apologetics)'
                : 'var(--color-sacred-gold)',
              marginBottom: '2px',
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '14px',
              fontStyle: 'italic',
              color: isGospel
                ? 'var(--color-apologetics)'
                : 'var(--theme-text-2)',
            }}
          >
            {reference}
          </p>
        </div>
        <span
          style={{
            color: 'var(--theme-text-3)',
            fontSize: '16px',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 14px 14px' }}>
          {antiphon && (
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '14px',
                fontStyle: 'italic',
                color: 'var(--color-sacred-gold)',
                borderLeft: '2px solid var(--color-sacred-gold)',
                padding: '6px 10px',
                backgroundColor: 'rgba(184,135,42,0.05)',
                borderRadius: '0 6px 6px 0',
                marginBottom: '10px',
              }}
            >
              ℟. {antiphon}
            </p>
          )}
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '16px',
              lineHeight: 1.75,
              color: 'var(--theme-text)',
            }}
          >
            {text}
          </p>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {['Note ↗', 'Ask Servus', isGospel ? 'Lectio Divina' : 'Flashcard'].map(
              action => (
                <button
                  key={action}
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isGospel
                      ? 'rgba(122,31,46,0.08)'
                      : 'rgba(184,135,42,0.08)',
                    color: isGospel
                      ? 'var(--color-apologetics)'
                      : 'var(--color-sacred-gold)',
                    border: isGospel
                      ? '0.5px solid rgba(122,31,46,0.2)'
                      : '0.5px solid rgba(184,135,42,0.3)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {action}
                </button>
              )
            )}
            {usccbLink && (
              <a
                href={usccbLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--theme-text-3)',
                  border: '0.5px solid var(--theme-border)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                USCCB ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function MobileDailyView({ day, onOpenServus }: MobileDailyViewProps) {
  const [activeForm, setActiveForm] = useState<'EF' | 'OF'>('EF')

  const formatted = new Date(
    day.date + 'T12:00:00'
  ).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '88px', // space for bottom tab bar
      }}
    >

      {/* ---- Date bar ------------------------------------ */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: 'var(--theme-bg-secondary)',
          borderBottom: '0.5px solid var(--theme-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'var(--theme-text)',
          }}
        >
          {formatted}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: VESTMENT_HEX[day.vestmentColour] ?? '#2E6B2E',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--theme-text-2)', textTransform: 'capitalize' }}>
            {day.vestmentColour}
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--color-apologetics)' }}>
          {day.season}
        </span>
        {day.liturgicalNote && (
          <span style={{ fontSize: '9px', color: 'var(--theme-text-3)', fontStyle: 'italic' }}>
            {day.liturgicalNote}
          </span>
        )}
      </div>

      {/* ---- Celebration banner -------------------------- */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(184,135,42,0.05)',
          borderBottom: '0.5px solid var(--theme-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--theme-text)',
            marginBottom: '2px',
          }}
        >
          {day.celebration}
        </p>
        {day.liturgicalNote && (
          <p style={{ fontSize: '10px', color: 'var(--color-sacred-gold)', fontStyle: 'italic' }}>
            {day.liturgicalNote}
          </p>
        )}
      </div>

      {/* ---- EF / OF tabs -------------------------------- */}
      <div
        style={{
          display: 'flex',
          borderBottom: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-card)',
        }}
      >
        {[
          { id: 'EF', label: 'Extraordinary Form', colour: '#3C3489' },
          { id: 'OF', label: 'Ordinary Form', colour: '#0F6E56' },
        ].map(form => (
          <button
            key={form.id}
            onClick={() => setActiveForm(form.id as 'EF' | 'OF')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderBottom: activeForm === form.id
                ? `2px solid ${form.colour}`
                : '2px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: activeForm === form.id ? 500 : 400,
              color: activeForm === form.id ? form.colour : 'var(--theme-text-3)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {form.label}
          </button>
        ))}
      </div>

      {/* ---- Main scrollable content --------------------- */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Mass Readings section header */}
        <p className="section-label">Mass Readings</p>

        {/* First Reading */}
        <ReadingCard
          label="First Reading"
          reference={day.readings.firstReading.reference}
          text={day.readings.firstReading.text}
          usccbLink={day.readings.firstReading.usccbLink}
        />

        {/* Psalm */}
        <ReadingCard
          label="Responsorial Psalm"
          reference={day.readings.psalm.reference}
          text={day.readings.psalm.text}
          antiphon={day.readings.psalm.antiphon}
        />

        {/* Second reading (Sundays) */}
        {day.readings.secondReading && (
          <ReadingCard
            label="Second Reading"
            reference={day.readings.secondReading.reference}
            text={day.readings.secondReading.text}
          />
        )}

        {/* Gospel */}
        <ReadingCard
          label="✦ Holy Gospel"
          reference={day.readings.gospel.reference}
          text={day.readings.gospel.text}
          isGospel
          usccbLink={day.readings.gospel.usccbLink}
        />

        {/* Saints section */}
        <p className="section-label" style={{ marginTop: '8px' }}>
          Saints of the Day ·{' '}
          {activeForm === 'EF' ? 'Extraordinary Form' : 'Ordinary Form'}
        </p>

        {(activeForm === 'EF' ? day.ef.saints : day.of.saints).map(saint => (
          <div
            key={saint.id}
            className="mf-card"
            style={{
              padding: '14px',
              borderLeft: `3px solid ${activeForm === 'EF' ? '#3C3489' : '#0F6E56'}`,
            }}
          >
            <p
              style={{
                fontSize: '8px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeForm === 'EF' ? '#3C3489' : '#0F6E56',
                marginBottom: '4px',
              }}
            >
              ✦ {activeForm === 'EF' ? 'Extraordinary Form' : 'Ordinary Form'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--theme-text)',
                marginBottom: '2px',
              }}
            >
              {saint.name}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--theme-text-3)', marginBottom: '8px' }}>
              {saint.rank}
            </p>
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--theme-text-2)' }}>
              {saint.description}
            </p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
              {saint.category.map(cat => (
                <span
                  key={cat}
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: activeForm === 'EF'
                      ? 'var(--color-ef-indigo-lt)'
                      : 'var(--color-of-teal-lt)',
                    color: activeForm === 'EF'
                      ? 'var(--color-ef-indigo)'
                      : 'var(--color-of-teal)',
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* EF Office of Readings */}
        {activeForm === 'EF' && (
          <>
            <p className="section-label" style={{ marginTop: '8px' }}>
              Office of Readings · EF
            </p>
            <div
              className="mf-card"
              style={{
                padding: '14px',
                borderLeft: '3px solid var(--color-ef-indigo)',
              }}
            >
              <p
                style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ef-indigo)',
                  marginBottom: '4px',
                }}
              >
                Second Reading
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--theme-text-2)',
                  marginBottom: '10px',
                }}
              >
                {day.ef.officeOfReadings.secondReading.author} —{' '}
                {day.ef.officeOfReadings.secondReading.work}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: 'var(--theme-text)',
                }}
              >
                {day.ef.officeOfReadings.secondReading.text}
              </p>
            </div>
          </>
        )}

        {/* Servus synthesis */}
        <p className="section-label" style={{ marginTop: '8px' }}>
          ✦ Servus · Today&apos;s Meditation Arc
        </p>
        <div
          className="mf-card"
          style={{
            padding: '14px',
            borderLeft: '3px solid var(--color-sacred-gold)',
            backgroundColor: 'rgba(184,135,42,0.03)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '17px',
              fontWeight: 600,
              color: 'var(--theme-text)',
              marginBottom: '10px',
            }}
          >
            {day.servusSynthesis.theme}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-cormoran',
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--theme-text-2)',
              marginBottom: '12px',
            }}
          >
            {day.servusSynthesis.body}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {day.servusSynthesis.connections.map(c => (
              <div key={c.discipline} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span
                  className={`chip-${c.discipline.toLowerCase()}`}
                  style={{ fontSize: '9px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}
                >
                  {c.discipline}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--theme-text-2)' }}>
                  {c.note}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}