'use client'
import { useEffect, useState } from 'react'

export default function CallbackPage() {
  const [status, setStatus] = useState('Completing sign in...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing...')
        const { Hub } = await import('aws-amplify/utils')

        let resolved = false

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
          console.log('Auth event:', payload.event)
          if (payload.event === 'signedIn' && !resolved) {
            resolved = true
            unsubscribe()
            setStatus('Success! Redirecting...')
            setTimeout(() => {
              window.location.replace('/dashboard/index.html')
            }, 500)
          }
          if (payload.event === 'signInWithRedirect_failure' && !resolved) {
            resolved = true
            unsubscribe()
            window.location.replace('/auth/login/index.html')
          }
        })

        // Try getCurrentUser after delay
        setTimeout(async () => {
          if (!resolved) {
            try {
              const { getCurrentUser } = await import('aws-amplify/auth')
              await getCurrentUser()
              resolved = true
              unsubscribe()
              setStatus('Success! Redirecting...')
              window.location.replace('/dashboard/index.html')
            } catch (e) {
              console.log('getCurrentUser failed:', e)
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