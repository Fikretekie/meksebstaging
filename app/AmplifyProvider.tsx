'use client'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_8G6ovLgND',
      userPoolClientId: '6khn8ieskhklp9d9kd41iutjf8',
      loginWith: {
        email: true,
        oauth: {
          domain: 'us-east-18g6ovlgnd.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['https://staging.mekseb.com/dashboard/index.html'],
          redirectSignOut: ['https://staging.mekseb.com/auth/login/index.html'],
          responseType: 'code',
        },
      },
    },
  },
})

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}