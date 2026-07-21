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
          const { fetchAuthSession } = await import('aws-amplify/auth')
          
          // Retry up to 8 times with 1.5s delay
          for (let i = 0; i < 8; i++) {
            try {
              const session = await fetchAuthSession()
              if (!session.tokens) {
                await new Promise(r => setTimeout(r, 1500))
                continue
              }

              const payload = session.tokens.idToken?.payload
              const userId = payload?.sub as string

              setStatus('Checking your profile...')

              try {
                const res = await fetch(`${API_URL}/users?userId=${userId}`)
                const data = await res.json()

                if (data.user && data.user.firstName) {
                  setStatus('Welcome back! Redirecting...')
                  window.location.replace('/dashboard/index.html')
                } else {
                  setStatus('Setting up your account...')
                  window.location.replace('/onboarding/index.html')
                }
                return
              } catch (e) {
                window.location.replace('/dashboard/index.html')
                return
              }
            } catch (e) {
              console.log(`Attempt ${i + 1} failed:`, e)
              await new Promise(r => setTimeout(r, 1500))
            }
          }
          throw new Error('All attempts failed')
        }

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
          console.log('Auth event:', payload.event)
          if (payload.event === 'signedIn' && !resolved) {
            resolved = true
            unsubscribe()
            setStatus('Signed in!')
            checkProfileAndRedirect().catch(() => {
              window.location.replace('/dashboard/index.html')
            })
          }
          if (payload.event === 'signInWithRedirect_failure' && !resolved) {
            resolved = true
            unsubscribe()
            window.location.replace('/auth/login/index.html')
          }
        })

        // Try after 2 second delay
        setTimeout(async () => {
          if (!resolved) {
            try {
              await checkProfileAndRedirect()
              resolved = true
              unsubscribe()
            } catch (e) {
              console.log('All retries failed:', e)
            }
          }
        }, 2000)

        // Final fallback after 15 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true
            unsubscribe()
            window.location.replace('/dashboard/index.html')
          }
        }, 15000)

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