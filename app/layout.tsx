'use client'
import './globals.css'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_8G6ovLgND',
      userPoolClientId: '6khn8ieskhklp9d9kd41iutjf8',
      loginWith: {
        email: true,
      },
    },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}