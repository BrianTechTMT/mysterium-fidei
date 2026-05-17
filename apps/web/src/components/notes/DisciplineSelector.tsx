// ================================================================
// MYSTERIUM FIDEI — Discipline Selector
// ================================================================
// Shown at the top of every new note.
// The user picks which of the five disciplines this note belongs to.
// The selection drives the colour theme of the entire note.
// ================================================================

'use client'

const DISCIPLINES = [
  {
    id: 'Philosophy',
    colour: '#7A4A10',
    bg: '#FDF0DC',
    description: 'Metaphysics, logic, natural theology, Aquinas',
    icon: '⚖',
  },
  {
    id: 'Apologetics',
    colour: '#7A1F2E',
    bg: '#F5E8EA',
    description: 'Defence of the Faith, contra errors, dialogue',
    icon: '✝',
  },
  {
    id: 'Bible',
    colour: '#0F6E56',
    bg: '#E1F5EE',
    description: 'Scripture study, exegesis, Douay-Rheims',
    icon: '📖',
  },
  {
    id: 'Theology',
    colour: '#2B3B6B',
    bg: '#E8EBF6',
    description: 'Dogma, doctrine, sacraments, ecclesiology',
    icon: '✦',
  },
  {
    id: 'Spirituality',
    colour: '#3D5C3A',
    bg: '#E8F2E7',
    description: 'Prayer, mysticism, spiritual direction, saints',
    icon: '🕯',
  },
]

interface DisciplineSelectorProps {
  selected: string
  onChange: (discipline: string) => void
}

export function DisciplineSelector({
  selected,
  onChange,
}: DisciplineSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p
        style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--theme-text-3)',
          marginBottom: '4px',
        }}
      >
        Discipline
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
        }}
      >
        {DISCIPLINES.map(disc => {
          const isSelected = selected === disc.id
          return (
            <button
              key={disc.id}
              onClick={() => onChange(disc.id)}
              style={{
                padding: '10px 8px',
                borderRadius: '10px',
                border: isSelected
                  ? `2px solid ${disc.colour}`
                  : '1.5px solid var(--theme-border)',
                backgroundColor: isSelected ? disc.bg : 'var(--theme-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: '18px' }}>{disc.icon}</span>

              {/* Discipline name */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isSelected ? disc.colour : 'var(--theme-text)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {disc.id}
              </span>

              {/* Description */}
              <span
                style={{
                  fontSize: '9px',
                  color: isSelected ? disc.colour : 'var(--theme-text-3)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {disc.description}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: disc.colour,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}