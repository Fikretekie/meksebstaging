'use client'
import { useEffect, useState, useCallback } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

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

  useEffect(() => {
    if (!stats) return
    const timer = setTimeout(() => {
      const ses = stats.ses || {}
      const emailsUsed = ses.sentLast24Hours || 0
      const emailsLimit = ses.max24HourSend || 50000

      const lineCanvas = document.getElementById('lineChart') as HTMLCanvasElement
      if (lineCanvas) {
        const existing = Chart.getChart(lineCanvas)
        if (existing) existing.destroy()
        new Chart(lineCanvas, {
          type: 'line',
          data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [{
              label: 'Users',
              data: [2,2,3,3,4,4, stats.totalUsers || 5],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 2,
            },{
              label: 'Circles',
              data: [3,4,5,5,6,6, stats.totalCircles || 7],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,.05)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: 'rgba(255,255,255,.3)', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,.04)' } },
              y: { ticks: { color: 'rgba(255,255,255,.3)', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,.04)' } }
            }
          }
        })
      }

      const donutCanvas = document.getElementById('donutChart') as HTMLCanvasElement
      if (donutCanvas) {
        const existing = Chart.getChart(donutCanvas)
        if (existing) existing.destroy()
        new Chart(donutCanvas, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [emailsUsed, Math.max(0, emailsLimit - emailsUsed)],
              backgroundColor: ['#2563eb', 'rgba(255,255,255,.06)'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: false,
            cutout: '75%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [stats])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48,height:48,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:22,color:'white',margin:'0 auto 1rem'}}>M</div>
        <p style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Loading...</p>
      </div>
    </div>
  )

  if (!authorized) return null

  const s = stats || {}
  const ses = s.ses || {}
  const stripe = s.stripe || {}
  const emailsLeft = Math.max(0, (ses.max24HourSend || 50000) - (ses.sentLast24Hours || 0))
  const tabs = ['overview', 'revenue', 'emails', 'links']

  const kpiCards = [
    { label:'Users', value: s.totalUsers ?? 0, sub:`+${s.newUsersThisWeek ?? 0} this week`, gradient:'linear-gradient(90deg,#2563eb,#06b6d4)', color:'#60a5fa' },
    { label:'Circles', value: s.totalCircles ?? 0, sub:`${s.activeCircles ?? 0} active`, gradient:'linear-gradient(90deg,#10b981,#06b6d4)', color:'#34d399' },
    { label:'Revenue', value:`$${(stripe.monthRevenue||0).toFixed(2)}`, sub:'this month', gradient:'linear-gradient(90deg,#f59e0b,#ef4444)', color:'#fbbf24' },
    { label:'Total saved', value:`$${s.totalSaved ?? '0'}`, sub:'all circles', gradient:'linear-gradient(90deg,#8b5cf6,#ec4899)', color:'#a78bfa' },
  ]

  const card: any = {
    background:'rgba(255,255,255,.04)',
    border:'1px solid rgba(255,255,255,.07)',
    borderRadius:12,
    padding:14,
    marginBottom:10,
  }

  const cardTitle: any = {
    fontSize:11,
    fontWeight:600,
    color:'rgba(255,255,255,.5)',
    marginBottom:10,
  }

  const barRow = (items: any[]) => (
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {items.map(item => (
        <div key={item.label}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:3}}>
            <span>{item.label}</span>
            <span style={{color:item.color || '#34d399'}}>{item.value}</span>
          </div>
          <div style={{height:4,background:'rgba(255,255,255,.08)',borderRadius:100,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${item.pct}%`,background:item.bg || 'linear-gradient(90deg,#10b981,#06b6d4)',borderRadius:100}}/>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',fontFamily:'system-ui,sans-serif',color:'white'}}>

      {/* Top Nav */}
      <div style={{background:'#0a1628',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'0 12px',display:'flex',alignItems:'center',justifyContent:'space-between',height:48,position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,color:'white'}}>M</div>
          <span style={{fontSize:13,fontWeight:600}}>Admin</span>
          <span style={{fontSize:10,background:'rgba(16,185,129,.15)',color:'#34d399',padding:'2px 7px',borderRadius:100,border:'1px solid rgba(16,185,129,.2)'}}>live</span>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={loadStats} disabled={statsLoading} style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid rgba(255,255,255,.1)',background:'transparent',color:'rgba(255,255,255,.5)',cursor:'pointer',whiteSpace:'nowrap'}}>
            {statsLoading ? '...' : '↻ Refresh'}
          </button>
          <a href="/dashboard/index.html" style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.4)',textDecoration:'none',whiteSpace:'nowrap'}}>← Dashboard</a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',background:'rgba(255,255,255,.03)',borderBottom:'1px solid rgba(255,255,255,.06)',overflowX:'auto',padding:'0 12px'}}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{fontSize:11,padding:'10px 14px',border:'none',background:'transparent',color: tab===t ? '#60a5fa' : 'rgba(255,255,255,.4)',cursor:'pointer',whiteSpace:'nowrap',borderBottom: tab===t ? '2px solid #2563eb' : '2px solid transparent',fontWeight: tab===t ? 600 : 400,textTransform:'capitalize'}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{padding:'12px',maxWidth:960,margin:'0 auto'}}>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            {/* KPI 2x2 grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:10}}>
              {kpiCards.map(c => (
                <div key={c.label} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:14,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:c.gradient}}/>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:4}}>{c.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:c.color,marginBottom:2}}>{statsLoading ? '...' : c.value}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Line Chart */}
            <div style={card}>
              <div style={cardTitle}>📊 Growth — last 7 days</div>
              <div style={{position:'relative',height:110}}>
                <canvas id="lineChart" role="img" aria-label="User and circle growth over 7 days">Growth chart.</canvas>
              </div>
              <div style={{display:'flex',gap:12,marginTop:8,justifyContent:'center'}}>
                <span style={{fontSize:10,color:'rgba(255,255,255,.4)',display:'flex',alignItems:'center',gap:4}}>
                  <span style={{width:8,height:8,borderRadius:2,background:'#2563eb',display:'inline-block'}}/>Users
                </span>
                <span style={{fontSize:10,color:'rgba(255,255,255,.4)',display:'flex',alignItems:'center',gap:4}}>
                  <span style={{width:8,height:8,borderRadius:2,background:'#10b981',display:'inline-block'}}/>Circles
                </span>
              </div>
            </div>

            {/* Donut */}
            <div style={card}>
              <div style={cardTitle}>📧 SES email quota</div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <canvas id="donutChart" width={80} height={80} role="img" aria-label="Email quota donut">{ses.sentLast24Hours||0} of {ses.max24HourSend||50000} used.</canvas>
                <div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:2}}>Used today</div>
                  <div style={{fontSize:18,fontWeight:700,color:'#60a5fa',marginBottom:6}}>{ses.sentLast24Hours||0}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:2}}>Remaining</div>
                  <div style={{fontSize:15,fontWeight:700,color:'#34d399',marginBottom:4}}>{emailsLeft.toLocaleString()}</div>
                  <div style={{fontSize:10,color:'#34d399'}}>✓ Production · 50k/day</div>
                </div>
              </div>
            </div>

            {/* Stripe bars */}
            <div style={card}>
              <div style={cardTitle}>💰 Stripe revenue</div>
              {barRow([
                { label:'This month', value:`$${(stripe.monthRevenue||0).toFixed(2)}`, pct:100, color:'#34d399' },
                { label:'Total revenue', value:`$${(stripe.totalRevenue||0).toFixed(2)}`, pct:99, color:'#34d399' },
                { label:'Payments', value: String(stripe.thisMonthPayments||0), pct:10, bg:'#f59e0b', color:'#fbbf24' },
              ])}
            </div>

            {/* Email bars */}
            <div style={card}>
              <div style={cardTitle}>📧 Email stats</div>
              {barRow([
                { label:'Today', value: ses.emailsSent24h||0, pct:5, bg:'#2563eb', color:'#60a5fa' },
                { label:'This week', value: ses.emailsSentWeek||0, pct:40, bg:'#2563eb', color:'#60a5fa' },
                { label:'This month', value: ses.emailsSentMonth||0, pct:100, bg:'linear-gradient(90deg,#2563eb,#06b6d4)', color:'#60a5fa' },
                { label:'Daily limit', value: (ses.max24HourSend||50000).toLocaleString(), pct:100, bg:'#10b981', color:'#34d399' },
              ])}
            </div>

            {/* Quick Links */}
            <div style={card}>
              <div style={cardTitle}>⚡ Quick links</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {[
                  { label:'AWS Console', url:'https://console.aws.amazon.com' },
                  { label:'Stripe Dashboard', url:'https://dashboard.stripe.com' },
                  { label:'GitHub Actions', url:'https://github.com/Fikretekie/meksebstaging/actions' },
                  { label:'DynamoDB', url:'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items' },
                  { label:'Google Analytics', url:'https://analytics.google.com' },
                  { label:'CloudWatch', url:'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1' },
                ].map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:8,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',fontSize:12,color:'rgba(255,255,255,.65)',textDecoration:'none'}}>
                    {link.label}<span style={{color:'rgba(255,255,255,.3)',fontSize:10}}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {tab === 'revenue' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>💰 Stripe revenue</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginBottom:16}}>
              {[
                { label:'This month', value:'$'+(stripe.monthRevenue||0).toFixed(2), color:'#34d399' },
                { label:'Payments', value: String(stripe.thisMonthPayments||0), color:'#60a5fa' },
                { label:'Total revenue', value:'$'+(stripe.totalRevenue||0).toFixed(2), color:'#a78bfa' },
                { label:'Platform fee', value:'$0.10', color:'#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:10,padding:'1rem',textAlign:'center'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',padding:'12px',background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:10,color:'#60a5fa',textDecoration:'none',fontSize:13,fontWeight:600}}>Open Stripe Dashboard →</a>
          </div>
        )}

        {/* Emails Tab */}
        {tab === 'emails' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>📧 SES email stats</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginBottom:16}}>
              {[
                { label:'Sent today', value: ses.emailsSent24h||0, color:'#60a5fa' },
                { label:'Sent this week', value: ses.emailsSentWeek||0, color:'#60a5fa' },
                { label:'Sent this month', value: ses.emailsSentMonth||0, color:'#60a5fa' },
                { label:'Used today', value: ses.sentLast24Hours||0, color:'#fbbf24' },
                { label:'Remaining today', value: emailsLeft.toLocaleString(), color:'#34d399' },
                { label:'Daily limit', value: (ses.max24HourSend||50000).toLocaleString(), color:'#34d399' },
              ].map(item => (
                <div key={item.label} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:10,padding:'1rem',textAlign:'center'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',fontSize:12,color:'#34d399',padding:'10px',background:'rgba(16,185,129,.05)',borderRadius:8,border:'1px solid rgba(16,185,129,.15)'}}>
              ✓ SES production mode · {ses.maxSendRate||14} emails/second
            </div>
          </div>
        )}

        {/* Links Tab */}
        {tab === 'links' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>⚡ Quick links</h2>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
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
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',textDecoration:'none'}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'white',marginBottom:2}}>{link.label}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{link.desc}</div>
                  </div>
                  <span style={{color:'rgba(255,255,255,.3)',fontSize:12}}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}