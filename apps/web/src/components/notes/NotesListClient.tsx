// ================================================================
// MYSTERIUM FIDEI — Notes List Client
// ================================================================
// Renders the full notes library — filter by discipline,
// search, and open individual notes.
// 'use client' — reads from localStorage, uses useState.
// ================================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getNotes, deleteNote, type SavedNote } from '@/lib/notesStorage'

// ---- Discipline config ---------------------------------------

const DISCIPLINES = [
  { id: 'All',          colour: '#B8872A', bg: 'rgba(184,135,42,0.1)'  },
  { id: 'Philosophy',   colour: '#7A4A10', bg: '#FDF0DC' },
  { id: 'Apologetics',  colour: '#7A1F2E', bg: '#F5E8EA' },
  { id: 'Bible',        colour: '#0F6E56', bg: '#E1F5EE' },
  { id: 'Theology',     colour: '#2B3B6B', bg: '#E8EBF6' },
  { id: 'Spirituality', colour: '#3D5C3A', bg: '#E8F2E7' },
]

function getDiscColour(discipline: string): string {
  return DISCIPLINES.find(d => d.id === discipline)?.colour ?? '#B8872A'
}

function getDiscBg(discipline: string): string {
  return DISCIPLINES.find(d => d.id === discipline)?.bg ?? 'rgba(184,135,42,0.1)'
}

// ---- Note card -----------------------------------------------

function NoteCard({
  note,
  onDelete,
}: {
  note: SavedNote
  onDelete: (id: string) => void
}) {
  const colour = getDiscColour(note.discipline)
  const bg = getDiscBg(note.discipline)
  const date = new Date(note.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      className="mf-card"
      style={{
        padding: '16px',
        borderLeft: `3px solid ${colour}`,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        position: 'relative',
      }}
    >
      {/* Discipline badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '10px',
          backgroundColor: bg,
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: colour,
          }}
        />
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            color: colour,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {note.discipline}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/notes/${note.id}`}
        style={{ textDecoration: 'none' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--theme-text)',
            marginBottom: '6px',
            lineHeight: 1.3,
          }}
        >
          {note.title}
        </p>
      </Link>

      {/* Excerpt */}
      {note.excerpt && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--theme-text-2)',
            lineHeight: 1.6,
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {note.excerpt}
        </p>
      )}

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {date}
        </span>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {note.wordCount} words
        </span>

        {/* Actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <Link
            href={`/notes/${note.id}`}
            style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '6px',
              backgroundColor: bg,
              color: colour,
              border: `0.5px solid ${colour}30`,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Open ↗
          </Link>
          <button
            onClick={e => {
              e.stopPropagation()
              if (confirm('Delete this note?')) onDelete(note.id)
            }}
            style={{
              fontSize: '10px',
              padding: '3px 10px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--theme-text-3)',
              border: '0.5px solid var(--theme-border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Main component ------------------------------------------

export function NotesListClient() {
  const [notes, setNotes] = useState<SavedNote[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Load notes from localStorage on mount
  useEffect(() => {
    setNotes(getNotes())
  }, [])

  const handleDelete = (id: string) => {
    deleteNote(id)
    setNotes(getNotes())
  }

  // Filter by discipline and search
  const filtered = notes.filter(note => {
    const matchesDiscipline =
      filter === 'All' || note.discipline === filter
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchesDiscipline && matchesSearch
  })

  // Count by discipline for the filter tabs
  const counts = DISCIPLINES.reduce(
    (acc, d) => {
      acc[d.id] =
        d.id === 'All'
          ? notes.length
          : notes.filter(n => n.discipline === d.id).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >

      {/* ---- Header ---------------------------------------- */}
      <div
        style={{
          flexShrink: 0,
          padding: '16px 24px',
          backgroundColor: 'var(--theme-card)',
          borderBottom: '0.5px solid var(--theme-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: '16px',
              letterSpacing: '0.1em',
              color: 'var(--theme-text)',
              fontWeight: 500,
            }}
          >
            MY NOTES
          </h1>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--theme-text-3)',
              fontFamily: 'var(--font-sans)',
              marginTop: '2px',
            }}
          >
            {notes.length} note{notes.length !== 1 ? 's' : ''} ·{' '}
            {notes.reduce((s, n) => s + n.wordCount, 0).toLocaleString()} words
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            flex: 1,
            maxWidth: '320px',
            marginLeft: 'auto',
          }}
        >
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes…"
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '0.5px solid var(--theme-border-strong)',
              backgroundColor: 'var(--theme-bg)',
              color: 'var(--theme-text)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          />
        </div>

        {/* New note */}
        <Link
          href="/notes/new"
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-sacred-gold)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            flexShrink: 0,
          }}
        >
          ✏ New note
        </Link>
      </div>

      {/* ---- Discipline filter tabs ------------------------ */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          gap: '0',
          borderBottom: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-card)',
          overflowX: 'auto',
        }}
      >
        {DISCIPLINES.map(disc => {
          const isActive = filter === disc.id
          return (
            <button
              key={disc.id}
              onClick={() => setFilter(disc.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: isActive
                  ? `2px solid ${disc.colour}`
                  : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? disc.colour : 'var(--theme-text-3)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {disc.id}
              </span>
              {counts[disc.id] > 0 && (
                <span
                  style={{
                    fontSize: '9px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? disc.bg : 'var(--theme-border)',
                    color: isActive ? disc.colour : 'var(--theme-text-3)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {counts[disc.id]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ---- Notes grid ------------------------------------ */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
        }}
      >
        {filtered.length === 0 ? (
          // Empty state
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>📖</span>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '18px',
                color: 'var(--theme-text-2)',
                fontStyle: 'italic',
              }}
            >
              {search
                ? 'No notes match your search'
                : filter === 'All'
                ? 'No notes yet — begin your first reflection'
                : `No ${filter} notes yet`}
            </p>
            <Link
              href="/notes/new"
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-sacred-gold)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Write your first note
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '12px',
            }}
          >
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}