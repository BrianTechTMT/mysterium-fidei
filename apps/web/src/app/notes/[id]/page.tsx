// ================================================================
// MYSTERIUM FIDEI — Note Detail Page (/notes/[id])
// ================================================================
// Next.js 15 made params async — must be awaited before use.
// ================================================================

import type { Metadata } from 'next'
import { NoteDetailClient } from '@/components/notes/NoteDetailClient'

export const metadata: Metadata = {
  title: 'Note',
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // In Next.js 15, params is a Promise — must await it
  const { id } = await params

  return (
    <div
      style={{
        height: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <NoteDetailClient id={id} />
    </div>
  )
}