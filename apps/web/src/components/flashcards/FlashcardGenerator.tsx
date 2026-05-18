// ================================================================
// MYSTERIUM FIDEI — Flashcard Generator
// ================================================================
// A panel that generates AI flashcards from note content.
// Shows a preview of generated cards before saving them.
// ================================================================

'use client'

import { useState } from 'react'
import { saveCards } from '@/lib/flashcardStorage'

interface GeneratedCard {
  question: string
  answer: string
  discipline: string
  source: string
}

interface FlashcardGeneratorProps {
  noteText: string
  noteTitle: string
  discipline: string
  onClose: () => void
  onSaved: (count: number) => void
}

export function FlashcardGenerator({
  noteText,
  noteTitle,
  discipline,
  onClose,
  onSaved,
}: FlashcardGeneratorProps) {
  const [cards, setCards] = useState<GeneratedCard[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const colour = {
    Philosophy:   '#7A4A10',
    Apologetics:  '#7A1F2E',
    Bible:        '#0F6E56',
    Theology:     '#2B3B6B',
    Spirituality: '#3D5C3A',
  }[discipline] ?? '#B8872A'

  const generate = async () => {
    if (!noteText.trim()) return
    setLoading(true)
    setCards([])
    setSaved(false)

    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: noteText.slice(0, 3000),
          discipline,
          source: noteTitle,
          count: 5,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCards(data.data)
        // Select all by default
        setSelected(new Set(data.data.map((_: GeneratedCard, i: number) => i)))
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  const toggleCard = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const handleSave = () => {
    const toSave = cards.filter((_, i) => selected.has(i))
    saveCards(toSave)
    setSaved(true)
    onSaved(toSave.length)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(28,22,16,0.4)',
      }}
    >
      <div
        style={{
          width: '560px',
          maxHeight: '80vh',
          borderRadius: '16px',
          backgroundColor: 'var(--theme-card)',
          border: '0.5px solid var(--theme-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(28,22,16,0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '0.5px solid var(--theme-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ color: colour, fontSize: '16px' }}>🃏</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                color: 'var(--theme-text)',
                marginBottom: '2px',
              }}
            >
              GENERATE FLASHCARDS
            </p>
            <p style={{ fontSize: '10px', color: 'var(--theme-text-3)', fontFamily: 'var(--font-sans)' }}>
              Servus will generate cards from your {discipline} note
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '0.5px solid var(--theme-border)',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: 'var(--theme-text-3)',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cards.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '16px',
                  color: 'var(--theme-text-2)',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                }}
              >
                Servus will read your note and generate<br />
                theological flashcards automatically.
              </p>
              <button
                onClick={generate}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  backgroundColor: colour,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ✦ Generate with Servus
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: 'var(--theme-text-3)',
                }}
              >
                Servus is reading your note…
              </p>
            </div>
          )}

          {cards.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <p style={{ fontSize: '10px', color: 'var(--theme-text-3)', fontFamily: 'var(--font-sans)' }}>
                  {selected.size} of {cards.length} cards selected
                </p>
                <button
                  onClick={generate}
                  style={{
                    fontSize: '10px',
                    color: colour,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Regenerate ↺
                </button>
              </div>

              {cards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => toggleCard(i)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: selected.has(i)
                      ? `1.5px solid ${colour}`
                      : '0.5px solid var(--theme-border)',
                    backgroundColor: selected.has(i)
                      ? `${colour}06`
                      : 'var(--theme-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: selected.has(i)
                          ? 'none'
                          : '0.5px solid var(--theme-border)',
                        backgroundColor: selected.has(i) ? colour : 'transparent',
                        flexShrink: 0,
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selected.has(i) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '15px',
                          color: 'var(--theme-text)',
                          marginBottom: '6px',
                          lineHeight: 1.4,
                        }}
                      >
                        Q: {card.question}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '13px',
                          color: colour,
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        A: {card.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cards.length > 0 && !saved && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '0.5px solid var(--theme-border)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleSave}
              disabled={selected.size === 0}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                backgroundColor: selected.size === 0 ? 'var(--theme-border)' : colour,
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: selected.size === 0 ? 'default' : 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Save {selected.size} card{selected.size !== 1 ? 's' : ''}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: 'var(--theme-text-3)',
                fontSize: '12px',
                border: '0.5px solid var(--theme-border)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {saved && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '0.5px solid var(--theme-border)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '14px',
                color: '#0F6E56',
                fontStyle: 'italic',
              }}
            >
              ✓ Cards saved — they will appear in your daily review
            </p>
          </div>
        )}
      </div>
    </div>
  )
}