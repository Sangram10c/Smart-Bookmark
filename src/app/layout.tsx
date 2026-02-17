// Root Layout — wraps every page
// Loads Google Fonts: Instrument Serif (display) + DM Mono (body)
// Injects them as CSS variables: --font-display and --font-mono

import type { Metadata } from 'next'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import './globals.css'

// Elegant serif for headings and the wordmark
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

// Monospace for body text — gives a "developer notebook" feel
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Markd — Smart Bookmarks',
  description: 'A beautiful, real-time bookmark manager powered by Supabase.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}