'use client'
import { Amplify } from 'aws-amplify'

const isProd = typeof window !== 'undefined' && window.location.hostname === 'mekseb.com'

const redirectSignIn = isProd
  ? 'https://mekseb.com/callback/index.html'
  : 'https://staging.mekseb.com/callback/index.html'

const redirectSignOut = isProd
  ? 'https://mekseb.com/auth/login/index.html'
  : 'https://staging.mekseb.com/auth/login/index.html'

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
          redirectSignIn: [redirectSignIn],
          redirectSignOut: [redirectSignOut],
          responseType: 'code',
        },
      },
    },
  },
})

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}