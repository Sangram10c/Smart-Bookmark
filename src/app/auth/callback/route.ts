// OAuth Callback Route Handler
//
// After Google redirects the user back, Supabase appends a one-time `code`
// query parameter to this URL. This handler:
//   1. Exchanges the code for a session (access + refresh tokens)
//   2. Writes the session into cookies via the server client
//   3. Redirects to the dashboard on success, or /login on failure
//
// IMPORTANT: This URL must be registered in both:
//   - Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
//   - Google Cloud Console → OAuth 2.0 → Authorised Redirect URIs

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Optional: `next` param lets us redirect to a specific page post-login
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    // Exchange the one-time code for a persistent session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Determine the correct base URL (handles Vercel's proxy headers)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Production on Vercel: use the forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Code missing or exchange failed — redirect with error flag
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}