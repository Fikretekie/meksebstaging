'use client'
import { useEffect, useState } from 'react'

export default function CallbackPage() {
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing Google login...')
        
        // Give Amplify time to process the OAuth code
        let attempts = 0
        const maxAttempts = 10
        
        while (attempts < maxAttempts) {
          try {
            const { fetchUserAttributes } = await import('aws-amplify/auth')
            const attributes = await fetchUserAttributes()
            if (attributes.email) {
              setStatus('Success! Redirecting...')
              window.location.replace('/dashboard/index.html')
              return
            }
          } catch (e) {
            attempts++
            await new Promise(r => setTimeout(r, 1000))
          }
        }
        
        // If all attempts fail, go to login
        window.location.replace('/auth/login/index.html')
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