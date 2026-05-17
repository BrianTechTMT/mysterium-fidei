// ================================================================
// MYSTERIUM FIDEI — New Note Page
// ================================================================

import type { Metadata } from 'next'
import { NoteEditor } from '@/components/notes/NoteEditor'

export const metadata: Metadata = {
  title: 'New Note',
}

export default function NewNotePage() {
  return (
    <div
      style={{
        height: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <NoteEditor />
    </div>
  )
}