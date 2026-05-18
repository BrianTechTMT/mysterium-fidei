// ================================================================
// MYSTERIUM FIDEI — Flashcard Storage
// ================================================================
// Handles reading, writing, and scheduling flashcards.
// Uses the SM-2 spaced repetition algorithm — the same
// algorithm that powers Anki, the gold standard SRS system.
//
// SM-2 HOW IT WORKS:
// Every card has an easeFactor (starts at 2.5) and an interval
// (days until next review). After each review:
// - Hard  → interval barely increases, ease drops
// - Good  → interval multiplies by easeFactor
// - Easy  → interval multiplies by easeFactor × 1.3 bonus
//
// This means easy cards space out quickly (weeks, months)
// while hard cards stay in frequent rotation (1-3 days).
// The student sees each card just before they would forget it.
// ================================================================

const CARDS_KEY = 'mf-flashcards'

// ---- Types ----------------------------------------------------

export type FlashcardRating = 'Hard' | 'Good' | 'Easy'

export interface Flashcard {
  id: string
  noteId?: string           // which note it came from (if any)
  discipline: string
  question: string
  answer: string
  source?: string           // e.g. "Mark 10:13-16" or "Summa I q.13"
  // SM-2 spaced repetition fields
  interval: number          // days until next review
  easeFactor: number        // difficulty multiplier (starts 2.5)
  repetitions: number       // total times reviewed
  nextReviewDate: string    // ISO date
  lastReviewDate?: string
  createdAt: string
}

// ---- SM-2 Algorithm -------------------------------------------

const MIN_EASE = 1.3
const INITIAL_EASE = 2.5
const INITIAL_INTERVAL = 1

/**
 * Calculates the next interval and easeFactor after a review.
 * This is the core of the SM-2 algorithm.
 */
function calculateNextReview(
  card: Flashcard,
  rating: FlashcardRating
): { interval: number; easeFactor: number; repetitions: number } {
  const { interval, easeFactor, repetitions } = card

  if (rating === 'Hard') {
    // Hard — reset to short interval, reduce ease
    return {
      interval: Math.max(1, Math.round(interval * 1.2)),
      easeFactor: Math.max(MIN_EASE, easeFactor - 0.2),
      repetitions: repetitions + 1,
    }
  }

  if (rating === 'Good') {
    // Good — increase interval by ease factor
    const newInterval =
      repetitions === 0
        ? INITIAL_INTERVAL
        : repetitions === 1
        ? 3
        : Math.round(interval * easeFactor)
    return {
      interval: newInterval,
      easeFactor,
      repetitions: repetitions + 1,
    }
  }

  // Easy — interval bonus, ease increases
  const newInterval =
    repetitions === 0
      ? 3
      : repetitions === 1
      ? 7
      : Math.round(interval * easeFactor * 1.3)
  return {
    interval: newInterval,
    easeFactor: Math.min(3.0, easeFactor + 0.1),
    repetitions: repetitions + 1,
  }
}

/**
 * Adds days to today's date and returns ISO string.
 */
function addDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

/**
 * Returns today's date as ISO string.
 */
function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ---- Public API -----------------------------------------------

/**
 * Returns all flashcards.
 */
export function getAllCards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(CARDS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Flashcard[]
  } catch {
    return []
  }
}

/**
 * Returns cards due for review today or earlier.
 * Sorted by most overdue first.
 */
export function getDueCards(): Flashcard[] {
  const todayStr = today()
  return getAllCards()
    .filter(c => c.nextReviewDate <= todayStr)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
}

/**
 * Returns cards filtered by discipline.
 */
export function getCardsByDiscipline(discipline: string): Flashcard[] {
  return getAllCards().filter(c => c.discipline === discipline)
}

/**
 * Saves one or more new flashcards.
 */
export function saveCards(
  cards: Omit<Flashcard, 'id' | 'interval' | 'easeFactor' | 'repetitions' | 'nextReviewDate' | 'createdAt'>[]
): Flashcard[] {
  const existing = getAllCards()
  const now = new Date().toISOString()

  const newCards: Flashcard[] = cards.map(c => ({
    ...c,
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    interval: INITIAL_INTERVAL,
    easeFactor: INITIAL_EASE,
    repetitions: 0,
    nextReviewDate: today(),  // due immediately
    createdAt: now,
  }))

  localStorage.setItem(CARDS_KEY, JSON.stringify([...existing, ...newCards]))
  return newCards
}

/**
 * Records a review rating and schedules the next review.
 * This is called when the user rates a card Hard/Good/Easy.
 */
export function recordReview(
  cardId: string,
  rating: FlashcardRating
): Flashcard | null {
  const cards = getAllCards()
  const index = cards.findIndex(c => c.id === cardId)
  if (index === -1) return null

  const card = cards[index]
  const { interval, easeFactor, repetitions } = calculateNextReview(
    card,
    rating
  )

  const updated: Flashcard = {
    ...card,
    interval,
    easeFactor,
    repetitions,
    nextReviewDate: addDays(interval),
    lastReviewDate: today(),
  }

  cards[index] = updated
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
  return updated
}

/**
 * Deletes a flashcard by ID.
 */
export function deleteCard(id: string): void {
  const cards = getAllCards().filter(c => c.id !== id)
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

/**
 * Returns summary statistics for the progress panel.
 */
export function getCardStats(): {
  total: number
  dueToday: number
  byDiscipline: Record<string, number>
  masteredCount: number  // interval > 21 days = mastered
} {
  const cards = getAllCards()
  const todayStr = today()
  const byDiscipline: Record<string, number> = {}

  cards.forEach(c => {
    byDiscipline[c.discipline] = (byDiscipline[c.discipline] ?? 0) + 1
  })

  return {
    total: cards.length,
    dueToday: cards.filter(c => c.nextReviewDate <= todayStr).length,
    byDiscipline,
    masteredCount: cards.filter(c => c.interval > 21).length,
  }
}