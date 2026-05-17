// ================================================================
// MYSTERIUM FIDEI — Daily Sacred Page
// ================================================================

import type { Metadata } from 'next'
import { Sidebar } from '@/components/daily/Sidebar'

export const metadata: Metadata = {
  title: 'Daily Sacred',
}

async function getDailyData() {
  const res = await fetch('http://localhost:3000/api/daily', {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error('Failed to fetch daily data')
  const json = await res.json()
  return json.data
}

export default async function DailyPage() {
  const day = await getDailyData()

  const formatted = new Date(
    day.date + 'T12:00:00'
  ).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const vestmentHex: Record<string, string> = {
    green:  '#2E6B2E',
    purple: '#4B2E6B',
    white:  '#C8C0A8',
    red:    '#8B1A1A',
    rose:   '#C47C8A',
    black:  '#1C1610',
    gold:   '#B8872A',
  }

  return (
    // ---- Outer shell: full viewport minus topbar (56px) ------
    // flex-row: sidebar on left, main content on right
    // overflow-hidden: prevents double scrollbars
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        width: '100%',
      }}
    >

      {/* ---- Sidebar (fixed width, full height, own scroll) -- */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* ---- Main content (fills remaining width) ------------ */}
      {/* flex-col: date bar on top, scrollable content below   */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0, // prevents flex child from overflowing
        }}
      >

        {/* ---- Date bar (fixed, never scrolls) -------------- */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            backgroundColor: 'var(--theme-bg-secondary, white)',
            borderBottom: '0.5px solid var(--theme-border)',
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

          <div
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: 'var(--theme-border)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: vestmentHex[day.vestmentColour] ?? '#2E6B2E',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                textTransform: 'capitalize',
                color: 'var(--theme-text-2)',
              }}
            >
              {day.vestmentColour}
            </span>
          </div>

          <span
            style={{
              fontSize: '10px',
              color: 'var(--color-apologetics)',
            }}
          >
            {day.season} · Week {day.weekNumber} · Psalter {day.psalterWeek}
          </span>

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--theme-text-3)',
              }}
            >
              Hours
            </span>
            {['Readings', 'Lauds', 'Daytime', 'Vespers', 'Compline'].map(
              (h, i) => (
                <div
                  key={h}
                  title={h}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                      i < 2
                        ? 'var(--color-sacred-gold)'
                        : 'var(--theme-border)',
                    cursor: 'pointer',
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* ---- EF / OF tabs (fixed, never scrolls) ---------- */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            borderBottom: '0.5px solid var(--theme-border)',
          }}
        >
          {[
            {
              label: 'Extraordinary Form',
              sub: 'pre-1962',
              colour: '#3C3489',
              bg: 'rgba(60,52,137,0.06)',
              active: true,
            },
            {
              label: 'Ordinary Form',
              sub: 'post-1970',
              colour: '#0F6E56',
              bg: 'transparent',
              active: false,
            },
          ].map(form => (
            <div
              key={form.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: form.active ? form.bg : 'transparent',
                borderBottom: form.active
                  ? `2px solid ${form.colour}`
                  : '2px solid transparent',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: form.colour,
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: form.colour,
                }}
              >
                {form.label}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  color: 'var(--theme-text-3)',
                }}
              >
                {form.sub}
              </span>
            </div>
          ))}
        </div>

        {/* ---- Scrollable content area --------------------- */}
        {/* This is the ONLY part that scrolls                 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >

          {/* ---- Mass Readings ----------------------------- */}
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <p className="section-label">Mass Readings</p>
              <span style={{ fontSize: '9px', color: 'var(--theme-text-3)' }}>
                Douay-Rheims
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* First Reading */}
              <div
                className="mf-card"
                style={{ padding: '16px' }}
              >
                <p
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sacred-gold)',
                    marginBottom: '4px',
                  }}
                >
                  First Reading
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--theme-text-3)',
                    marginBottom: '10px',
                  }}
                >
                  {day.readings.firstReading.reference}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: 'var(--theme-text)',
                  }}
                >
                  {day.readings.firstReading.text}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                  }}
                >
                  {['Note ↗', 'Ask Servus', 'Flashcard'].map(action => (
                    <button
                      key={action}
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '4px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(184,135,42,0.08)',
                        color: 'var(--color-sacred-gold)',
                        border: '0.5px solid rgba(184,135,42,0.3)',
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Psalm */}
              <div className="mf-card" style={{ padding: '16px' }}>
                <p
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sacred-gold)',
                    marginBottom: '4px',
                  }}
                >
                  Responsorial Psalm
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--theme-text-3)',
                    marginBottom: '10px',
                  }}
                >
                  {day.readings.psalm.reference}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: 'var(--color-sacred-gold)',
                    borderLeft: '2px solid var(--color-sacred-gold)',
                    paddingLeft: '12px',
                    marginBottom: '10px',
                    backgroundColor: 'rgba(184,135,42,0.05)',
                    borderRadius: '0 6px 6px 0',
                    padding: '6px 12px',
                  }}
                >
                  ℟. {day.readings.psalm.antiphon}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: 'var(--theme-text)',
                  }}
                >
                  {day.readings.psalm.text}
                </p>
              </div>

              {/* Gospel */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(122,31,46,0.04)',
                  border: '0.5px solid rgba(122,31,46,0.15)',
                  borderLeft: '3px solid var(--color-apologetics)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '9px',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-apologetics)',
                    }}
                  >
                    ✦ Holy Gospel
                  </p>
                  <span
                    style={{
                      fontSize: '9px',
                      color: 'var(--theme-text-3)',
                      marginLeft: 'auto',
                    }}
                  >
                    Douay-Rheims
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: 'var(--color-apologetics)',
                    marginBottom: '10px',
                  }}
                >
                  {day.readings.gospel.reference}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: 'var(--theme-text)',
                  }}
                >
                  {day.readings.gospel.text}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {['Note ↗', 'Ask Servus', 'Lectio Divina'].map(action => (
                    <button
                      key={action}
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '4px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(122,31,46,0.06)',
                        color: 'var(--color-apologetics)',
                        border: '0.5px solid rgba(122,31,46,0.2)',
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ---- Saints of the Day -------------------------- */}
          <section>
            <p className="section-label" style={{ marginBottom: '12px' }}>
              Saints of the Day
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {/* EF Saints */}
              {day.ef.saints.map((saint: {
                id: string
                name: string
                rank: string
                category: string[]
                description: string
              }) => (
                <div
                  key={saint.id}
                  className="mf-card"
                  style={{ padding: '16px', cursor: 'pointer' }}
                >
                  <p
                    style={{
                      fontSize: '8px',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ef-indigo)',
                      marginBottom: '6px',
                    }}
                  >
                    ✦ Extraordinary Form
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--theme-text)',
                      marginBottom: '2px',
                    }}
                  >
                    {saint.name}
                  </p>
                  <p
                    style={{
                      fontSize: '10px',
                      color: 'var(--theme-text-3)',
                      marginBottom: '8px',
                    }}
                  >
                    {saint.rank}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      lineHeight: 1.55,
                      color: 'var(--theme-text-2)',
                      marginBottom: '10px',
                    }}
                  >
                    {saint.description}
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {saint.category.map((cat: string) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '9px',
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          backgroundColor: 'var(--color-ef-indigo-lt)',
                          color: 'var(--color-ef-indigo)',
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* OF Saints */}
              {day.of.saints.map((saint: {
                id: string
                name: string
                rank: string
                category: string[]
                description: string
              }) => (
                <div
                  key={saint.id}
                  className="mf-card"
                  style={{ padding: '16px', cursor: 'pointer' }}
                >
                  <p
                    style={{
                      fontSize: '8px',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-of-teal)',
                      marginBottom: '6px',
                    }}
                  >
                    ✦ Ordinary Form
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--theme-text)',
                      marginBottom: '2px',
                    }}
                  >
                    {saint.name}
                  </p>
                  <p
                    style={{
                      fontSize: '10px',
                      color: 'var(--theme-text-3)',
                      marginBottom: '8px',
                    }}
                  >
                    {saint.rank}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      lineHeight: 1.55,
                      color: 'var(--theme-text-2)',
                      marginBottom: '10px',
                    }}
                  >
                    {saint.description}
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {saint.category.map((cat: string) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '9px',
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          backgroundColor: 'var(--color-of-teal-lt)',
                          color: 'var(--color-of-teal)',
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---- Office of Readings (EF) --------------------- */}
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

          {/* ---- Servus Synthesis ---------------------------- */}
          <section>
            <p className="section-label" style={{ marginBottom: '12px' }}>
              ✦ Servus · Today&apos;s Meditation Arc
            </p>
            <div
              className="mf-card"
              style={{
                padding: '16px',
                borderLeft: '3px solid var(--color-sacred-gold)',
                backgroundColor: 'rgba(184,135,42,0.03)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'var(--theme-text)',
                  marginBottom: '12px',
                }}
              >
                {day.servusSynthesis.theme}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '15px',
                  lineHeight: 1.75,
                  color: 'var(--theme-text-2)',
                  marginBottom: '16px',
                }}
              >
                {day.servusSynthesis.body}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {day.servusSynthesis.connections.map(
                  (c: { discipline: string; note: string }) => (
                    <div
                      key={c.discipline}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                    >
                      <span
                        className={`chip-${c.discipline.toLowerCase()}`}
                        style={{
                          fontSize: '9px',
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          flexShrink: 0,
                        }}
                      >
                        {c.discipline}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--theme-text-2)',
                        }}
                      >
                        {c.note}
                      </span>
                    </div>
                  )
                )}
              </div>
              <p
                style={{
                  fontSize: '9px',
                  color: 'var(--theme-text-3)',
                  marginTop: '12px',
                }}
              >
                Generated from: Douay-Rheims Gospel · EF Office of Readings ·
                Saints of the day
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}