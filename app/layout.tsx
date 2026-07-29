import type { Metadata } from 'next'
import './globals.css'
import AmplifyProvider from './AmplifyProvider'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Mekseb — Save together. Grow together.',
  description: 'The modern platform for community savings circles.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XL2RFMHCBH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XL2RFMHCBH');
          `}
        </Script>
      </head>
      <body>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  )
}