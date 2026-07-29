'use client'
import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

const ADMIN_EMAIL = 'fikretekietewe@gmail.com'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession()
        const payload = session.tokens?.idToken?.payload
        const email = (payload?.email as string) || ''
        if (email !== ADMIN_EMAIL) {
          window.location.href = '/dashboard/index.html'
          return
        }
        setAuthorized(true)
      } catch (err) {
        window.location.href = '/auth/login/index.html'
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a',color:'rgba(255,255,255,.5)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48,height:48,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:22,color:'white',margin:'0 auto 1rem'}}>M</div>
        Loading admin panel...
      </div>
    </div>
  )

  if (!authorized) return null

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',padding:'2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:40,height:40,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:'white'}}>M</div>
          <div>
            <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'white',margin:0}}>Mekseb Admin</h1>
            <p style={{color:'rgba(255,255,255,.4)',fontSize:'13px',margin:0}}>Platform management dashboard</p>
          </div>
        </div>
        <a href="/dashboard/index.html" style={{fontSize:'13px',color:'#3b82f6',textDecoration:'none'}}>Back to dashboard</a>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'2rem'}}>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'8px'}}>👥</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Total Users</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#60a5fa'}}>coming soon</div>
        </div>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'8px'}}>⭕</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Total Circles</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#34d399'}}>coming soon</div>
        </div>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'8px'}}>💳</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Total Payments</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#fbbf24'}}>coming soon</div>
        </div>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'8px'}}>💰</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Total Saved</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#a78bfa'}}>coming soon</div>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem',marginBottom:'2rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>Google Analytics</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'10px',padding:'12px 16px',color:'#60a5fa',textDecoration:'none',fontSize:'13px',fontWeight:600,display:'block',textAlign:'center'}}>View Real-time Users</a>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'10px',padding:'12px 16px',color:'#60a5fa',textDecoration:'none',fontSize:'13px',fontWeight:600,display:'block',textAlign:'center'}}>View Traffic Reports</a>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem',marginBottom:'2rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>Quick Links</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <a href="https://console.aws.amazon.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px 16px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',display:'block',textAlign:'center'}}>AWS Console</a>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px 16px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',display:'block',textAlign:'center'}}>Stripe Dashboard</a>
          <a href="https://github.com/Fikretekie/meksebstaging/actions" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px 16px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',display:'block',textAlign:'center'}}>GitHub Actions</a>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>Platform Info</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Production URL</span><span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>mekseb.com</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Staging URL</span><span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>staging.mekseb.com</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>API Gateway</span><span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>duv7vuo6z2</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Google Analytics</span><span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>G-XL2RFMHCBH</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}><span style={{color:'rgba(255,255,255,.4)'}}>Stripe Account</span><span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>acct_1Ttr2AANylsYIlGK</span></div>
        </div>
      </div>
    </div>
  )
}
