'use client'
import BookmarkCard from './BookmarkCard'
import type { Bookmark } from '@/types'

interface Props {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
  userId: string
}

export default function BookmarkList({ bookmarks, onDelete, userId }: Props) {

  // ── Empty state ──────────────────────────────────────────────────────
  if (bookmarks.length === 0) {
    return (
      <div
        className="text-center py-16 rounded-2xl animate-fade-in"
        style={{
          border: '2px dashed var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        <div className="mb-4 flex justify-center opacity-30">
          <EmptyIllustration />
        </div>
        <p
          className="font-display italic text-xl mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          No bookmarks yet
        </p>
        <p className="text-sm">
          Paste a URL above and give it a title to get started.
        </p>
      </div>
    )
  }

  // ── Bookmark list ────────────────────────────────────────────────────
  return (
    <ul className="flex flex-col gap-3">
      {bookmarks.map((bookmark, idx) => (
        <li
          key={bookmark.id}
          className="animate-bookmark-in"
          // Stagger each card's entrance animation by 30ms
          style={{ animationDelay: `${idx * 30}ms` }}
        >
          <BookmarkCard
            bookmark={bookmark}
            onDelete={onDelete}
            isOwner={bookmark.user_id === userId}
          />
        </li>
      ))}
    </ul>
  )
}

// ── Empty state SVG illustration ──────────────────────────────────────────
function EmptyIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect
        x="10" y="8" width="40" height="52"
        rx="4" fill="currentColor" opacity=".15"
      />
      <rect
        x="20" y="18" width="40" height="52"
        rx="4" fill="currentColor" opacity=".25"
      />
      <path
        d="M28 36h24M28 44h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}