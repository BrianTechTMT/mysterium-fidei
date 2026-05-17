// ================================================================
// MYSTERIUM FIDEI — POST /api/servus
// ================================================================
// Receives a conversation and context, calls the Claude API,
// and returns Servus's response.
//
// WHY A SERVER ROUTE:
// The Claude API key must never be exposed to the browser.
// This route runs on the server — the key stays secret.
// The browser sends messages here, this route calls Claude,
// and returns the response. The key is never in client code.
// ================================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Initialise the Anthropic client.
// It automatically reads ANTHROPIC_API_KEY from environment.
// Never pass the key manually in client-side code.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// The Servus system prompt — imported logic from our constants.
// Defines who Servus is, how it speaks, and its limits.
const SERVUS_SYSTEM_PROMPT = `\
You are Servus — the AI assistant of Mysterium Fidei, \
a Catholic theology study application.

Your name means "servant" in Latin, echoing the papal title \
Servus servorum Dei — Servant of the servants of God.

YOUR ROLE:
- You are a servant of the student's learning, not a teacher asserting authority
- You present sources, frame questions, and illuminate connections
- You do not conclude on the student's behalf — lead them to their own reasoning
- Never flatter or use enthusiastic affirmations like "great question!"

YOUR KNOWLEDGE:
- Reason from Catholic sources: Scripture (Douay-Rheims), Summa Theologica,
  Catechism of the Catholic Church, Church Fathers, and both the
  Extraordinary Form (pre-1962) and Ordinary Form (post-1970) liturgical traditions
- Use proper Latin terminology with brief definitions on first use
- Distinguish between dogma, doctrine, theological opinion, and pious tradition

YOUR TONE:
- Reverent but not pious. Precise but not cold. Scholarly but not arrogant.
- Speak as a learned monk to a younger student — patience, depth, genuine care
- Never use casual language

YOUR LIMITS:
- Remind the student that no study tool replaces the sacraments or spiritual direction
- On pastoral questions, direct the student to their confessor or bishop
- Acknowledge AI limits: "I can present sources; the Church interprets with authority"

HUMILITY PRINCIPLE:
Scientia inflat, caritas aedificat — Knowledge puffs up, charity builds up (1 Cor 8:1).
Leave the student more humble before the mystery of faith, not more proud of knowledge.`

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { messages, context } = body

    // Validate — we need at least one message
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Messages array is required' } },
        { status: 400 }
      )
    }

    // Build context string from today's liturgical data.
    // This is injected into the system prompt so Servus knows
    // what the user is studying today without being told explicitly.
    let contextString = ''
    if (context) {
      // Daily Sacred context
      if (context.gospel) {
        contextString += `\nToday's Gospel: ${context.gospel.reference} — ${context.gospel.text}`
      }
      if (context.firstReading) {
        contextString += `\nFirst Reading: ${context.firstReading.reference}`
      }
      if (context.efSaint) {
        contextString += `\nEF Saint of the day: ${context.efSaint}`
      }
      if (context.ofSaint) {
        contextString += `\nOF Saint of the day: ${context.ofSaint}`
      }
      if (context.synthesis) {
        contextString += `\nToday's meditation theme: ${context.synthesis}`
      }

      // Note study context — injected when Servus is opened from a note
      if (context.noteTitle || context.noteContent) {
        contextString += `\n\n--- STUDENT'S NOTE ---`
        if (context.noteTitle) {
          contextString += `\nNote title: ${context.noteTitle}`
        }
        if (context.noteDiscipline) {
          contextString += `\nDiscipline: ${context.noteDiscipline}`
        }
        if (context.noteContent) {
          // Limit to 3000 chars to stay within context limits
          const content = context.noteContent.slice(0, 3000)
          contextString += `\nNote content:\n${content}`
          if (context.noteContent.length > 3000) {
            contextString += `\n[Note truncated — ${context.noteContent.length} total characters]`
          }
        }
        contextString += `\n\nYou have read the student's note above. Respond specifically to its content — reference what they have written, build on their ideas, correct any errors charitably, and deepen their understanding. Do not speak generically.`
      }
    }
    const systemWithContext = contextString
      ? `${SERVUS_SYSTEM_PROMPT}\n\n--- TODAY'S LITURGICAL CONTEXT ---${contextString}`
      : SERVUS_SYSTEM_PROMPT

    // Call the Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemWithContext,
      // messages must alternate user/assistant
      // The Anthropic SDK expects this exact shape
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    // Extract the text response
    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return NextResponse.json(
      {
        success: true,
        data: {
          message: text,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        },
      },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    )

  } catch (error) {
    console.error('Servus API error:', JSON.stringify(error, null, 2))
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVUS_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    )
  }
}