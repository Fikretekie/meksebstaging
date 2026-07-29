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

  const statsCards = [
    { label:'Total Users', value:'—', icon:'👥', color:'#60a5fa' },
    { label:'Total Circles', value:'—', icon:'⭕', color:'#34d399' },
    { label:'Total Payments', value:'—', icon:'💳', color:'#fbbf24' },
    { label:'Total Saved', value:'—', icon:'💰', color:'#a78bfa' },
  ]

  const analyticsLinks = [
    { label:'View Real-time Users', url:'https://analytics.google.com' },
    { label:'View Traffic Reports', url:'https://analytics.google.com' },
    { label:'View Conversions', url:'https://analytics.google.com' },
  ]

  const quickLinks = [
    { label:'AWS Console', url:'https://console.aws.amazon.com' },
    { label:'Stripe Dashboard', url:'https://dashboard.stripe.com' },
    { label:'GitHub Actions', url:'https://github.com/Fikretekie/meksebstaging/actions' },
    { label:'DynamoDB', url:'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items' },
    { label:'CloudWatch Logs', url:'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1' },
    { label:'SES Emails', url:'https://console.aws.amazon.com/ses/home?region=us-east-1' },
  ]

  const platformInfo = [
    { label:'Production URL', value:'mekseb.com' },
    { label:'Staging URL', value:'staging.mekseb.com' },
    { label:'API Gateway', value:'duv7vuo6z2' },
    { label:'DynamoDB Table', value:'mekseb-staging' },
    { label:'Cognito Pool', value:'us-east-1_8G6ovLgND' },
    { label:'Google Analytics', value:'G-XL2RFMHCBH' },
    { label:'Stripe Account', value:'acct_1Ttr2AANylsYIlGK' },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',padding:'2rem'}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:40,height:40,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:'white'}}>M</div>
          <div>
            <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'white',margin:0}}>Mekseb Admin</h1>
            <p style={{color:'rgba(255,255,255,.4)',fontSize:'13px',margin:0}}>Platform management dashboard</p>
          </div>
        </div>
        <a href="/dashboard/index.html" style={{fontSize:'13px',color:'#3b82f6',textDecoration:'none'}}>← Back to dashboard</a>
      </div>

      {/* Stats Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'2rem'}}>
        {statsCards.map(stat => (
          <div key={stat.label} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.25rem'}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{stat.icon}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>{stat.label}</div>
            <div style={{fontSize:'24px',fontWeight:700,color:stat.color}}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Google Analytics */}
      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem',marginBottom:'2rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>📊 Google Analytics</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px'}}>
          {analyticsLinks.map(link => (
            
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'10px',padding:'12px 16px',color:'#60a5fa',textDecoration:'none',fontSize:'13px',fontWeight:600,display:'block',textAlign:'center'}}
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem',marginBottom:'2rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>⚡ Quick Links</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px'}}>
          {quickLinks.map(link => (
            
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'10px',padding:'12px 16px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',fontWeight:500,display:'block',textAlign:'center'}}
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>

      {/* Platform Info */}
      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'14px',padding:'1.5rem'}}>
        <h2 style={{color:'white',fontSize:'1rem',fontWeight:600,marginBottom:'1rem'}}>🔧 Platform Info</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
          {platformInfo.map(info => (
            <div key={info.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{color:'rgba(255,255,255,.4)'}}>{info.label}</span>
              <span style={{color:'white',fontFamily:'monospace',fontSize:'12px'}}>{info.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}