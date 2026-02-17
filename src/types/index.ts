// Shared TypeScript type definitions used across the entire app

export interface Bookmark {
  id: string
  user_id: string
  url: string
  title: string
  created_at: string
}

export interface BookmarkInsert {
  url: string
  title: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
}