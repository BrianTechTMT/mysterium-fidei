// ================================================================
// MYSTERIUM FIDEI — EF/OF Form Tabs
// ================================================================
// 'use client' because tabs need onClick interactivity.
// The parent page.tsx is a Server Component — it fetches data
// and passes it down as props. This component just handles
// which form is currently active and renders the right content.
// ================================================================

'use client'

import { useState } from 'react'

// ---- Types ----------------------------------------------------
// We define these inline rather than importing from shared
// because this is a UI component — it only needs what it renders.

interface Saint {
  id: string
  name: string
  rank: string
  category: string[]
  description: string
  form: string
}

interface OfficeReading {
  author: string
  work: string
  text: string
}

interface EFData {
  celebration: string
  rank: string
  saints: Saint[]
  officeOfReadings: {
    secondReading: OfficeReading
  }
}

interface OFData {
  celebration: string
  rank: string
  saints: Saint[]
  officeUrl: string
}

interface FormTabsProps {
  ef: EFData
  of: OFData
}

// ---- Component ------------------------------------------------

export function FormTabs({ ef, of }: FormTabsProps) {
  // activeForm controls which tab is shown.
  // Default to EF — the Extraordinary Form is our primary content.
  const [activeForm, setActiveForm] = useState<'EF' | 'OF'>('EF')

  const forms = [
    {
      id: 'EF' as const,
      label: 'Extraordinary Form',
      sub: 'pre-1962',
      colour: '#3C3489',
      bg: 'rgba(60,52,137,0.06)',
    },
    {
      id: 'OF' as const,
      label: 'Ordinary Form',
      sub: 'post-1970',
      colour: '#0F6E56',
      bg: 'rgba(15,110,86,0.06)',
    },
  ]

  // The active form's data
  const activeData = activeForm === 'EF' ? ef : of
  const activeColour = activeForm === 'EF' ? '#3C3489' : '#0F6E56'
  const activeBgVar = activeForm === 'EF'
    ? 'var(--color-ef-indigo-lt)'
    : 'var(--color-of-teal-lt)'

  return (
    <div>

      {/* ---- Tab bar ---------------------------------------- */}
      <div
        style={{
          display: 'flex',
          borderBottom: '0.5px solid var(--theme-border)',
          flexShrink: 0,
        }}
      >
        {forms.map(form => {
          const isActive = activeForm === form.id
          return (
            <button
              key={form.id}
              onClick={() => setActiveForm(form.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: isActive ? form.bg : 'transparent',
                borderBottom: isActive
                  ? `2px solid ${form.colour}`
                  : '2px solid transparent',
                border: 'none',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: form.colour,
                  // Active tab dot pulses slightly
                  boxShadow: isActive
                    ? `0 0 0 2px ${form.colour}30`
                    : 'none',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: isActive ? form.colour : 'var(--theme-text-3)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'color 0.15s ease',
                }}
              >
                {form.label}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  color: isActive ? form.colour + '80' : 'var(--theme-text-3)',
                  transition: 'color 0.15s ease',
                }}
              >
                {form.sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* ---- Active form celebration banner ----------------- */}
      {/* ---- EF Mass propers notice ------------------------- */}
      {activeForm === 'EF' && (
        <div
          style={{
            margin: '12px 20px 0',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(60,52,137,0.06)',
            border: '0.5px solid rgba(60,52,137,0.2)',
            borderLeft: '3px solid var(--color-ef-indigo)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '14px', flexShrink: 0 }}>📋</span>
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--color-ef-indigo)',
                marginBottom: '3px',
                letterSpacing: '0.05em',
              }}
            >
              Extraordinary Form — Mass Propers
            </p>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--theme-text-2)',
                lineHeight: 1.55,
              }}
            >
              The EF Mass proper texts — Introit, Gradual, Alleluia, Tract,
              Offertory, and Communion antiphons — differ from the Ordinary
              Form and are sourced from the{' '}
              <em>Missale Romanum</em> (1962). Full EF Mass propers via
              Divinum Officium are coming in Phase 4. The readings shown
              above reflect the OF Lectionary.
            </p>
            <p
              style={{
                fontSize: '10px',
                color: 'var(--theme-text-3)',
                marginTop: '5px',
                fontStyle: 'italic',
              }}
            >
              Phase 4: Divinum Officium Docker → EF Introit · Gradual ·
              Alleluia · Tract · Offertory · Communion
            </p>
          </div>
        </div>
      )}
      {/* Shows the name of today's celebration in the active form */}
      <div
        style={{
          padding: '8px 20px',
          backgroundColor: activeForm === 'EF'
            ? 'rgba(60,52,137,0.04)'
            : 'rgba(15,110,86,0.04)',
          borderBottom: '0.5px solid var(--theme-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: activeColour,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: activeColour,
          }}
        >
          {activeData.celebration}
        </span>
        <span
          style={{
            fontSize: '9px',
            color: 'var(--theme-text-3)',
            marginLeft: '4px',
          }}
        >
          · {activeData.rank}
        </span>
      </div>

      {/* ---- Saints of the active form --------------------- */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <section>
          <p className="section-label" style={{ marginBottom: '12px' }}>
            Saints of the Day ·{' '}
            {activeForm === 'EF' ? 'Extraordinary Form' : 'Ordinary Form'}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
            }}
          >
            {activeData.saints.map(saint => (
              <div
                key={saint.id}
                className="mf-card"
                style={{ padding: '16px', cursor: 'pointer' }}
              >
                {/* Form label */}
                <p
                  style={{
                    fontSize: '8px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: activeColour,
                    marginBottom: '6px',
                  }}
                >
                  ✦ {activeForm === 'EF'
                    ? 'Extraordinary Form'
                    : 'Ordinary Form'}
                </p>

                {/* Saint name */}
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--theme-text)',
                    marginBottom: '2px',
                    lineHeight: 1.2,
                  }}
                >
                  {saint.name}
                </p>

                {/* Rank */}
                <p
                  style={{
                    fontSize: '10px',
                    color: 'var(--theme-text-3)',
                    marginBottom: '10px',
                  }}
                >
                  {saint.rank}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: 'var(--theme-text-2)',
                    marginBottom: '12px',
                  }}
                >
                  {saint.description}
                </p>

                {/* Category tags */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {saint.category.map(cat => (
                    <span
                      key={cat}
                      style={{
                        fontSize: '9px',
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: activeBgVar,
                        color: activeColour,
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Study button */}
                <button
                  style={{
                    marginTop: '12px',
                    fontSize: '10px',
                    fontWeight: 500,
                    padding: '5px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: activeForm === 'EF'
                      ? 'rgba(60,52,137,0.08)'
                      : 'rgba(15,110,86,0.08)',
                    color: activeColour,
                    border: `0.5px solid ${activeColour}30`,
                    width: '100%',
                  }}
                >
                  Study {saint.name.split(' ').pop()} ↗
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ---- EF: Office of Readings ---------------------- */}
        {activeForm === 'EF' && (
          <section>
            <p className="section-label" style={{ marginBottom: '12px' }}>
              Office of Readings · Extraordinary Form
            </p>
            <div
              className="mf-card"
              style={{
                padding: '16px',
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
                  marginBottom: '12px',
                }}
              >
                {ef.officeOfReadings.secondReading.author} —{' '}
                {ef.officeOfReadings.secondReading.work}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: 'var(--theme-text)',
                }}
              >
                {ef.officeOfReadings.secondReading.text}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {['Note ↗', 'Ask Servus'].map(action => (
                  <button
                    key={action}
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(60,52,137,0.06)',
                      color: 'var(--color-ef-indigo)',
                      border: '0.5px solid rgba(60,52,137,0.2)',
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- OF: Link to Divine Office ------------------- */}
        {activeForm === 'OF' && (
          <section>
            <p className="section-label" style={{ marginBottom: '12px' }}>
              Liturgy of the Hours · Ordinary Form
            </p>
            <div
              className="mf-card"
              style={{
                padding: '16px',
                borderLeft: '3px solid var(--color-of-teal)',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--theme-text-2)',
                  marginBottom: '12px',
                  lineHeight: 1.6,
                }}
              >
                The post-1970 Liturgy of the Hours text is under ICEL
                copyright. Mysterium Fidei links directly to the
                authorised source.
              </p>
                <a
                href={of.officeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(15,110,86,0.08)',
                  color: 'var(--color-of-teal)',
                  border: '0.5px solid rgba(15,110,86,0.25)',
                  textDecoration: 'none',
                }}
              >
                Open divineoffice.org ↗
              </a>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}