// ================================================================
// MYSTERIUM FIDEI — Notes Storage
// ================================================================
// Handles reading and writing notes to localStorage.
// This is a temporary layer — Phase 4 replaces localStorage
// with PostgreSQL via the Express API.
//
// WHY A SEPARATE MODULE:
// Isolating storage logic means when we swap localStorage for
// a real database, we only change this one file. Every component
// that calls saveNote() or getNotes() automatically gets the
// new backend without any changes to UI code.
// This is the Repository Pattern — a professional standard.
// ================================================================

const NOTES_KEY = 'mf-notes'
const DRAFT_KEY = 'mf-note-draft'

// ---- Types ----------------------------------------------------

export interface SavedNote {
  id: string
  title: string
  discipline: string
  content: Record<string, unknown>  // TipTap JSON
  excerpt: string                    // first 150 chars of plain text
  wordCount: number
  createdAt: string
  updatedAt: string
  linkedDate?: string                // if created from a liturgical day
  tags: string[]
}

// ---- Helpers --------------------------------------------------

/**
 * Generates a unique ID for a new note.
 * Uses timestamp + random suffix — simple and collision-resistant
 * for a single-user local app.
 */
function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Extracts plain text from TipTap JSON content.
 * Used to generate the note excerpt shown in the list.
 */
function extractText(content: Record<string, unknown>): string {
  try {
    const nodes = (content.content as { type: string; content?: unknown[] }[]) ?? []
    const texts: string[] = []

    function walk(node: { type: string; text?: string; content?: unknown[] }) {
      if (node.type === 'text' && node.text) {
        texts.push(node.text)
      }
      if (node.content) {
        node.content.forEach(child => walk(child as { type: string; text?: string; content?: unknown[] }))
      }
    }

    nodes.forEach(node => walk(node as { type: string; text?: string; content?: unknown[] }))
    return texts.join(' ')
  } catch {
    return ''
  }
}

/**
 * Counts words in extracted plain text.
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ---- Public API -----------------------------------------------

/**
 * Returns all saved notes, sorted by most recently updated.
 */
export function getNotes(): SavedNote[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return []
    const notes = JSON.parse(raw) as SavedNote[]
    return notes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch {
    return []
  }
}

/**
 * Returns notes filtered by discipline.
 */
export function getNotesByDiscipline(discipline: string): SavedNote[] {
  return getNotes().filter(n => n.discipline === discipline)
}

/**
 * Returns a single note by ID.
 */
export function getNoteById(id: string): SavedNote | null {
  return getNotes().find(n => n.id === id) ?? null
}

/**
 * Saves a new note or updates an existing one.
 * Returns the saved note with its ID.
 */
export function saveNote(params: {
  id?: string
  title: string
  discipline: string
  content: Record<string, unknown>
  linkedDate?: string
  tags?: string[]
}): SavedNote {
  const notes = getNotes()
  const plainText = extractText(params.content)
  const now = new Date().toISOString()

  if (params.id) {
    // Update existing note
    const index = notes.findIndex(n => n.id === params.id)
    if (index !== -1) {
      const updated: SavedNote = {
        ...notes[index],
        title: params.title || 'Untitled note',
        discipline: params.discipline,
        content: params.content,
        excerpt: plainText.slice(0, 150),
        wordCount: countWords(plainText),
        updatedAt: now,
        tags: params.tags ?? notes[index].tags,
      }
      notes[index] = updated
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
      return updated
    }
  }

  // Create new note
  const newNote: SavedNote = {
    id: generateId(),
    title: params.title || 'Untitled note',
    discipline: params.discipline,
    content: params.content,
    excerpt: plainText.slice(0, 150),
    wordCount: countWords(plainText),
    createdAt: now,
    updatedAt: now,
    linkedDate: params.linkedDate,
    tags: params.tags ?? [],
  }

  notes.unshift(newNote)
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))

  // Clear the draft after saving
  localStorage.removeItem(DRAFT_KEY)

  return newNote
}

/**
 * Deletes a note by ID.
 */
export function deleteNote(id: string): void {
  const notes = getNotes().filter(n => n.id !== id)
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

/**
 * Returns note statistics for the progress panel.
 */
export function getNoteStats(): {
  total: number
  byDiscipline: Record<string, number>
  totalWords: number
} {
  const notes = getNotes()
  const byDiscipline: Record<string, number> = {}

  notes.forEach(n => {
    byDiscipline[n.discipline] = (byDiscipline[n.discipline] ?? 0) + 1
  })

  return {
    total: notes.length,
    byDiscipline,
    totalWords: notes.reduce((sum, n) => sum + n.wordCount, 0),
  }
}