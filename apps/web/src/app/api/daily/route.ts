// ================================================================
// MYSTERIUM FIDEI — GET /api/daily
// ================================================================
// Returns the complete liturgical data bundle for today.
//
// DATA SOURCES:
// OF Calendar:   cpbjr Catholic Readings API (MIT, GitHub Pages)
// OF Readings:   cpbjr Catholic Readings API (reading references)
// Scripture text: Douay-Rheims JSON (public domain)
// OF Saints:     cpbjr liturgical-calendar endpoint
// EF Calendar:   romcal 1.3.0 + manual EF saint data
//
// ARCHITECTURE:
// This route fetches from multiple sources, merges them into
// one clean LiturgicalDay object, and returns it.
// The web and iOS apps only ever call this one endpoint —
// they never know or care where the data came from.
// ================================================================
// CURRENT DATA SOURCES:
// OF Mass readings:  Catholic Readings API + Douay-Rheims ✅
// OF Saints:         Catholic Readings API ✅
// OF Hours:          divineoffice.org deep link ✅
// EF Saints:         Curated local dataset ✅
// EF Office:         Curated patristic readings ✅
// EF Mass propers:   ❌ Phase 4 — Divinum Officium Docker
// EF Hours (full):   ❌ Phase 4 — Divinum Officium Docker
//
// PHASE 4 ARCHITECTURE:
// Both EF Mass propers and EF Hours will come from a single
// self-hosted Divinum Officium Docker instance.
// Query: GET http://localhost:8080/cgi-bin/missa.pl?date=YYYY-M-D
// Query: GET http://localhost:8080/cgi-bin/horas.pl?date=YYYY-M-D&hora=Laudes
//
// The /api/daily route will detect if Divinum Officium is running
// and populate EF fields from it automatically.
// ================================================================

import { NextResponse } from 'next/server'

// ---- Helpers --------------------------------------------------

/**
 * Formats a Date to MM-DD for the Catholic Readings API
 * e.g. May 17 → "05-17"
 */
function toMMDD(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}

/**
 * Formats a Date to YYYY-MM-DD
 */
function toISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Maps season strings from the API to our internal format
 */
function normaliseSeason(season: string): string {
  const map: Record<string, string> = {
    'Eastertide':     'Easter',
    'Lent':           'Lent',
    'Advent':         'Advent',
    'Christmastide':  'Christmas',
    'Ordinary Time':  'Ordinary Time',
    'Holy Week':      'Holy Week',
  }
  return map[season] ?? season
}

/**
 * Maps season to vestment colour
 */
function seasonToColour(season: string, celebrationType?: string): string {
  // Feasts of martyrs, Pentecost → red
  if (celebrationType === 'FEAST_OF_THE_LORD' || season === 'Pentecost') return 'red'
  const map: Record<string, string> = {
    'Easter':        'white',
    'Christmas':     'white',
    'Advent':        'purple',
    'Lent':          'purple',
    'Holy Week':     'purple',
    'Ordinary Time': 'green',
  }
  return map[season] ?? 'green'
}

/**
 * Fetch wrapper with timeout — prevents hanging requests
 */
async function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(timeout)
  }
}

// ---- Douay-Rheims verse lookup --------------------------------
// We use the Bible API at api.bible for the Douay-Rheims text.
// It's free for non-commercial use and covers all 73 books.
// For now we parse the reference string and return a formatted
// passage note — full verse lookup comes in the next step.

/**
 * Converts a reading reference like "Acts 1:1-11" to
 * the API format "Acts+1:1-11" for dailybible.ca
 */
function referenceToApiFormat(reference: string): string {
  // Handle multi-verse references like "Acts 1:1-11"
  // and single verse references like "John 3:16"
  // and psalm references like "Psalm 47:2-3, 6-7, 8-9"
  // For comma-separated psalm sections, take the first range only
  const primary = reference.split(',')[0].trim()
  return primary.replace(/\s+/g, '+')
}

/**
 * Fetches real Douay-Rheims verse text from dailybible.ca
 * Returns the full passage as a single string.
 * Falls back to the reference string if the fetch fails.
 */
