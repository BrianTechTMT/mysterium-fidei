// ================================================================
// MYSTERIUM FIDEI — Servus Note Panel
// ================================================================
// A slide-in chat panel that appears when the user clicks
// "Ask Servus about this note".
//
// Servus receives the full note content as context — it can:
// - Answer questions about theological content in the note
// - Suggest cross-references to Aquinas, Scripture, Fathers
// - Generate flashcard questions from the note
// - Point out gaps or errors in theological reasoning
// - Suggest related saints or feast days
//
// 'use client' — manages chat state, fetch calls, panel open/close
// ================================================================

'use client'

import { useState, useRef, useEffect } from 'react'
import type { SavedNote } from '@/lib/notesStorage'

// ---- Types ----------------------------------------------------

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ServusNotePanelProps {
  note: SavedNote
  discipline: string
  noteText: string  // plain text extracted from the note
  isOpen: boolean
  onClose: () => void
}

// ---- Suggested prompts by discipline -------------------------

const PROMPTS_BY_DISCIPLINE: Record<string, string[]> = {
  Philosophy: [
    'What are the key philosophical arguments here?',
    'How does Aquinas treat this topic in the Summa?',
    'What objections could be raised to this reasoning?',
    'Connect this to natural theology',
  ],
  Apologetics: [
    'How would I defend this position?',
    'What are the strongest counterarguments?',
    'What Church documents support this?',
    'How does this connect to the Protestant objection?',
  ],
  Bible: [
    'What is the Douay-Rheims rendering of this passage?',
    'How did the Church Fathers interpret this?',
    'What is the typological meaning here?',
    'Cross-reference this with the Old Testament',
  ],
  Theology: [
    'What is the dogmatic status of this teaching?',
    'How does the CCC treat this topic?',
    'What is the connection to the sacraments?',
    'Generate flashcard questions from this note',
  ],
  Spirituality: [
    'Which saints wrote about this theme?',
    'How does this connect to the liturgical season?',
    'What is the practical application for prayer?',
    'Suggest a meditation on this topic',
  ],
}

// ---- Markdown renderer (same as ServusPanel) -----------------

function renderContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {i < lines.length - 1 && <br />}
      </span>
    )
  })
}

// ---- Component -----------------------------------------------

