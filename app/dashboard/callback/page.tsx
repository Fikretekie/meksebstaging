'use client'
import { useEffect } from 'react'

export default function CallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for Amplify to process the OAuth callback
        await new Promise(r => setTimeout(r, 2000))
        
        const { fetchUserAttributes } = await import('aws-amplify/auth')
        await fetchUserAttributes()
        
        // Clean URL and redirect to dashboard
        window.location.replace('/dashboard/index.html')
      } catch (err) {
        console.error('OAuth callback error:', err)
        // Retry after waiting longer
        await new Promise(r => setTimeout(r, 3000))
        window.location.replace('/dashboard/index.html')
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
      <div style={{width:40,height:40,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:'white'}}>M</div>
      Signing you in...
    </div>
  )
}