// ================================================================
// MYSTERIUM FIDEI — Notes List Page (/notes)
// ================================================================
// Shows all saved notes organised by discipline.
// Reads from localStorage for now — database in Phase 4.
// ================================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Notes',
}

export default function NotesPage() {
  return (
    <div
      style={{
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <NotesListClient />
    </div>
  )
}

// We need a client component import — create it next
import { NotesListClient } from '@/components/notes/NotesListClient'