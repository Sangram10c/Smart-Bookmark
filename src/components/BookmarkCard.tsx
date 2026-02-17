'use client'
// Single bookmark row component
//
// Displays:
//   • Favicon (Google's public favicon API)
//   • Title (clickable link → opens in new tab)
//   • Truncated URL + relative timestamp
//   • On hover: External-link icon + Delete button (owner only)
//
// Delete flow:
//   1. Optimistically calls onDelete() to remove from state immediately
//   2. Fires DELETE /api/bookmarks?id=<id> in background
//   Realtime DELETE event arrives shortly after and is handled idempotently

import { useState } from 'react'
import type { Bookmark } from '@/types'

interface Props {
  bookmark: Bookmark
  onDelete: (id: string) => void
  isOwner: boolean
}

// Intl.RelativeTimeFormat — produces strings like "3 minutes ago"
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

function relativeTime(dateStr: string): string {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 1000
  if (Math.abs(diff) < 60)    return rtf.format(Math.round(diff), 'seconds')
  if (Math.abs(diff) < 3600)  return rtf.format(Math.round(diff / 60), 'minutes')
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hours')
  return rtf.format(Math.round(diff / 86400), 'days')
}

// Returns a URL for the site's favicon via Google's public favicon service
function getFavicon(url: string): string {
  try {
    const u = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`
  } catch {
    return ''
  }
}

export default function BookmarkCard({ bookmark, onDelete, isOwner }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [imgError, setImgError] = useState(false)

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)

    // 1. Remove from UI immediately (optimistic)
    onDelete(bookmark.id)

    // 2. Fire the actual delete request
    try {
      await fetch(`/api/bookmarks?id=${bookmark.id}`, { method: 'DELETE' })
    } catch {
      // Silently fail — item already removed from optimistic UI
    }
  }

  // Build a clean display URL (hostname + pathname, no protocol)
  const favicon = getFavicon(bookmark.url)
  let displayUrl: string
  try {
    const u = new URL(bookmark.url)
    displayUrl =
      u.hostname.replace(/^www\./, '') +
      (u.pathname !== '/' ? u.pathname : '')
  } catch {
    displayUrl = bookmark.url
  }

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150"
      style={{
        background:   hovered ? '#fff' : 'var(--bg-card)',
        border:       `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        boxShadow:    hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Favicon ─────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        {favicon && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            width={16}
            height={16}
            onError={() => setImgError(true)}
          />
        ) : (
          <GlobeIcon />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Title — links to URL in new tab */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium truncate transition-colors duration-100"
          style={{ color: hovered ? 'var(--accent)' : 'var(--text-primary)' }}
          title={bookmark.title}
        >
          {bookmark.title}
        </a>

        {/* URL + relative timestamp */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs truncate max-w-[200px]"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {displayUrl}
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span
            className="text-xs flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            {relativeTime(bookmark.created_at)}
          </span>
        </div>
      </div>

      {/* ── Action buttons (visible on hover) ────────────────────────── */}
      <div className="flex items-center gap-1 flex-shrink-0">

        {/* External link button */}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg transition-all duration-100"
            style={{
              color: 'var(--text-muted)',
              opacity: hovered ? 1 : 0,
              background: 'transparent',
            }}
            title="Open link"
            onMouseOver={e => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                'var(--accent-soft)'
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--accent)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                'transparent'
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--text-muted)'
            }}
          >
            <ExternalLinkIcon />
          </a>

        {/* Delete button — only shown to the bookmark owner */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg transition-all duration-100 disabled:opacity-40"
            style={{
              color: 'var(--text-muted)',
              opacity: hovered ? 1 : 0,
              background: 'transparent',
            }}
            title="Delete bookmark"
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'var(--danger-soft)'
              ;(e.currentTarget as HTMLButtonElement).style.color =
                'var(--danger)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color =
                'var(--text-muted)'
            }}
          >
            {deleting ? (
              <span
                className="spinner"
                style={{ width: 12, height: 12 }}
              />
            ) : (
              <TrashIcon />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'var(--text-muted)' }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  )
}

function ExternalLinkIcon() {
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
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function TrashIcon() {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}