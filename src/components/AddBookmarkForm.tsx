'use client'
import { useState, useRef, type FormEvent } from 'react'
import type { Bookmark } from '@/types'

interface Props {
  onAdd: (bookmark: Bookmark) => void
}

export default function AddBookmarkForm({ onAdd }: Props) {
  const [url, setUrl]         = useState('')
  const [title, setTitle]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const urlInputRef = useRef<HTMLInputElement>(null)

 
  async function handleUrlBlur() {
    if (!url || title) return
    try {
      const u    = new URL(url)
      const host = u.hostname.replace(/^www\./, '')
      setTitle(host)
    } catch {
      // Invalid URL — ignore silently
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url || !title) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), title: title.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      // Notify parent for optimistic update
      onAdd(data.bookmark as Bookmark)

      
      setUrl('')
      setTitle('')
      setSuccess(true)
      urlInputRef.current?.focus()

      
      setTimeout(() => setSuccess(false), 2000)
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3
        className="text-sm font-medium mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        + Add a bookmark
      </h3>

      <div className="flex flex-col gap-3">

        {/* URL input */}
        <div>
          <label
            htmlFor="bm-url"
            className="block text-xs mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            URL
          </label>
          <input
            id="bm-url"
            ref={urlInputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://example.com"
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150 outline-none"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow   = '0 0 0 3px var(--accent-soft)'
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          />
        </div>

        {/* Title input */}
        <div>
          <label
            htmlFor="bm-title"
            className="block text-xs mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Title
          </label>
          <input
            id="bm-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My favourite article"
            required
            maxLength={200}
            className="w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150 outline-none"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow   = '0 0 0 3px var(--accent-soft)'
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          />
        </div>

        
        {error && (
          <p
            className="text-xs animate-fade-in"
            style={{ color: 'var(--danger)' }}
          >
            {error}
          </p>
        )}

      
        <button
          type="submit"
          disabled={loading || !url || !title}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: success ? 'var(--success)' : 'var(--accent)',
            color: '#fff',
            boxShadow: success
              ? '0 2px 8px rgba(42,122,75,.3)'
              : '0 2px 8px rgba(192,82,42,.3)',
          }}
          onMouseOver={e => {
            if (!loading)
              (e.currentTarget as HTMLButtonElement).style.background =
                success ? 'var(--success)' : 'var(--accent-hover)'
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              success ? 'var(--success)' : 'var(--accent)'
          }}
        >
          {loading ? (
            <>
              <span
                className="spinner"
                style={{
                  borderColor: 'rgba(255,255,255,.5)',
                  borderTopColor: '#fff',
                }}
              />
              Saving…
            </>
          ) : success ? (
            <>
              <CheckIcon />
              Saved!
            </>
          ) : (
            <>
              <PlusIcon />
              Save bookmark
            </>
          )}
        </button>
      </div>
    </form>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5"  y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}