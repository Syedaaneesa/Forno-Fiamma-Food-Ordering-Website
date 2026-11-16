import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Forno & Fiamma | Crafted by Fire',
  description: 'Authentic wood-fired Neapolitan pizza, handcrafted in Brooklyn.',
  icons: { icon: '/images/hero.png' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
