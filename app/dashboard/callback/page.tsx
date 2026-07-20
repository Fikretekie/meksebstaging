'use client'
import { useEffect, useState } from 'react'

export default function CallbackPage() {
  const [status, setStatus] = useState('Completing sign in...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { Hub } = await import('aws-amplify/utils')
        const { fetchAuthSession } = await import('aws-amplify/auth')

        // Listen for auth events
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
          console.log('Auth event:', payload.event)
          if (payload.event === 'signedIn') {
            setStatus('Signed in! Redirecting...')
            unsubscribe()
            window.location.replace('/dashboard/index.html')
          }
          if (payload.event === 'signIn_failure') {
            setStatus('Sign in failed. Redirecting...')
            unsubscribe()
            window.location.replace('/auth/login/index.html')
          }
        })

        // Trigger session fetch which completes OAuth exchange
        setStatus('Processing authentication...')
        try {
          const session = await fetchAuthSession()
          console.log('Session:', session)
          if (session.tokens) {
            setStatus('Success! Redirecting...')
            window.location.replace('/dashboard/index.html')
            return
          }
        } catch (e) {
          console.log('Session error:', e)
        }

        // Fallback - redirect after 8 seconds
        setTimeout(() => {
          window.location.replace('/dashboard/index.html')
        }, 8000)

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