async function fetchVerseText(reference: string): Promise<string> {
  if (!reference) return ''
  try {
    const apiRef = referenceToApiFormat(reference)
    const url = `https://dailybible.ca/api/${encodeURIComponent(apiRef)}?translation=dra`
    const res = await fetchWithTimeout(url, 6000)
    if (!res.ok) return reference
    const data = await res.json()
    if (data.error) return reference
    // Join all verses into one flowing passage
    // Each verse separated by a space — reads naturally as prose
    return data.verses
      .map((v: { text: string }) => v.text)
      .join(' ')
  } catch {
    return reference
  }
}
/**
 * Returns the responsorial psalm antiphon for known feasts.
 * The antiphon is not available from free APIs — we maintain
 * a curated list for major feasts and seasons.
 * This grows over time and can eventually be replaced by
 * a proper lectionary database.
 */
function getAntiphon(psalmRef: string, celebration: string): string {
  const c = celebration.toLowerCase()

  // Ascension / 7th Sunday of Easter (US)
  if (c.includes('ascension') || c.includes('7th sunday of easter')) {
    return 'God mounts his throne to shouts of joy; a blare of trumpets for the Lord.'
  }
  if (c.includes('easter') || c.includes('resurrection')) {
    return 'This is the day the Lord has made; let us rejoice and be glad.'
  }
  if (c.includes('christmas')) {
    return 'Today is born our Saviour, Christ the Lord.'
  }
  if (c.includes('advent')) {
    return 'Lord, make us turn to you; let us see your face and we shall be saved.'
  }
  if (c.includes('lent')) {
    return 'Be merciful, O Lord, for we have sinned.'
  }

  // Psalm-based fallback antiphons
  if (psalmRef.includes('Psalm 47')) {
    return 'God mounts his throne to shouts of joy; a blare of trumpets for the Lord.'
  }
  if (psalmRef.includes('Psalm 23')) {
    return 'The Lord is my shepherd; there is nothing I shall want.'
  }
  if (psalmRef.includes('Psalm 103')) {
    return 'The Lord\'s kindness is everlasting to those who fear him.'
  }

  return ''
}

// ---- EF Saint data -------------------------------------------
// The pre-1962 calendar is not covered by the cpbjr API.
// We maintain a small curated dataset of EF saints by month/day.
// This grows over time and can be contributed to as a community.
// In a later phase, Divinum Officium Docker provides this fully.

const EF_SAINTS: Record<string, {
  name: string
  rank: string
  category: string[]
  description: string
  patronOf?: string[]
}[]> = {
  '05-17': [
    {
      name: 'St. Paschal Baylon',
      rank: 'Double',
      category: ['Religious', 'Mystic'],
      description:
        'Franciscan lay brother renowned for his intense devotion to ' +
        'the Blessed Sacrament. Patron of Eucharistic congresses and ' +
        'associations. He lived a life of profound contemplation and ' +
        'charitable service to the poor.',
      patronOf: ['Eucharistic congresses', 'Eucharistic associations'],
    },
  ],
  '05-16': [
    {
      name: 'St. Simon Stock',
      rank: 'Double',
      category: ['Mystic', 'Religious'],
      description:
        'Prior General of the Carmelite Order who received the Brown ' +
        'Scapular from Our Lady in 1251. A model of Marian devotion ' +
        'and contemplative prayer.',
      patronOf: ['Carmelites'],
    },
    {
      name: 'St. Brendan the Navigator',
      rank: 'Simple',
      category: ['Abbot', 'Missionary'],
      description:
        'Irish monk and abbot of Clonfert, known for his legendary ' +
        'voyage. A pillar of Celtic monasticism and missionary zeal.',
      patronOf: ['Sailors', 'Travellers', 'Ireland'],
    },
  ],
  // Add more dates as the project grows
}

// ---- Office of Readings (EF patristic texts) ------------------
// Curated patristic readings matched to the liturgical season.
// Full Divinum Officium integration replaces this in Phase 4.

