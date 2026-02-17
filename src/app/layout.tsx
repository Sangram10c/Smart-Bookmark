

import type { Metadata } from 'next'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import './globals.css'


const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})


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