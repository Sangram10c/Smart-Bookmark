// Bookmarks API Route Handlers
//
// POST   /api/bookmarks        → create a new bookmark
// DELETE /api/bookmarks?id=... → delete a bookmark by id
//
// Each handler:
//   1. Verifies the user is authenticated (server-side JWT validation)
//   2. Validates the request
//   3. Runs the DB mutation (RLS enforces ownership at the Postgres level)
//   4. Returns JSON

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ── POST — create a bookmark ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { url, title } = body as { url?: string; title?: string }

    // Validate required fields
    if (!url || !title) {
      return NextResponse.json(
        { error: 'url and title are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Insert into database
    // RLS policy "Users can insert own bookmarks" enforces user_id = auth.uid()
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        url: url.trim(),
        title: title.trim(),
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookmark: data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/bookmarks error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE — remove a bookmark ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get bookmark id from query string: DELETE /api/bookmarks?id=<uuid>
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id query param is required' },
        { status: 400 }
      )
    }

    // Delete the row
    // The .eq('user_id', user.id) is belt-and-suspenders on top of RLS
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/bookmarks error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}