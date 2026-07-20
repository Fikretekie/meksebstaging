'use client'
import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CallbackPage() {
  const [status, setStatus] = useState('Completing sign in...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing...')
        const { Hub } = await import('aws-amplify/utils')

        let resolved = false

        const checkProfileAndRedirect = async () => {
          try {
            const { fetchAuthSession } = await import('aws-amplify/auth')
            const session = await fetchAuthSession()

            if (!session.tokens) throw new Error('No tokens')

            const payload = session.tokens.idToken?.payload
            const userId = payload?.sub as string
            const email = payload?.email as string

            setStatus('Checking your profile...')

            // Check if user has a profile in DynamoDB
            try {
              const res = await fetch(`${API_URL}/users?userId=${userId}`)
              const data = await res.json()

              if (data.user && data.user.firstName) {
                // Existing user with profile → go to dashboard
                setStatus('Welcome back! Redirecting...')
                window.location.replace('/dashboard/index.html')
              } else {
                // New Google user → go to onboarding
                setStatus('Setting up your account...')
                window.location.replace('/onboarding/index.html')
              }
            } catch (e) {
              // If API fails, just go to dashboard
              window.location.replace('/dashboard/index.html')
            }
          } catch (e) {
            console.log('Session error:', e)
            throw e
          }
        }

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
          console.log('Auth event:', payload.event)
          if (payload.event === 'signedIn' && !resolved) {
            resolved = true
            unsubscribe()
            setStatus('Signed in!')
            checkProfileAndRedirect()
          }
          if (payload.event === 'signInWithRedirect_failure' && !resolved) {
            resolved = true
            unsubscribe()
            window.location.replace('/auth/login/index.html')
          }
        })

        // Try after delay
        setTimeout(async () => {
          if (!resolved) {
            try {
              await checkProfileAndRedirect()
              resolved = true
              unsubscribe()
            } catch (e) {
              console.log('Retry failed:', e)
            }
          }
        }, 3000)

        // Final fallback after 10 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true
            unsubscribe()
            window.location.replace('/dashboard/index.html')
          }
        }, 10000)

      } catch (err) {
        console.error('Callback error:', err)
        window.location.replace('/auth/login/index.html')
      }
    }
    handleCallback()
  }, [])

  return (
    <div style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      minHeight:'100vh',
      background:'#060d1a',
      color:'rgba(255,255,255,.5)',
      flexDirection:'column',
      gap:'1rem',
    }}>
      <div style={{
        width:48,
        height:48,
        background:'linear-gradient(135deg,#2563eb,#06b6d4)',
        borderRadius:12,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontWeight:800,
        fontSize:22,
        color:'white',
        marginBottom:'0.5rem',
      }}>M</div>
      <div style={{fontSize:'16px',fontWeight:600,color:'white'}}>{status}</div>
      <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)'}}>Please wait...</div>
    </div>
  )
}