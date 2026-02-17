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