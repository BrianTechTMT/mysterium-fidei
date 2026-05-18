// ================================================================
// MYSTERIUM FIDEI — Flashcard Review Page (/review)
// ================================================================

import type { Metadata } from 'next'
import { ReviewClient } from '@/components/flashcards/ReviewClient'

export const metadata: Metadata = {
  title: 'Daily Review',
}

export default function ReviewPage() {
  return (
    <div style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      <ReviewClient />
    </div>
  )
}