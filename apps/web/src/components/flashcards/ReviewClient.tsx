// ================================================================
// MYSTERIUM FIDEI — Flashcard Review Client
// ================================================================
// The spaced repetition review session UI.
//
// HOW IT WORKS:
// 1. Loads all cards due today from localStorage
// 2. Shows one card at a time — question side first
// 3. User taps "Show answer" to flip
// 4. User rates: Hard / Good / Easy
// 5. SM-2 algorithm schedules the next review
// 6. Session ends when all due cards are reviewed
//
// The flip animation uses CSS transform rotateY — pure CSS,
// no animation library needed.
// ================================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getDueCards,
  recordReview,
  type Flashcard,
  type FlashcardRating,
} from '@/lib/flashcardStorage'

const DISC_COLOURS: Record<string, string> = {
  Philosophy:   '#7A4A10',
  Apologetics:  '#7A1F2E',
  Bible:        '#0F6E56',
  Theology:     '#2B3B6B',
  Spirituality: '#3D5C3A',
}

const DISC_BG: Record<string, string> = {
  Philosophy:   '#FDF0DC',
  Apologetics:  '#F5E8EA',
  Bible:        '#E1F5EE',
  Theology:     '#E8EBF6',
  Spirituality: '#E8F2E7',
}

export function ReviewClient() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [stats, setStats] = useState({ hard: 0, good: 0, easy: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const due = getDueCards()
    setCards(due)
    setLoaded(true)
    if (due.length === 0) setSessionComplete(true)
  }, [])

  const current = cards[currentIndex]
  const colour = current ? (DISC_COLOURS[current.discipline] ?? '#B8872A') : '#B8872A'
  const bg = current ? (DISC_BG[current.discipline] ?? '#FAF4E2') : '#FAF4E2'
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0

  const handleRating = (rating: FlashcardRating) => {
    if (!current) return

    recordReview(current.id, rating)

    setStats(prev => ({
      ...prev,
      [rating.toLowerCase()]: prev[rating.toLowerCase() as keyof typeof prev] + 1,
    }))

    if (currentIndex + 1 >= cards.length) {
      setSessionComplete(true)
    } else {
      setCurrentIndex(i => i + 1)
      setRevealed(false)
    }
  }
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (sessionComplete) return

      if (e.code === 'Space' && !revealed) {
        e.preventDefault()
        setRevealed(true)
        return
      }

      if (revealed) {
        if (e.key === '1') {
          e.preventDefault()
          recordReview(cards[currentIndex].id, 'Hard')
          setStats(prev => ({ ...prev, hard: prev.hard + 1 }))
          if (currentIndex + 1 >= cards.length) {
            setSessionComplete(true)
          } else {
            setCurrentIndex(i => i + 1)
            setRevealed(false)
          }
        }
        if (e.key === '2') {
          e.preventDefault()
          recordReview(cards[currentIndex].id, 'Good')
          setStats(prev => ({ ...prev, good: prev.good + 1 }))
          if (currentIndex + 1 >= cards.length) {
            setSessionComplete(true)
          } else {
            setCurrentIndex(i => i + 1)
            setRevealed(false)
          }
        }
        if (e.key === '3') {
          e.preventDefault()
          recordReview(cards[currentIndex].id, 'Easy')
          setStats(prev => ({ ...prev, easy: prev.easy + 1 }))
          if (currentIndex + 1 >= cards.length) {
            setSessionComplete(true)
          } else {
            setCurrentIndex(i => i + 1)
            setRevealed(false)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [revealed, sessionComplete, currentIndex, cards])

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontStyle: 'italic', color: 'var(--theme-text-3)' }}>
          Preparing your review…
        </p>
      </div>
    )
  }

  // ---- Session complete screen ----------------------------
  if (sessionComplete) {
    const total = stats.hard + stats.good + stats.easy
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '24px',
          padding: '32px',
          backgroundColor: 'var(--theme-bg)',
        }}
      >
        {/* Completion mark */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '2px solid var(--color-sacred-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          ✦
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: '20px',
              letterSpacing: '0.1em',
              color: 'var(--theme-text)',
              marginBottom: '8px',
            }}
          >
            {total === 0 ? 'ALL CAUGHT UP' : 'REVIEW COMPLETE'}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '16px',
              fontStyle: 'italic',
              color: 'var(--theme-text-2)',
            }}
          >
            {total === 0
              ? 'No cards are due for review today.'
              : `${total} card${total !== 1 ? 's' : ''} reviewed`}
          </p>
        </div>

        {/* Stats */}
        {total > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px 24px',
              borderRadius: '12px',
              backgroundColor: 'var(--theme-card)',
              border: '0.5px solid var(--theme-border)',
            }}
          >
            {[
              { label: 'Hard', count: stats.hard, colour: '#7A1F2E', bg: '#F5E8EA' },
              { label: 'Good', count: stats.good, colour: '#7A4A10', bg: '#FDF0DC' },
              { label: 'Easy', count: stats.easy, colour: '#0F6E56', bg: '#E1F5EE' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: s.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 6px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: s.colour,
                    fontFamily: 'var(--font-cinzel)',
                  }}
                >
                  {s.count}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--theme-text-3)', fontFamily: 'var(--font-sans)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Latin wisdom */}
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '14px',
            fontStyle: 'italic',
            color: 'var(--color-sacred-gold)',
            textAlign: 'center',
            maxWidth: '320px',
          }}
        >
          Non multa, sed multum — not many things, but much depth.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/daily"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-sacred-gold)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Return to Daily Sacred
          </Link>
          <Link
            href="/notes/new"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--theme-card)',
              color: 'var(--theme-text)',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              border: '0.5px solid var(--theme-border)',
            }}
          >
            Write a note
          </Link>
        </div>
      </div>
    )
  }

  // ---- Active review screen -------------------------------
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--theme-bg)',
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: '3px',
          backgroundColor: 'var(--theme-border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: colour,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-card)',
        }}
      >
        <Link
          href="/daily"
          style={{
            fontSize: '12px',
            color: 'var(--theme-text-3)',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            border: '0.5px solid var(--theme-border)',
            borderRadius: '6px',
            padding: '4px 10px',
          }}
        >
          ← Exit
        </Link>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '10px',
            backgroundColor: bg,
          }}
        >
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: colour }} />
          <span style={{ fontSize: '10px', fontWeight: 500, color: colour, fontFamily: 'var(--font-sans)' }}>
            {current.discipline}
          </span>
        </div>

        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Card area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          gap: '24px',
        }}
      >
        {/* The card */}
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            minHeight: '280px',
            borderRadius: '16px',
            backgroundColor: 'var(--theme-card)',
            border: `1.5px solid ${colour}30`,
            borderLeft: `4px solid ${colour}`,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-parchment-lg)',
            position: 'relative',
          }}
        >
          {/* Card side label */}
          <p
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colour,
              marginBottom: '16px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {revealed ? 'Answer' : 'Question'}
          </p>

          {/* Question — always visible */}
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '22px',
              lineHeight: 1.5,
              color: 'var(--theme-text)',
              marginBottom: revealed ? '24px' : '0',
            }}
          >
            {current.question}
          </p>

          {/* Answer — revealed on tap */}
          {revealed && (
            <>
              <div
                style={{
                  height: '0.5px',
                  backgroundColor: `${colour}30`,
                  marginBottom: '20px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '18px',
                  lineHeight: 1.6,
                  color: colour,
                  fontStyle: 'italic',
                }}
              >
                {current.answer}
              </p>
              {current.source && (
                <p
                  style={{
                    fontSize: '10px',
                    color: 'var(--theme-text-3)',
                    marginTop: '12px',
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                  }}
                >
                  Source: {current.source}
                </p>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            style={{
              padding: '12px 32px',
              borderRadius: '10px',
              backgroundColor: colour,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.03em',
            }}
          >
            Show answer
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '600px' }}>
            {/* Hard */}
            <button
              onClick={() => handleRating('Hard')}
              style={{
                flex: 1,
                padding: '14px 8px',
                borderRadius: '10px',
                backgroundColor: '#F5E8EA',
                color: '#7A1F2E',
                border: '1.5px solid #7A1F2E40',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '16px' }}>😓</span>
              Hard
              <span style={{ fontSize: '10px', opacity: 0.6 }}>Tomorrow</span>
            </button>

            {/* Good */}
            <button
              onClick={() => handleRating('Good')}
              style={{
                flex: 1,
                padding: '14px 8px',
                borderRadius: '10px',
                backgroundColor: '#FDF0DC',
                color: '#7A4A10',
                border: '1.5px solid #7A4A1040',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🙂</span>
              Good
              <span style={{ fontSize: '10px', opacity: 0.6 }}>
                {current.repetitions === 0 ? '1 day' : `${Math.round(current.interval * current.easeFactor)} days`}
              </span>
            </button>

            {/* Easy */}
            <button
              onClick={() => handleRating('Easy')}
              style={{
                flex: 1,
                padding: '14px 8px',
                borderRadius: '10px',
                backgroundColor: '#E1F5EE',
                color: '#0F6E56',
                border: '1.5px solid #0F6E5640',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '16px' }}>😊</span>
              Easy
              <span style={{ fontSize: '10px', opacity: 0.6 }}>
                {current.repetitions === 0 ? '3 days' : `${Math.round(current.interval * current.easeFactor * 1.3)} days`}
              </span>
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <p
          style={{
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {revealed
            ? '1 = Hard · 2 = Good · 3 = Easy'
            : 'Space to reveal'}
        </p>
      </div>
    </div>
  )
}