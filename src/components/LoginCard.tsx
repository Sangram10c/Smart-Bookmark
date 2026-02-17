'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const supabase = createClient()

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After Google authenticates, Supabase will redirect to /auth/callback
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent', // Forces Google to show account picker
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // On success: browser navigates away to Google — no cleanup needed
  }

  return (
    <div className="animate-slide-up w-full max-w-sm">

      {/* ── Logo / Wordmark ─────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 4px 16px rgba(192,82,42,.35)',
          }}
        >
          <BookmarkIcon />
        </div>
        <h1
          className="font-display text-4xl italic"
          style={{ color: 'var(--text-primary)' }}
        >
          Markd
        </h1>
        <p
          className="mt-1 text-sm"
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          your bookmarks, beautifully kept
        </p>
      </div>

      {/* ── Card ────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2
          className="text-lg font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Sign in to continue
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          No password needed — just Google.
        </p>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm animate-fade-in"
            style={{
              background: 'var(--danger-soft)',
              color: 'var(--danger)',
            }}
          >
            {error}
          </div>
        )}

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'var(--text-primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-md)',
          }}
          onMouseOver={e => {
            if (!loading)
              (e.currentTarget as HTMLButtonElement).style.background =
                'var(--accent)'
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--text-primary)'
          }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Redirecting…
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <p
          className="mt-5 text-xs text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          By signing in you agree to our terms. Your bookmarks are private.
        </p>
      </div>
    </div>
  )
}

// ── SVG Icons ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8586-3.0477.8586-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71C3.7841 10.17 3.6818 9.5936 3.6818 9s.1023-1.17.2822-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
        fill="#EA4335"
      />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}