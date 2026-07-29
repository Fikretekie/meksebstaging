'use client'
import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

const ADMIN_EMAIL = 'fikretekietewe@gmail.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession()
        const payload = session.tokens?.idToken?.payload
        const email = (payload?.email) || ''
        if (email !== ADMIN_EMAIL) {
          window.location.href = '/dashboard/index.html'
          return
        }
        setAuthorized(true)
        loadStats()
      } catch (err) {
        window.location.href = '/auth/login/index.html'
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch("https://duv7vuo6z2.execute-api.us-east-1.amazonaws.com/admin")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a',color:'rgba(255,255,255,.5)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48,height:48,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:22,color:'white',margin:'0 auto 1rem'}}>M</div>
        Loading admin panel...
      </div>
    </div>
  )

  if (!authorized) return null

  const s = stats || {}
  const ses = s.ses || {}
  const stripe = s.stripe || {}
  const freeEmailsLeft = (ses.max24HourSend || 50000) - (ses.sentLast24Hours || 0)

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',padding:'1.5rem',maxWidth:'900px',margin:'0 auto'}}>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:44,height:44,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,color:'white'}}>M</div>
          <div>
            <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'white',margin:0}}>Mekseb Admin</h1>
            <p style={{color:'rgba(255,255,255,.4)',fontSize:'12px',margin:0}}>Platform management</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={loadStats} style={{fontSize:'12px',color:'#3b82f6',background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'8px',padding:'8px 12px',cursor:'pointer'}}>🔄 Refresh</button>
          <a href="/dashboard/index.html" style={{fontSize:'13px',color:'rgba(255,255,255,.6)',textDecoration:'none',padding:'8px 16px',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px'}}>← Dashboard</a>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'1.5rem'}}>
        <div style={{background:'linear-gradient(135deg,rgba(37,99,235,.2),rgba(37,99,235,.05))',border:'1px solid rgba(37,99,235,.3)',borderRadius:'16px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'4px'}}>👥</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,.5)',marginBottom:'4px'}}>Total Users</div>
          <div style={{fontSize:'32px',fontWeight:800,color:'#60a5fa'}}>{statsLoading ? '...' : s.totalUsers ?? '—'}</div>
          <div style={{fontSize:'11px',color:'#34d399',marginTop:'4px'}}>+{statsLoading ? '...' : s.newUsersThisWeek ?? 0} this week</div>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(16,185,129,.2),rgba(16,185,129,.05))',border:'1px solid rgba(16,185,129,.3)',borderRadius:'16px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'4px'}}>⭕</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,.5)',marginBottom:'4px'}}>Total Circles</div>
          <div style={{fontSize:'32px',fontWeight:800,color:'#34d399'}}>{statsLoading ? '...' : s.totalCircles ?? '—'}</div>
          <div style={{fontSize:'11px',color:'#34d399',marginTop:'4px'}}>{statsLoading ? '...' : s.activeCircles ?? 0} active</div>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.05))',border:'1px solid rgba(245,158,11,.3)',borderRadius:'16px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'4px'}}>💳</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,.5)',marginBottom:'4px'}}>Total Payments</div>
          <div style={{fontSize:'32px',fontWeight:800,color:'#fbbf24'}}>{statsLoading ? '...' : s.totalPayments ?? '—'}</div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginTop:'4px'}}>transactions</div>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(167,139,250,.2),rgba(167,139,250,.05))',border:'1px solid rgba(167,139,250,.3)',borderRadius:'16px',padding:'1.25rem'}}>
          <div style={{fontSize:'24px',marginBottom:'4px'}}>💰</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,.5)',marginBottom:'4px'}}>Total Saved</div>
          <div style={{fontSize:'32px',fontWeight:800,color:'#a78bfa'}}>${statsLoading ? '...' : s.totalSaved ?? '0'}</div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginTop:'4px'}}>across all circles</div>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem',marginBottom:'1.25rem'}}>
        <h2 style={{color:'white',fontSize:'0.9rem',fontWeight:600,marginBottom:'1rem'}}>💰 Stripe Revenue</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
          <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>This Month</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#34d399'}}>${statsLoading ? '...' : stripe.monthRevenue?.toFixed(2) ?? '0'}</div>
          </div>
          <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Payments This Month</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#34d399'}}>{statsLoading ? '...' : stripe.thisMonthPayments ?? '0'}</div>
          </div>
          <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Total Revenue</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#34d399'}}>${statsLoading ? '...' : stripe.totalRevenue?.toFixed(2) ?? '0'}</div>
          </div>
        </div>
        <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',marginTop:'12px',fontSize:'12px',color:'#60a5fa',textDecoration:'none'}}>View full Stripe dashboard →</a>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem',marginBottom:'1.25rem'}}>
        <h2 style={{color:'white',fontSize:'0.9rem',fontWeight:600,marginBottom:'1rem'}}>📧 SES Email Stats</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'12px'}}>
          <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Today</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#60a5fa'}}>{statsLoading ? '...' : ses.emailsSent24h ?? '0'}</div>
          </div>
          <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>This Week</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#60a5fa'}}>{statsLoading ? '...' : ses.emailsSentWeek ?? '0'}</div>
          </div>
          <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>This Month</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#60a5fa'}}>{statsLoading ? '...' : ses.emailsSentMonth ?? '0'}</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px'}}>
          <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Free Emails Left Today</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#34d399'}}>{statsLoading ? '...' : freeEmailsLeft}</div>
          </div>
          <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>Daily Limit</div>
            <div style={{fontSize:'20px',fontWeight:700,color:'#34d399'}}>{statsLoading ? '...' : ses.max24HourSend ?? '50000'}</div>
          </div>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem',marginBottom:'1.25rem'}}>
        <h2 style={{color:'white',fontSize:'0.9rem',fontWeight:600,marginBottom:'1rem'}}>📊 Google Analytics</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'10px',padding:'12px 16px',color:'#60a5fa',textDecoration:'none',fontSize:'13px',fontWeight:600,display:'block',textAlign:'center'}}>📈 View Real-time Users →</a>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'10px',padding:'12px 16px',color:'#60a5fa',textDecoration:'none',fontSize:'13px',fontWeight:600,display:'block',textAlign:'center'}}>📊 View Traffic Reports →</a>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem',marginBottom:'1.25rem'}}>
        <h2 style={{color:'white',fontSize:'0.9rem',fontWeight:600,marginBottom:'1rem'}}>⚡ Quick Links</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
          <a href="https://console.aws.amazon.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>AWS Console</a>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>Stripe Dashboard</a>
          <a href="https://github.com/Fikretekie/meksebstaging/actions" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>GitHub Actions</a>
          <a href="https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>DynamoDB</a>
          <a href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>CloudWatch</a>
          <a href="https://console.aws.amazon.com/ses/home?region=us-east-1" target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'12px',display:'block',textAlign:'center'}}>SES Emails</a>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
        <h2 style={{color:'white',fontSize:'0.9rem',fontWeight:600,marginBottom:'1rem'}}>🔧 Platform Info</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Production URL</span><span style={{color:'white',fontFamily:'monospace'}}>mekseb.com</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Staging URL</span><span style={{color:'white',fontFamily:'monospace'}}>staging.mekseb.com</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>API Gateway</span><span style={{color:'white',fontFamily:'monospace'}}>duv7vuo6z2</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}><span style={{color:'rgba(255,255,255,.4)'}}>Google Analytics</span><span style={{color:'white',fontFamily:'monospace'}}>G-XL2RFMHCBH</span></div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}><span style={{color:'rgba(255,255,255,.4)'}}>Stripe Account</span><span style={{color:'white',fontFamily:'monospace'}}>acct_1Ttr2AANylsYIlGK</span></div>
        </div>
      </div>

    </div>
  )
}