export function ServusNotePanel({
  note,
  discipline,
  noteText,
  isOpen,
  onClose,
}: ServusNotePanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const colour = {
    Philosophy:   '#7A4A10',
    Apologetics:  '#7A1F2E',
    Bible:        '#0F6E56',
    Theology:     '#2B3B6B',
    Spirituality: '#3D5C3A',
  }[discipline] ?? '#B8872A'

  const prompts = PROMPTS_BY_DISCIPLINE[discipline] ?? PROMPTS_BY_DISCIPLINE.Theology

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Reset when note changes
  useEffect(() => {
    setMessages([])
  }, [note.id])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMessage: Message = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/servus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context: {
            // Pass the note content as context to Servus
            // The API route injects this into the system prompt
            noteTitle: note.title,
            noteDiscipline: discipline,
            noteContent: noteText,
          },
        }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.success
            ? data.data.message
            : 'Servus encountered a difficulty. Please try again.',
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach Servus. Check your connection.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  if (!isOpen) return null

  return (
    // Overlay backdrop
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Click backdrop to close */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(28,22,16,0.3)',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '380px',
          height: '100%',
          backgroundColor: 'var(--theme-bg-secondary)',
          borderLeft: '0.5px solid var(--theme-border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
          boxShadow: '-4px 0 20px rgba(28,22,16,0.15)',
        }}
      >

        {/* ---- Panel header -------------------------------- */}
        <div
          style={{
            flexShrink: 0,
            padding: '14px 16px',
            borderBottom: '0.5px solid var(--theme-border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--color-sacred-gold)', fontSize: '14px' }}>✦</span>
              <span
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: 'var(--theme-text)',
                }}
              >
                SERVUS
              </span>
              <span style={{ fontSize: '9px', color: 'var(--theme-text-3)' }}>
                · Note study mode
              </span>
            </div>
            {/* Note context indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: `${colour}10`,
                border: `0.5px solid ${colour}30`,
              }}
            >
              <div
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: colour,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  color: colour,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                }}
              >
                {discipline}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--theme-text-3)',
                  fontFamily: 'var(--font-sans)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                }}
              >
                · {note.title}
              </span>
            </div>
          </div>

          {/* Close button */}
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
              fontFamily: 'var(--font-sans)',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ---- Messages ------------------------------------ */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Empty state */}
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Opening message */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--theme-bg)',
                  border: '0.5px solid var(--theme-border)',
                }}
              >
                <p
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sacred-gold)',
                    marginBottom: '5px',
                  }}
                >
                  ✦ Servus
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--theme-text)',
                  }}
                >
                  I have read your note on{' '}
                  <em>&ldquo;{note.title}&rdquo;</em>.
                  {noteText.length > 20
                    ? ' How may I serve your study of this material?'
                    : ' The note is brief — begin writing and I can help you develop it further.'}
                </p>
              </div>

              {/* Suggested prompts */}
              <p
                style={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--theme-text-3)',
                  marginTop: '4px',
                }}
              >
                Suggested for {discipline}
              </p>
              {prompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '0.5px solid var(--theme-border)',
                    backgroundColor: 'var(--theme-bg)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'var(--theme-text-2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span style={{ color: colour, fontSize: '10px' }}>✦</span>
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <p
                style={{
                  fontSize: '8px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: msg.role === 'user'
                    ? 'var(--theme-text-3)'
                    : 'var(--color-sacred-gold)',
                  marginBottom: '3px',
                  paddingLeft: msg.role === 'assistant' ? '4px' : 0,
                  paddingRight: msg.role === 'user' ? '4px' : 0,
                }}
              >
                {msg.role === 'user' ? 'You' : '✦ Servus'}
              </p>
              <div
                style={{
                  maxWidth: '92%',
                  padding: '10px 12px',
                  borderRadius: msg.role === 'user'
                    ? '12px 12px 2px 12px'
                    : '12px 12px 12px 2px',
                  backgroundColor: msg.role === 'user'
                    ? '#2B3B6B'
                    : 'var(--theme-bg)',
                  border: msg.role === 'assistant'
                    ? '0.5px solid var(--theme-border)'
                    : 'none',
                  fontFamily: msg.role === 'assistant'
                    ? 'var(--font-cormorant)'
                    : 'var(--font-sans)',
                  fontSize: msg.role === 'assistant' ? '14px' : '12px',
                  lineHeight: 1.6,
                  color: msg.role === 'user' ? '#fff' : 'var(--theme-text)',
                }}
              >
                {msg.role === 'assistant'
                  ? renderContent(msg.content)
                  : msg.content}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <p
                style={{
                  fontSize: '8px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-sacred-gold)',
                  marginBottom: '3px',
                  paddingLeft: '4px',
                }}
              >
                ✦ Servus
              </p>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 2px',
                  backgroundColor: 'var(--theme-bg)',
                  border: '0.5px solid var(--theme-border)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-sacred-gold)',
                      animation: 'pulse 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ---- Input --------------------------------------- */}
        <div
          style={{
            flexShrink: 0,
            borderTop: '0.5px solid var(--theme-border)',
            padding: '10px 12px',
            backgroundColor: 'var(--theme-bg-secondary)',
          }}
        >
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              style={{
                fontSize: '9px',
                color: 'var(--theme-text-3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '6px',
                display: 'block',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Clear conversation
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Servus about this note…"
              rows={1}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                border: '0.5px solid var(--theme-border-strong)',
                backgroundColor: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor:
                  loading || !input.trim()
                    ? 'var(--theme-border)'
                    : colour,
                color: '#fff',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              ↑
            </button>
          </div>
          <p
            style={{
              fontSize: '9px',
              color: 'var(--theme-text-3)',
              marginTop: '6px',
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </div>
  )
}