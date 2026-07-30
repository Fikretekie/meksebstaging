'use client'
import { useEffect, useState, useCallback } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

const ADMIN_EMAIL = 'fikretekietewe@gmail.com'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [tab, setTab] = useState('overview')

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await fetch('https://duv7vuo6z2.execute-api.us-east-1.amazonaws.com/admin')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

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
      } catch {
        window.location.href = '/auth/login/index.html'
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (authorized) loadStats()
  }, [authorized, loadStats])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f8fafc'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48,height:48,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:22,color:'white',margin:'0 auto 1rem'}}>M</div>
        <p style={{color:'#64748b',fontSize:14}}>Loading...</p>
      </div>
    </div>
  )

  if (!authorized) return null

  const s = stats || {}
  const ses = s.ses || {}
  const stripe = s.stripe || {}
  const emailsLeft = Math.max(0, (ses.max24HourSend || 50000) - (ses.sentLast24Hours || 0))
  const emailPct = Math.min(100, ((ses.sentLast24Hours || 0) / (ses.max24HourSend || 50000)) * 100)

  const tabs = ['overview', 'revenue', 'emails', 'links']

  const tabBtn = (name: string) => ({
    fontSize: 12,
    padding: '4px 14px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer' as const,
    fontWeight: tab === name ? 600 : 400,
    background: tab === name ? '#2563eb' : 'transparent',
    color: tab === name ? 'white' : '#64748b',
    textTransform: 'capitalize' as const,
  })

  const card = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '1rem',
  }

  return (
    <div style={{minHeight:'100vh',background:'#f1f5f9',fontFamily:'system-ui,sans-serif'}}>

      {/* Top Nav */}
      <div style={{background:'white',borderBottom:'1px solid #e2e8f0',padding:'0 1.5rem',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:52}}>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:28,height:28,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'white'}}>M</div>
              <span style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>Admin</span>
              <span style={{fontSize:11,background:'#dcfce7',color:'#16a34a',padding:'2px 8px',borderRadius:100}}>live</span>
            </div>
            <nav style={{display:'flex',gap:2}}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={tabBtn(t)}>{t}</button>
              ))}
            </nav>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:11,color:'#94a3b8'}}>July 29, 2026</span>
            <button onClick={loadStats} disabled={statsLoading} style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid #e2e8f0',background:'white',color:'#475569',cursor:'pointer'}}>
              {statsLoading ? '...' : '↻ Refresh'}
            </button>
            <a href="/dashboard/index.html" style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid #e2e8f0',color:'#475569',textDecoration:'none'}}>← Dashboard</a>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'1.5rem'}}>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
              {[
                { label:'Users', value: s.totalUsers ?? 0, sub: `+${s.newUsersThisWeek ?? 0} this week`, borderColor:'#2563eb', valueColor:'#2563eb', icon:'👥' },
                { label:'Circles', value: s.totalCircles ?? 0, sub: `${s.activeCircles ?? 0} active`, borderColor:'#10b981', valueColor:'#10b981', icon:'⭕' },
                { label:'Revenue', value: `$${(stripe.monthRevenue || 0).toFixed(2)}`, sub: 'this month', borderColor:'#f59e0b', valueColor:'#d97706', icon:'💰' },
                { label:'Emails today', value: ses.emailsSent24h ?? 0, sub: `${emailsLeft.toLocaleString()} left`, borderColor:'#8b5cf6', valueColor:'#8b5cf6', icon:'📧' },
              ].map(c => (
                <div key={c.label} style={{...card, borderTop:`2px solid ${c.borderColor}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                    <span style={{fontSize:11,color:'#64748b',textTransform:'uppercase' as const,letterSpacing:'.5px'}}>{c.label}</span>
                    <span style={{fontSize:16}}>{c.icon}</span>
                  </div>
                  <div style={{fontSize:28,fontWeight:700,color:c.valueColor,marginBottom:4}}>{statsLoading ? '...' : c.value}</div>
                  <div style={{fontSize:11,color:'#64748b'}}>{c.sub}</div>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{...card, borderTop:'2px solid #10b981'}}>
                <p style={{fontSize:12,fontWeight:600,color:'#475569',margin:'0 0 12px'}}>💰 Stripe this month</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10}}>
                  {[
                    { label:'Revenue', value:'$' + (stripe.monthRevenue || 0).toFixed(2) },
                    { label:'Payments', value: String(stripe.thisMonthPayments || 0) },
                    { label:'Total ever', value:'$' + (stripe.totalRevenue || 0).toFixed(2) },
                  ].map(item => (
                    <div key={item.label} style={{textAlign:'center' as const}}>
                      <div style={{fontSize:18,fontWeight:700,color:'#10b981'}}>{statsLoading ? '...' : item.value}</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center' as const,fontSize:11,color:'#2563eb',textDecoration:'none'}}>Open Stripe →</a>
              </div>

              <div style={{...card, borderTop:'2px solid #2563eb'}}>
                <p style={{fontSize:12,fontWeight:600,color:'#475569',margin:'0 0 12px'}}>📧 Email quota</p>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:6}}>
                  <span style={{color:'#64748b'}}>{ses.sentLast24Hours || 0} used today</span>
                  <span style={{color:'#0f172a',fontWeight:600}}>{emailsLeft.toLocaleString()} left</span>
                </div>
                <div style={{height:6,background:'#e2e8f0',borderRadius:100,overflow:'hidden',marginBottom:10}}>
                  <div style={{height:'100%',width:`${emailPct}%`,background:'linear-gradient(90deg,#2563eb,#06b6d4)',borderRadius:100}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                  {[
                    { label:'Today', value: ses.emailsSent24h || 0 },
                    { label:'Week', value: ses.emailsSentWeek || 0 },
                    { label:'Month', value: ses.emailsSentMonth || 0 },
                  ].map(item => (
                    <div key={item.label} style={{textAlign:'center' as const}}>
                      <div style={{fontSize:16,fontWeight:700,color:'#2563eb'}}>{statsLoading ? '...' : item.value}</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:'center' as const,marginTop:8,fontSize:10,color:'#16a34a'}}>✓ Production · 50,000/day limit</div>
              </div>
            </div>

            <div style={card}>
              <p style={{fontSize:12,fontWeight:600,color:'#475569',margin:'0 0 12px'}}>🔧 Platform info</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'4px 24px',fontSize:12}}>
                {[
                  { label:'Production', value:'mekseb.com' },
                  { label:'Google Analytics', value:'G-XL2RFMHCBH' },
                  { label:'Staging', value:'staging.mekseb.com' },
                  { label:'Stripe account', value:'acct_1Ttr2AANylsYIlGK' },
                  { label:'API Gateway', value:'duv7vuo6z2' },
                  { label:'DynamoDB', value:'mekseb-staging' },
                ].map(info => (
                  <div key={info.label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f1f5f9'}}>
                    <span style={{color:'#64748b'}}>{info.label}</span>
                    <span style={{color:'#0f172a',fontFamily:'monospace',fontSize:11}}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {tab === 'revenue' && (
          <div style={card}>
            <h2 style={{color:'#0f172a',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>💰 Stripe revenue</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
              {[
                { label:'This month', value:'$'+(stripe.monthRevenue||0).toFixed(2), color:'#10b981' },
                { label:'Payments this month', value: String(stripe.thisMonthPayments||0), color:'#2563eb' },
                { label:'Total revenue', value:'$'+(stripe.totalRevenue||0).toFixed(2), color:'#8b5cf6' },
              ].map(item => (
                <div key={item.label} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'1rem',textAlign:'center' as const}}>
                  <div style={{fontSize:11,color:'#64748b',marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:28,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center' as const,padding:'12px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:10,color:'#2563eb',textDecoration:'none',fontSize:13,fontWeight:600}}>Open Stripe Dashboard →</a>
          </div>
        )}

        {/* Emails Tab */}
        {tab === 'emails' && (
          <div style={card}>
            <h2 style={{color:'#0f172a',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>📧 SES email stats</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
              {[
                { label:'Sent today', value: ses.emailsSent24h||0, color:'#2563eb' },
                { label:'Sent this week', value: ses.emailsSentWeek||0, color:'#2563eb' },
                { label:'Sent this month', value: ses.emailsSentMonth||0, color:'#2563eb' },
                { label:'Used today', value: ses.sentLast24Hours||0, color:'#f59e0b' },
                { label:'Remaining today', value: emailsLeft.toLocaleString(), color:'#10b981' },
                { label:'Daily limit', value: (ses.max24HourSend||50000).toLocaleString(), color:'#10b981' },
              ].map(item => (
                <div key={item.label} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'1rem',textAlign:'center' as const}}>
                  <div style={{fontSize:11,color:'#64748b',marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:28,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center' as const,fontSize:12,color:'#16a34a',padding:'10px',background:'#f0fdf4',borderRadius:8,border:'1px solid #bbf7d0'}}>
              ✓ SES production mode · {ses.maxSendRate||14} emails/second
            </div>
          </div>
        )}

        {/* Links Tab */}
        {tab === 'links' && (
          <div style={card}>
            <h2 style={{color:'#0f172a',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>⚡ Quick links</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
              {[
                { label:'AWS Console', url:'https://console.aws.amazon.com', desc:'Manage all AWS services' },
                { label:'Stripe Dashboard', url:'https://dashboard.stripe.com', desc:'Payments and revenue' },
                { label:'GitHub Actions', url:'https://github.com/Fikretekie/meksebstaging/actions', desc:'CI/CD deployments' },
                { label:'DynamoDB', url:'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items', desc:'Database records' },
                { label:'CloudWatch', url:'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1', desc:'Logs and monitoring' },
                { label:'SES Console', url:'https://console.aws.amazon.com/ses/home?region=us-east-1', desc:'Email service' },
                { label:'Google Analytics', url:'https://analytics.google.com', desc:'Traffic and users' },
                { label:'Cognito', url:'https://console.aws.amazon.com/cognito/v2/home?region=us-east-1', desc:'User authentication' },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'14px',textDecoration:'none',display:'block'}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#0f172a',marginBottom:3}}>{link.label} →</div>
                  <div style={{fontSize:11,color:'#64748b'}}>{link.desc}</div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}