function getPatristicReading(season: string, celebration: string): {
  author: string
  work: string
  text: string
} {
  // Ascension / Easter season
  if (
    season === 'Easter' ||
    celebration.toLowerCase().includes('ascension') ||
    celebration.toLowerCase().includes('easter')
  ) {
    return {
      author: 'St. Leo the Great',
      work: 'Sermon 73 on the Ascension',
      text:
        'Dearly beloved, the Ascension of Christ is our uplifting, ' +
        'and whither the glory of the Head has gone before, thither ' +
        'the hope of the Body is called to follow. Let us exult with ' +
        'worthy joy, and be glad with holy thanksgiving. For today not ' +
        'only are we confirmed as possessors of paradise, but have ' +
        'also penetrated with Christ into the highest of the heavens.',
    }
  }
  // Ordinary Time default
  return {
    author: 'St. Augustine of Hippo',
    work: 'Sermon 34 on the Psalms',
    text:
      'Sing to the Lord a new song; his praise is in the assembly ' +
      'of the saints. These words invite us to praise God — not ' +
      'merely with the voice, but with the life. The new song is ' +
      'the new life, and the new life belongs to the new man, ' +
      'who sings it in the new age.',
  }
}

// ---- Main route handler ---------------------------------------

export async function GET() {
  const today = new Date()
  const dateString = toISO(today)
  const mmdd = toMMDD(today)
  const year = today.getFullYear()

  try {
    // ---- Fetch OF readings and calendar in parallel ----------
    // Promise.allSettled means one failure doesn't kill everything.
    // If one source fails we still return what we have.
    const [readingsResult, calendarResult] = await Promise.allSettled([
      fetchWithTimeout(
        `https://cpbjr.github.io/catholic-readings-api/readings/${year}/${mmdd}.json`
      ).then(r => r.json()),
      fetchWithTimeout(
        `https://cpbjr.github.io/catholic-readings-api/liturgical-calendar/${year}/${mmdd}.json`
      ).then(r => r.json()),
    ])

    // Extract data or use fallbacks if a fetch failed
    const readingsData = readingsResult.status === 'fulfilled'
      ? readingsResult.value
      : null

    const calendarData = calendarResult.status === 'fulfilled'
      ? calendarResult.value
      : null

    // ---- Build season and celebration info ------------------
    const season = normaliseSeason(
      readingsData?.season ?? calendarData?.season ?? 'Ordinary Time'
    )
    const celebration = calendarData?.celebration?.name ?? 'Feria'
    const celebrationType = calendarData?.celebration?.type ?? ''
    const vestmentColour = seasonToColour(season, celebrationType)
    const liturgicalNote = calendarData?.liturgicalNote ?? ''

    /// ---- Fetch real Douay-Rheims verse text -----------------
    // All three fetches run in parallel — no sequential waiting.
    // Promise.allSettled means one failure doesn't kill the others.
    const firstRef = readingsData?.readings?.firstReading ?? ''
    const psalmRef = readingsData?.readings?.psalm ?? ''
    const secondRef = readingsData?.readings?.secondReading ?? ''
    const gospelRef = readingsData?.readings?.gospel ?? ''

    const [firstText, psalmText, secondText, gospelText] =
      await Promise.all([
        fetchVerseText(firstRef),
        fetchVerseText(psalmRef),
        fetchVerseText(secondRef),
        fetchVerseText(gospelRef),
      ])

    // ---- Build OF readings ----------------------------------
    const readings = {
      firstReading: {
        reference: firstRef || 'See USCCB',
        translation: 'Douay-Rheims',
        text: firstText || 'Reading not available.',
        usccbLink: readingsData?.usccbLink ?? 'https://bible.usccb.org',
      },
      psalm: {
        reference: psalmRef,
        translation: 'Douay-Rheims',
        text: psalmText,
        antiphon: getAntiphon(psalmRef, celebration),
      },
      secondReading: secondRef
        ? {
            reference: secondRef,
            translation: 'Douay-Rheims',
            text: secondText,
          }
        : null,
      gospel: {
        reference: gospelRef || 'See USCCB',
        translation: 'Douay-Rheims',
        text: gospelText || 'Gospel not available.',
        usccbLink: readingsData?.usccbLink ?? 'https://bible.usccb.org',
      },
    }

    // ---- Build OF saints ------------------------------------
    const ofSaints = calendarData?.celebration?.name
      ? [
          {
            id: calendarData.celebration.name
              .toLowerCase()
              .replace(/\s+/g, '-'),
            name: calendarData.celebration.name,
            rank: calendarData.celebration.type ?? 'Feria',
            category: ['Feast'],
            description: calendarData.celebration.description
              || calendarData.celebration.quote
              || `${calendarData.celebration.name} — ${calendarData.celebration.type ?? ''}`,
            form: 'OF',
          },
        ]
      : []

    // ---- Build EF saints ------------------------------------
    const efSaintsData = EF_SAINTS[mmdd] ?? []
    const efSaints = efSaintsData.map((s, i) => ({
      id: `ef-${mmdd}-${i}`,
      name: s.name,
      rank: s.rank,
      category: s.category,
      description: s.description,
      patronOf: s.patronOf ?? [],
      form: 'EF',
    }))

    // ---- EF celebration name --------------------------------
    // In the pre-1962 calendar, Ascension is always on Thursday
    // (40 days after Easter), not transferred to Sunday.
    // Today (May 17) is the Sunday within the Octave of the
    // Ascension in the EF.
    const efCelebration = (() => {
      if (mmdd === '05-17') return 'Sunday within the Octave of the Ascension'
      if (season === 'Easter') return `${celebration} (Extraordinary Form)`
      return `${celebration} (Extraordinary Form)`
    })()

    // ---- Patristic reading (EF Office of Readings) ----------
    const patristicReading = getPatristicReading(season, celebration)

    // ---- Servus synthesis (will be AI-generated later) ------
    // For now: a contextually accurate synthesis based on
    // the actual season and readings we fetched.
    const servusSynthesis = {
      theme: season === 'Easter'
        ? 'The Ascension: our flesh already reigns in heaven'
        : `${celebration}: entering the mystery`,
      body: season === 'Easter'
        ? 'The Ascension is not a departure but a transformation of ' +
          'presence. Christ does not leave the Church — He draws her ' +
          'upward. The command to baptise all nations (Mt 28:19) is ' +
          'given precisely as He ascends, because the mission flows ' +
          'from the glorified humanity of Christ seated at the right ' +
          'hand of the Father. Study how St. Leo the Great understands ' +
          'this: the Head has gone before, and the Body must follow.'
        : 'Enter the mystery of today\'s liturgy through its readings ' +
          'and the lives of the saints who sanctified this day.',
      connections: season === 'Easter'
        ? [
            {
              discipline: 'Theology',
              note: 'Hypostatic union — Christ\'s humanity now glorified',
            },
            {
              discipline: 'Spirituality',
              note: 'Sursum corda — lifting of the heart toward heaven',
            },
            {
              discipline: 'Apologetics',
              note: 'The Ascension as historical event — Acts 1:1-11',
            },
          ]
        : [
            { discipline: 'Bible', note: `Today\'s Gospel: ${readings.gospel.reference}` },
            { discipline: 'Spirituality', note: 'Enter the liturgical mystery of the day' },
          ],
    }

    // ---- Assemble the final response ------------------------
    const dailyData = {
      date: dateString,
      season,
      celebration,
      liturgicalNote,
      celebrationType,
      // Week number derived from season data
      weekNumber: calendarData?.season_week ?? 7,
      psalterWeek: 2,
      vestmentColour,
      usccbLink: readingsData?.usccbLink ?? 'https://bible.usccb.org',

      // Ordinary Form
      of: {
        celebration,
        rank: celebrationType,
        saints: ofSaints,
        officeUrl: 'https://divineoffice.org',
      },

      // Extraordinary Form
      ef: {
        celebration: efCelebration,
        rank: efSaints[0]?.rank ?? 'Feria',
        saints: efSaints,
        officeOfReadings: {
          secondReading: patristicReading,
        },
      },

      readings,
      servusSynthesis,
    }

    return NextResponse.json(
      { success: true, data: dailyData },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    )

  } catch (error) {
    console.error('Daily route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DAILY_ERROR',
          message: 'Failed to fetch liturgical data',
        },
      },
      { status: 500 }
    )
  }
}