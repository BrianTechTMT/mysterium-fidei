// ================================================================
// MYSTERIUM FIDEI — Servus Chat Panel
// ================================================================
// Third column of the Daily Sacred layout.
// A real-time chat interface powered by the Claude API.
//
// 'use client' — this component manages:
// - Message history (useState)
// - Input field (useState)
// - Loading state (useState)
// - Auto-scroll to latest message (useRef + useEffect)
// - Fetch calls to /api/servus
// ================================================================

'use client'

import { useState, useRef, useEffect } from 'react'

// ---- Types ----------------------------------------------------

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LiturgicalContext {
  gospel?: { reference: string; text: string }
  firstReading?: { reference: string }
  efSaint?: string
  ofSaint?: string
  synthesis?: string
}

interface ServusPanelProps {
  context: LiturgicalContext
}

// ---- Suggested prompts ----------------------------------------
// Shown before the user types anything.
// Each one is a natural theology study question.

const SUGGESTED_PROMPTS = [
  "Guide me through today's Gospel",
  'Connect today\'s readings to Aquinas',
  'Who is St. Simon Stock?',
  'Lead me in Lectio Divina',
  'Quiz me on today\'s theme',
]

// ---- Markdown-like renderer -----------------------------------
// Servus responses use **bold** and *italic* markdown.
// This converts them to styled spans without a library.

function renderContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold: **text**
    const boldItalic = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')

    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: boldItalic }} />
        {i < lines.length - 1 && <br />}
      </span>
    )
  })
}

// ---- Component ------------------------------------------------

export function ServusPanel({ context }: ServusPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ---- Send message to Servus --------------------------------
  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    // Add user message to history immediately
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
          context,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.data.message },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Servus encountered a difficulty. Please try again.',
          },
        ])
      }
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

  // Handle Enter key — send on Enter, newline on Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ---- Collapsed state ---------------------------------------
  if (!panelOpen) {
    return (
      <div
        style={{
          width: '40px',
          flexShrink: 0,
          borderLeft: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '12px',
          gap: '8px',
          cursor: 'pointer',
        }}
        onClick={() => setPanelOpen(true)}
        title="Open Servus"
      >
        <span style={{ color: 'var(--color-sacred-gold)', fontSize: '14px' }}>
          ✦
        </span>
        <span
          style={{
            fontSize: '9px',
            color: 'var(--theme-text-3)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Servus
        </span>
      </div>
    )
  }

  // ---- Full panel --------------------------------------------
  return (
    <div
      style={{
        width: '300px',
        flexShrink: 0,
        borderLeft: '0.5px solid var(--theme-border)',
        backgroundColor: 'var(--theme-bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >

      {/* ---- Panel header ---------------------------------- */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderBottom: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-bg-secondary)',
        }}
      >
        <span style={{ color: 'var(--color-sacred-gold)', fontSize: '14px' }}>
          ✦
        </span>
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
        <span
          style={{
            fontSize: '9px',
            color: 'var(--theme-text-3)',
            marginLeft: '2px',
          }}
        >
          · Daily Sacred mode
        </span>

        {/* Collapse button */}
        <button
          onClick={() => setPanelOpen(false)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--theme-text-3)',
            fontSize: '14px',
            padding: '2px',
          }}
          title="Collapse Servus"
        >
          ›
        </button>
      </div>

      {/* ---- Messages area --------------------------------- */}
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

        {/* Empty state — suggested prompts */}
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
                  color: 'var(--color-sacred-gold)',
                  marginBottom: '5px',
                  textTransform: 'uppercase',
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
                {context.synthesis
                  ? `Today's arc: "${context.synthesis}". Where shall we begin?`
                  : 'How may I serve your study today?'}
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
              Suggested
            </p>
            {SUGGESTED_PROMPTS.map(prompt => (
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
                  transition: 'border-color 0.15s',
                }}
              >
                <span style={{ color: 'var(--color-sacred-gold)', fontSize: '10px' }}>
                  ✦
                </span>
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {/* Role label */}
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

            {/* Message bubble */}
            <div
              style={{
                maxWidth: '90%',
                padding: '10px 12px',
                borderRadius: msg.role === 'user'
                  ? '12px 12px 2px 12px'
                  : '12px 12px 12px 2px',
                backgroundColor: msg.role === 'user'
                  ? 'var(--color-indigo, #2B3B6B)'
                  : 'var(--theme-bg)',
                border: msg.role === 'assistant'
                  ? '0.5px solid var(--theme-border)'
                  : 'none',
                fontFamily: msg.role === 'assistant'
                  ? 'var(--font-cormorant)'
                  : 'var(--font-sans)',
                fontSize: msg.role === 'assistant' ? '14px' : '12px',
                lineHeight: 1.6,
                color: msg.role === 'user'
                  ? '#fff'
                  : 'var(--theme-text)',
              }}
            >
              {msg.role === 'assistant'
                ? renderContent(msg.content)
                : msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
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

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ---- Input area ------------------------------------ */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '0.5px solid var(--theme-border)',
          padding: '10px 12px',
          backgroundColor: 'var(--theme-bg-secondary)',
        }}
      >
        {/* Clear conversation */}
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
            }}
          >
            Clear conversation
          </button>
        )}

        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Servus..."
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
              backgroundColor: loading || !input.trim()
                ? 'var(--theme-border)'
                : 'var(--color-apologetics)',
              color: '#fff',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0,
              transition: 'background-color 0.15s',
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
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}