'use client'
// Main dashboard — Client Component
//
// Responsibilities:
//   • Sticky header: logo, user avatar, sign-out button
//   • Renders AddBookmarkForm and BookmarkList
//   • Subscribes to Supabase Realtime so any INSERT or DELETE on the
//     bookmarks table is pushed to ALL open tabs for this user instantly
//
// Real-time architecture:
//   supabase.channel('bookmarks-<userId>')
//     .on('postgres_changes', { event: 'INSERT', filter: `user_id=eq.<id>` })
//     .on('postgres_changes', { event: 'DELETE', filter: `user_id=eq.<id>` })
//     .subscribe()
//
// The filter ensures only THIS user's events come through.
// Supabase RLS enforces the same constraint server-side.

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import AddBookmarkForm from './AddBookmarkForm'
import BookmarkList from './BookmarkList'
import type { Bookmark } from '@/types'

interface Props {
  user: User
  initialBookmarks: Bookmark[]
}

export default function BookmarkDashboard({ user, initialBookmarks }: Props) {
  const [bookmarks, setBookmarks]         = useState<Bookmark[]>(initialBookmarks)
  const [signOutLoading, setSignOutLoading] = useState(false)

  const supabase = createClient()

  // ── Realtime subscription ─────────────────────────────────────────────
  useEffect(() => {
    // Named channel scoped to this user prevents cross-user event leakage
    const channel = supabase
      .channel(`bookmarks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            const incoming = payload.new as Bookmark
            // Dedup: the tab that did the INSERT may have already added it
            // optimistically — don't show it twice
            if (prev.some((b) => b.id === incoming.id)) return prev
            return [incoming, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== (payload.old as Bookmark).id)
          )
        }
      )
      .subscribe()

    // Cleanup subscription on unmount — prevents memory leaks
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Optimistic add ────────────────────────────────────────────────────
  // Called by AddBookmarkForm after a successful POST /api/bookmarks
  // Adds the bookmark to local state immediately for a snappy UX
  // The Realtime echo arrives shortly after; dedup check above prevents duplicates
  const handleAdd = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev
      return [bookmark, ...prev]
    })
  }, [])

  // ── Optimistic delete ─────────────────────────────────────────────────
  // Removes from UI immediately; Realtime DELETE echo is handled idempotently
  const handleDelete = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────
  async function handleSignOut() {
    setSignOutLoading(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const avatarUrl   = user.user_metadata?.avatar_url as string | undefined
  const displayName =
    (user.user_metadata?.full_name as string) ??
    user.email?.split('@')[0] ??
    'User'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Sticky Header ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 px-4 py-3"
        style={{
          background: 'rgba(247,244,239,.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <BookmarkIcon />
            </div>
            <span
              className="font-display text-2xl italic"
              style={{ color: 'var(--text-primary)' }}
            >
              Markd
            </span>
          </div>

          {/* User info + sign-out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={28}
                  height={28}
                  className="rounded-full"
                  style={{ border: '1px solid var(--border)' }}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {displayName[0].toUpperCase()}
                </div>
              )}
              <span
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {displayName}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signOutLoading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                background: 'transparent',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--border)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'transparent'
              }}
            >
              {signOutLoading ? (
                <span
                  className="spinner"
                  style={{ width: 12, height: 12 }}
                />
              ) : (
                <SignOutIcon />
              )}
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Page heading */}
        <div className="mb-8 animate-slide-up">
          <h2
            className="font-display text-3xl italic mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Your bookmarks
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {bookmarks.length === 0
              ? 'Nothing saved yet — add your first link below.'
              : `${bookmarks.length} saved link${bookmarks.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Add bookmark form */}
        <div className="mb-8">
          <AddBookmarkForm onAdd={handleAdd} />
        </div>

        {/* Bookmark list */}
        <BookmarkList
          bookmarks={bookmarks}
          onDelete={handleDelete}
          userId={user.id}
        />
      </main>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────

function BookmarkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}