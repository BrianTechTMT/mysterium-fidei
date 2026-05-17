// ================================================================
// MYSTERIUM FIDEI — Editor Toolbar
// ================================================================
// Rich text formatting toolbar for the note editor.
// Uses TipTap editor commands to apply formatting.
// Organised into groups: text style, structure, theology customs.
// ================================================================

'use client'

import { type Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor | null
  disciplineColour: string
}

// ---- Toolbar button component --------------------------------

function ToolBtn({
  onClick,
  active,
  disabled,
  title,
  children,
  colour,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
  colour?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '4px 8px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active
          ? colour
            ? `${colour}20`
            : 'rgba(184,135,42,0.15)'
          : 'transparent',
        color: active
          ? colour ?? 'var(--color-sacred-gold)'
          : 'var(--theme-text-2)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '12px',
        fontWeight: active ? 600 : 400,
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.1s',
        minWidth: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return (
    <div
      style={{
        width: '1px',
        height: '18px',
        backgroundColor: 'var(--theme-border)',
        margin: '0 4px',
        flexShrink: 0,
      }}
    />
  )
}

// ---- Main toolbar --------------------------------------------

export function EditorToolbar({ editor, disciplineColour }: ToolbarProps) {
  if (!editor) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '6px 12px',
        backgroundColor: 'var(--theme-card)',
        borderBottom: '0.5px solid var(--theme-border)',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      {/* ---- Headings --------------------------------------- */}
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
        colour={disciplineColour}
      >
        H1
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
        colour={disciplineColour}
      >
        H2
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
        colour={disciplineColour}
      >
        H3
      </ToolBtn>

      <Divider />

      {/* ---- Text style ------------------------------------- */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
        colour={disciplineColour}
      >
        <strong>B</strong>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
        colour={disciplineColour}
      >
        <em>I</em>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
        colour={disciplineColour}
      >
        <span style={{ textDecoration: 'underline' }}>U</span>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
        colour={disciplineColour}
      >
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </ToolBtn>

      <Divider />

      {/* ---- Lists ----------------------------------------- */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet list"
        colour={disciplineColour}
      >
        • —
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered list"
        colour={disciplineColour}
      >
        1.—
      </ToolBtn>

      <Divider />

      {/* ---- Scripture callout ------------------------------ */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Scripture callout"
        colour={disciplineColour}
      >
        ❝
      </ToolBtn>

      <Divider />

      {/* ---- Text alignment --------------------------------- */}
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align left"
        colour={disciplineColour}
      >
        ←
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align center"
        colour={disciplineColour}
      >
        ↔
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align right"
        colour={disciplineColour}
      >
        →
      </ToolBtn>

      <Divider />

      {/* ---- Highlight ------------------------------------- */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        title="Highlight"
        colour={disciplineColour}
      >
        <span
          style={{
            backgroundColor: '#FFE066',
            padding: '0 3px',
            borderRadius: '2px',
          }}
        >
          ab
        </span>
      </ToolBtn>

      <Divider />

      {/* ---- Undo / Redo ----------------------------------- */}
      <ToolBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
        colour={disciplineColour}
      >
        ↩
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
        colour={disciplineColour}
      >
        ↪
      </ToolBtn>

      {/* ---- Word count ------------------------------------ */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--theme-text-3)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {editor.storage.characterCount?.words?.() ?? 0} words
        </span>
      </div>
    </div>
  )
}