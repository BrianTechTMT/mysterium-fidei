// ================================================================
// MYSTERIUM FIDEI — Shared Constants
// Single source of truth. Change here, updates everywhere.
// ================================================================

/**
 * Discipline colour palette.
 * Each discipline has a hex colour (for iOS SwiftUI)
 * and a Tailwind name (for the web app).
 */
export const DISCIPLINE_COLOURS = {
  Philosophy:   { hex: '#7A4A10', tailwind: 'amber',   label: 'Philosophy'   },
  Apologetics:  { hex: '#7A1F2E', tailwind: 'crimson', label: 'Apologetics'  },
  Bible:        { hex: '#0F6E56', tailwind: 'teal',    label: 'Bible'        },
  Theology:     { hex: '#2B3B6B', tailwind: 'indigo',  label: 'Theology'     },
  Spirituality: { hex: '#3D5C3A', tailwind: 'sage',    label: 'Spirituality' },
} as const

/**
 * Liturgical form colours.
 * EF = Sanctoral Indigo, OF = Ordinary Teal.
 * Used consistently across every screen in both apps.
 */
export const FORM_COLOURS = {
  EF: { hex: '#3C3489', label: 'Extraordinary Form · pre-1962' },
  OF: { hex: '#0F6E56', label: 'Ordinary Form · post-1970'     },
} as const

/**
 * Vestment colour hex values.
 * Shown as a colour indicator in the liturgical date bar.
 */
export const VESTMENT_COLOURS: Record<string, string> = {
  green:  '#2E6B2E',
  purple: '#4B2E6B',
  white:  '#F5F0E8',
  red:    '#8B1A1A',
  rose:   '#C47C8A',
  black:  '#1C1610',
  gold:   '#B8872A',
}

/**
 * Servus system prompt.
 * This is sent to Claude at the start of every conversation.
 * It defines who Servus is, how it speaks, and what it will
 * and will not do. This is the humility principle in code.
 */
export const SERVUS_SYSTEM_PROMPT = `\
You are Servus — the AI assistant of Mysterium Fidei, \
a Catholic theology study application.

Your name means "servant" in Latin. You are named after \
the papal title Servus servorum Dei — Servant of the servants \
of God. This name defines your posture entirely.

YOUR ROLE:
- You are a servant of the student's learning, not a teacher asserting authority
- You present sources, frame questions, and illuminate connections
- You do not conclude on the student's behalf — you lead them to their own reasoning
- You never flatter or use enthusiastic affirmations ("great question!", "excellent!")

YOUR KNOWLEDGE:
- You reason from Catholic sources: Scripture (Douay-Rheims), \
the Summa Theologica, the Catechism of the Catholic Church, \
the Church Fathers, and both the Extraordinary Form (pre-1962) \
and Ordinary Form (post-1970) liturgical traditions
- You speak with theological precision, using proper Latin \
terminology with brief definitions on first use
- You distinguish between dogma, doctrine, theological opinion, \
and pious tradition

YOUR TONE:
- Reverent but not pious. Precise but not cold. Scholarly but not arrogant.
- Speak as a learned monk would to a younger student — \
with patience, depth, and genuine care for their formation
- Never use casual language or Protestant-adjacent enthusiasm

YOUR LIMITS:
- Regularly remind the student that no study tool replaces \
the sacraments, prayer, or spiritual direction
- Acknowledge AI limits: "I can present sources; \
the Church and her pastors interpret with authority"
- On pastoral questions, direct the student to their confessor or bishop

HUMILITY PRINCIPLE:
Scientia inflat, caritas aedificat — \
Knowledge puffs up, but charity builds up (1 Cor 8:1).
Every interaction should leave the student more humble \
before the mystery of faith, not more proud of their knowledge.
`

/**
 * SM-2 spaced repetition defaults.
 * These match Anki — the gold standard SRS system.
 * The algorithm schedules flashcard reviews at optimal intervals
 * so the student sees each card just before they would forget it.
 */
export const SRS_DEFAULTS = {
  initialInterval: 1,       // days before first review
  initialEaseFactor: 2.5,   // Anki default starting ease
  minEaseFactor: 1.3,       // floor — never easier than this
  hardMultiplier: 1.2,      // small interval increase for Hard
  easyMultiplier: 1.3,      // bonus multiplier for Easy
} as const

/**
 * API route constants.
 * Import these instead of hardcoding strings.
 * If a route changes, update here — both apps update automatically.
 */
export const API_ROUTES = {
  daily:      '/api/daily',
  office:     '/api/office',
  saints:     '/api/saints',
  servus:     '/api/servus',
  notes:      '/api/notes',
  flashcards: '/api/flashcards',
  auth:       '/api/auth',
} as const