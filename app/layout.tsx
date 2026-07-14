import type { Metadata } from 'next'
import './globals.css'
import AmplifyProvider from './AmplifyProvider'

export const metadata: Metadata = {
  title: 'Mekseb — Save together. Grow together.',
  description: 'The modern platform for community savings circles.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  )
}