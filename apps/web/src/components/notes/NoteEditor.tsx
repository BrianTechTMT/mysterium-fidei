// ================================================================
// MYSTERIUM FIDEI — Note Editor
// ================================================================
// The core rich text editor for theology study notes.
// Built on TipTap (ProseMirror) — the same engine that powers
// Notion, Linear, and GitLab's editor.
//
// Features:
// - Full rich text: headings, bold, italic, lists, blockquote
// - Discipline selection drives colour theming
// - Scripture callout block (blockquote styled)
// - Auto-save to localStorage (persists between sessions)
// - Word count
// - Keyboard shortcuts (Cmd+B, Cmd+I, etc.)
// ================================================================

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useEffect, useCallback } from 'react'
import { DisciplineSelector } from './DisciplineSelector'
import { EditorToolbar } from './EditorToolbar'

// ---- Discipline colour map -----------------------------------
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

// ---- Local storage key --------------------------------------
const DRAFT_KEY = 'mf-note-draft'

// ---- Component ----------------------------------------------

export function NoteEditor() {
  const [discipline, setDiscipline] = useState('Theology')
  const [title, setTitle] = useState('')
  const [saved, setSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const colour = DISC_COLOURS[discipline] ?? '#2B3B6B'
  const discBg = DISC_BG[discipline] ?? '#E8EBF6'

  // ---- TipTap editor instance ----------------------------
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit includes: Bold, Italic, Strike, Code,
        // Paragraph, Heading, BulletList, OrderedList,
        // Blockquote, HardBreak, HorizontalRule, History
        heading: { levels: [1, 2, 3] },
      }),
      Typography,     // Smart quotes, em-dashes, etc.
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder:
          'Begin your theological reflection here…\n\n' +
          'Use the toolbar above for headings, lists, and scripture callouts.\n' +
          'Press Cmd+B for bold, Cmd+I for italic.',
      }),
    ],
    // Load draft from localStorage on mount
    content: '',
    editorProps: {
      attributes: {
        class: 'mf-editor-content',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save draft to localStorage on every change
      const draft = {
        title,
        discipline,
        content: editor.getJSON(),
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      setLastSaved(new Date())
      setSaved(true)
    },
  })

  // ---- Load draft on mount --------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.title) setTitle(draft.title)
        if (draft.discipline) setDiscipline(draft.discipline)
        if (draft.content && editor) {
          editor.commands.setContent(draft.content)
        }
      }
    } catch {
      // No draft or parse error — start fresh
    }
  }, [editor])

  // ---- Save title to draft --------------------------------
  useEffect(() => {
    if (!title) return
    const content = editor?.getJSON() ?? {}
    const draft = {
      title,
      discipline,
      content,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [title, discipline, editor])

  // ---- Clear draft ----------------------------------------
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setTitle('')
    setDiscipline('Theology')
    editor?.commands.clearContent()
    setSaved(false)
    setLastSaved(null)
  }, [editor])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >

      {/* ---- Note header / meta bar ----------------------- */}
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
        {/* Discipline colour indicator */}
        <div
          style={{
            width: '4px',
            height: '36px',
            borderRadius: '2px',
            backgroundColor: colour,
            flexShrink: 0,
          }}
        />

        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title…"
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
            color: saved ? colour : 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {saved && lastSaved
            ? `Saved ${lastSaved.toLocaleTimeString()}`
            : 'Unsaved draft'}
        </span>

        {/* Clear button */}
        <button
          onClick={clearDraft}
          style={{
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            background: 'none',
            border: '0.5px solid var(--theme-border)',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          New note
        </button>
      </div>

      {/* ---- Discipline selector -------------------------- */}
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

      {/* ---- Toolbar -------------------------------------- */}
      <EditorToolbar editor={editor} disciplineColour={colour} />

      {/* ---- Editor content ------------------------------- */}
      {/* The EditorContent component renders TipTap's         */}
      {/* contenteditable div. All styling is in globals.css   */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--theme-bg)',
          padding: '24px 32px',
        }}
      >
        {/* Discipline badge above content */}
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

      {/* ---- Bottom action bar ---------------------------- */}
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
          Save note
        </button>
        <button
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
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Auto-saved as draft · Cmd+B bold · Cmd+I italic
        </span>
      </div>

    </div>
  )
}