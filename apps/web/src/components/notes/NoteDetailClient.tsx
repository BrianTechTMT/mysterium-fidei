// ================================================================
// MYSTERIUM FIDEI — Note Detail Client
// ================================================================
// Loads a saved note by ID and opens it in the full editor.
// 'use client' — reads localStorage, uses useState/useEffect.
// ================================================================

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { getNoteById, saveNote, type SavedNote } from '@/lib/notesStorage'
import { DisciplineSelector } from './DisciplineSelector'
import { EditorToolbar } from './EditorToolbar'
import { ServusNotePanel } from './ServusNotePanel'
import { FlashcardGenerator } from '@/components/flashcards/FlashcardGenerator'

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

export function NoteDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [note, setNote] = useState<SavedNote | null>(null)
  const [title, setTitle] = useState('')
  const [discipline, setDiscipline] = useState('Theology')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [servusOpen, setServusOpen] = useState(false)

  const colour = DISC_COLOURS[discipline] ?? '#2B3B6B'
  const discBg = DISC_BG[discipline] ?? '#E8EBF6'
  
   const [flashcardOpen, setFlashcardOpen] = useState(false)
  const [flashcardsSaved, setFlashcardsSaved] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder: 'Continue your reflection…',
      }),
    ],
    content: '',
    editorProps: {
      attributes: { class: 'mf-editor-content', spellcheck: 'true' },
    },
  })

  // Load note on mount
  useEffect(() => {
    const found = getNoteById(id)
    if (!found) {
      setNotFound(true)
      return
    }
    setNote(found)
    setTitle(found.title)
    setDiscipline(found.discipline)
    if (editor && found.content) {
      editor.commands.setContent(found.content)
    }
  }, [id, editor])

  const handleSave = () => {
    if (!editor || !note) return
    saveNote({
      id: note.id,
      title: title || 'Untitled note',
      discipline,
      content: editor.getJSON(),
    })
    setLastSaved(new Date())
  }

  const getNoteText = (): string => {
    if (!editor) return ''
    return editor.getText()
  }

  if (notFound) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '12px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '20px',
            color: 'var(--theme-text-2)',
            fontStyle: 'italic',
          }}
        >
          Note not found
        </p>
        <button
          onClick={() => router.push('/notes')}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-sacred-gold)',
            color: '#fff',
            fontSize: '12px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Back to notes
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '16px 20px',
          backgroundColor: 'var(--theme-card)',
          borderBottom: '0.5px solid var(--theme-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/notes')}
          style={{
            background: 'none',
            border: '0.5px solid var(--theme-border)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: 'var(--theme-text-2)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            flexShrink: 0,
          }}
        >
          ← Notes
        </button>

        {/* Discipline colour bar */}
        <div
          style={{
            width: '4px',
            height: '36px',
            borderRadius: '2px',
            backgroundColor: colour,
            flexShrink: 0,
          }}
        />

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-cinzel)',
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            color: 'var(--theme-text)',
          }}
        />

        {/* Save status */}
        <span
          style={{
            fontSize: '10px',
            color: lastSaved ? colour : 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {lastSaved
            ? `Saved ${lastSaved.toLocaleTimeString()}`
            : 'Unsaved changes'}
        </span>
      </div>

      {/* Discipline selector */}
      <div
        style={{
          flexShrink: 0,
          padding: '14px 20px',
          backgroundColor: 'var(--theme-bg-secondary)',
          borderBottom: '0.5px solid var(--theme-border)',
        }}
      >
        <DisciplineSelector
          selected={discipline}
          onChange={setDiscipline}
        />
      </div>

      {/* Toolbar */}
      <EditorToolbar editor={editor} disciplineColour={colour} />

      {/* Editor content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--theme-bg)',
          padding: '24px 32px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '12px',
            backgroundColor: discBg,
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: colour,
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: colour,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.05em',
            }}
          >
            {discipline}
          </span>
        </div>

        <EditorContent editor={editor} />
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          padding: '10px 20px',
          borderTop: '0.5px solid var(--theme-border)',
          backgroundColor: 'var(--theme-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colour,
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Save changes
        </button>
        <button
          onClick={() => setServusOpen(true)}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: `0.5px solid ${colour}40`,
            backgroundColor: discBg,
            color: colour,
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ✦ Ask Servus about this note
        </button>
        <button
          onClick={() => setFlashcardOpen(true)}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: `0.5px solid ${colour}40`,
            backgroundColor: discBg,
            color: colour,
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          🃏 Generate flashcards
        </button>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {note?.wordCount ?? 0} words · created {note
            ? new Date(note.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : ''}
        </span>
      </div>
      {/* Servus panel */}
      {note && (
        <ServusNotePanel
          note={note}
          discipline={discipline}
          noteText={getNoteText()}
          isOpen={servusOpen}
          onClose={() => setServusOpen(false)}
        />
      )}
      {/* Flashcard generator */}
      {flashcardOpen && note && (
        <FlashcardGenerator
          noteText={getNoteText()}
          noteTitle={note.title}
          discipline={discipline}
          onClose={() => setFlashcardOpen(false)}
          onSaved={(count) => {
            setFlashcardsSaved(count)
            setFlashcardOpen(false)
          }}
        />
      )}
    </div>
  )
}