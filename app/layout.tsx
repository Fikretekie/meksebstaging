import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Mekseb — Save together. Grow together.',
  description: 'The modern platform for community savings circles. Pool money, build wealth, invest in your shared future.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
