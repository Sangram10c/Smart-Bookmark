// Login page — Server Component
// Checks if already authenticated → redirect to dashboard
// Otherwise renders the LoginCard client component

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginCard from '@/components/LoginCard'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Already logged in — skip the login screen
  if (user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginCard />
    </main>
  )
}