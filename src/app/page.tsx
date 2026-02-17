// Root page — Server Component
// 1. Reads the current session from the server Supabase client
// 2. Fetches user's initial bookmarks (RLS ensures privacy)
// 3. Passes data to BookmarkDashboard (Client Component)
// Middleware already guards this route, but we re-check to get the user object

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookmarkDashboard from '@/components/BookmarkDashboard'
import type { Bookmark } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  // Re-verify auth (middleware is belt, this is suspenders)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch initial bookmarks server-side so first paint is data-rich
  // RLS on the bookmarks table ensures we only get rows for this user
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (bookmarksError) {
    console.error('Error fetching bookmarks:', bookmarksError.message)
  }

  return (
    <BookmarkDashboard
      user={user}
      initialBookmarks={(bookmarks as Bookmark[]) ?? []}
    />
  )
}