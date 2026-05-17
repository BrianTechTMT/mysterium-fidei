// ================================================================
// MYSTERIUM FIDEI — GET /api/daily
// ================================================================
// Returns today's complete liturgical data bundle.
//
// RIGHT NOW: Returns realistic mock data so we can build
// the UI immediately without waiting on external APIs.
//
// LATER (Step 3.8): We replace the mock return value with
// real data from romcal, Divinum Officium, and Douay-Rheims.
// The shape of the data never changes — only the source.
// ================================================================

import { NextResponse } from 'next/server'

export async function GET() {
  const today = new Date()

  // toISOString gives us "2026-05-17T..." — we take just the date part
  const dateString = today.toISOString().split('T')[0]

  const mockDay = {
    date: dateString,
    season: 'Ordinary Time',
    weekNumber: 7,
    psalterWeek: 3,
    vestmentColour: 'green',

    ef: {
      celebration: 'Saturday of the Seventh Week after Pentecost',
      rank: 'Feria',
      saints: [
        {
          id: 'simon-stock',
          name: 'St. Simon Stock',
          rank: 'Double',
          category: ['Mystic', 'Religious'],
          description:
            'Prior General of the Carmelite Order who received the ' +
            'Brown Scapular from Our Lady in 1251. A model of Marian ' +
            'devotion and contemplative prayer.',
          patronOf: ['Carmelites'],
          form: 'EF',
        },
        {
          id: 'brendan-navigator',
          name: 'St. Brendan the Navigator',
          rank: 'Simple',
          category: ['Abbot', 'Missionary'],
          description:
            'Irish monk and abbot of Clonfert, known for his legendary ' +
            'voyage. A pillar of Celtic monasticism and missionary zeal.',
          patronOf: ['Sailors', 'Travellers', 'Ireland'],
          form: 'EF',
        },
      ],
      officeOfReadings: {
        secondReading: {
          author: 'St. Augustine of Hippo',
          work: 'Sermon 34 on the Psalms',
          text:
            'Sing to the Lord a new song; his praise is in the assembly ' +
            'of the saints. Let Israel rejoice in his Maker. These words ' +
            'invite us to praise God — not merely with the voice, but ' +
            'with the life. The new song is the new life, and the new ' +
            'life belongs to the new man, who sings it in the new age.',
        },
      },
    },

    of: {
      celebration: 'Saturday of the Seventh Week in Ordinary Time',
      rank: 'Feria',
      saints: [
        {
          id: 'ubaldus-gubbio',
          name: 'St. Ubaldus of Gubbio',
          rank: 'Optional Memorial',
          category: ['Bishop', 'Mystic'],
          description:
            'Bishop of Gubbio renowned for his holiness and patience. ' +
            'Known to have repelled an invasion by his mere presence.',
          patronOf: ['Gubbio'],
          form: 'OF',
        },
      ],
      officeUrl: 'https://divineoffice.org',
    },

    readings: {
      firstReading: {
        reference: 'Sirach 17:1-15',
        translation: 'Douay-Rheims',
        text:
          'God created man out of the earth, and made him after his own ' +
          'image. And he turned him into it again, and clothed him with ' +
          'strength according to himself. He gave him the number of his ' +
          'days and time, and gave him power over all things that are ' +
          'upon the earth.',
      },
      psalm: {
        reference: 'Psalm 103:13-18',
        translation: 'Douay-Rheims',
        antiphon: "The Lord's kindness is everlasting to those who fear him.",
        text:
          'As a father hath compassion on his children, so hath the ' +
          'Lord compassion on them that fear him: for he knoweth our ' +
          'frame. He remembereth that we are dust.',
      },
      gospel: {
        reference: 'Mark 10:13-16',
        translation: 'Douay-Rheims',
        text:
          'And they brought to him young children, that he might touch ' +
          'them. And the disciples rebuked them that brought them. Whom ' +
          'when Jesus saw, he was much displeased, and saith to them: ' +
          'Suffer the little children to come unto me, and forbid them ' +
          'not; for of such is the kingdom of God. Amen I say to you, ' +
          'whosoever shall not receive the kingdom of God as a little ' +
          'child, shall not enter into it. And embracing them, and ' +
          'laying his hands upon them, he blessed them.',
      },
    },

    servusSynthesis: {
      theme: 'Receiving the Kingdom as a little child',
      body:
        "Today's sources converge on a single posture: receptivity. " +
        'The Gospel calls you to receive the Kingdom as a child — ' +
        'without grasping, without merit, without pride. Augustine ' +
        "echoes this: the new song is not performed, it is received " +
        'into a life remade. St. Simon Stock shows this receptivity ' +
        'lived — accepting the Scapular as a child accepts a gift.',
      connections: [
        {
          discipline: 'Theology',
          note: 'Grace and receptivity — ST I-II q.110',
        },
        {
          discipline: 'Spirituality',
          note: "Thérèse of Lisieux — the little way",
        },
        {
          discipline: 'Philosophy',
          note: 'Passive potency in Aquinas',
        },
      ],
    },
  }

  return NextResponse.json(
    { success: true, data: mockDay },
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  )
}