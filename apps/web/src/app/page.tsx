// ================================================================
// MYSTERIUM FIDEI — Home Page
// ================================================================
// The root URL "/" redirects immediately to "/daily".
// The Daily Sacred dashboard is the heart of the app —
// it should be what the user sees first every time they open it.
// ================================================================

import { redirect } from 'next/navigation'

export default function HomePage() {
  // redirect() in a Server Component issues a 307 redirect.
  // The user never sees this page — they land on /daily instantly.
  redirect('/daily')
}