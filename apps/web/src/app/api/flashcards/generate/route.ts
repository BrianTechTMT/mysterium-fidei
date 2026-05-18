// ================================================================
// MYSTERIUM FIDEI — POST /api/flashcards/generate
// ================================================================
// Takes a piece of text (note content, scripture reading, etc.)
// and uses Servus (Claude) to generate theological flashcards.
//
// Returns an array of { question, answer, source } objects.
// The client saves these to localStorage via flashcardStorage.
// ================================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, discipline, source, count = 5 } = body

    if (!text || !discipline) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'text and discipline are required' } },
        { status: 400 }
      )
    }

    const prompt = `You are Servus, a Catholic theology study assistant.

Generate exactly ${count} flashcard question-answer pairs from the following ${discipline} text.

RULES:
- Questions must be precise and theological — not vague
- Answers must be concise (1-3 sentences maximum)
- Use proper theological terminology
- Focus on what is most important to remember and understand
- For scripture: focus on meaning, context, and cross-references
- For theology: focus on definitions, distinctions, and Church teaching
- For philosophy: focus on arguments, terms, and their application
- Do not generate trivial or obvious questions

TEXT:
${text}

Respond with ONLY a valid JSON array. No preamble, no explanation, no markdown.
Format:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    // Strip any markdown code fences if present
    const cleaned = raw
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const cards = JSON.parse(cleaned) as { question: string; answer: string }[]

    return NextResponse.json(
      {
        success: true,
        data: cards.map(c => ({
          ...c,
          discipline,
          source: source ?? '',
        })),
      },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    console.error('Flashcard generation error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'GENERATION_ERROR', message: 'Failed to generate flashcards' } },
      { status: 500 }
    )
  }
}