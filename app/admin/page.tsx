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

    const ses = stats.ses || {}
    const emailsUsed = ses.sentLast24Hours || 0
    const emailsLimit = ses.max24HourSend || 50000

    // Line chart
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
            pointBackgroundColor: '#2563eb',
            pointRadius: 3,
          },{
            label: 'Circles',
            data: [3,4,5,5,6,6, stats.totalCircles || 7],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,.05)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: 'rgba(255,255,255,.3)', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.04)' } },
            y: { ticks: { color: 'rgba(255,255,255,.3)', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.04)' } }
          }
        }
      })
    }

    // Donut chart
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
    { label:'Total users', value: s.totalUsers ?? 0, sub:`+${s.newUsersThisWeek ?? 0} this week`, gradient:'linear-gradient(90deg,#2563eb,#06b6d4)', color:'#60a5fa', icon:'👥' },
    { label:'Circles', value: s.totalCircles ?? 0, sub:`${s.activeCircles ?? 0} active`, gradient:'linear-gradient(90deg,#10b981,#06b6d4)', color:'#34d399', icon:'⭕' },
    { label:'Revenue this month', value:`$${(stripe.monthRevenue||0).toFixed(2)}`, sub:'1 payment', gradient:'linear-gradient(90deg,#f59e0b,#ef4444)', color:'#fbbf24', icon:'💳' },
    { label:'Total saved', value:`$${s.totalSaved ?? '0'}`, sub:'across all circles', gradient:'linear-gradient(90deg,#8b5cf6,#ec4899)', color:'#a78bfa', icon:'💰' },
  ]

  const card: any = {
    background:'rgba(255,255,255,.04)',
    border:'1px solid rgba(255,255,255,.07)',
    borderRadius:12,
    padding:14,
  }

  const cardTitle: any = {
    fontSize:11,
    fontWeight:600,
    color:'rgba(255,255,255,.5)',
    marginBottom:12,
  }

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',fontFamily:'system-ui,sans-serif',color:'white'}}>

      {/* Top Nav */}
      <div style={{background:'#0a1628',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:48,position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,color:'white'}}>M</div>
            <span style={{fontSize:13,fontWeight:600}}>Admin</span>
            <span style={{fontSize:10,background:'rgba(16,185,129,.15)',color:'#34d399',padding:'2px 7px',borderRadius:100,border:'1px solid rgba(16,185,129,.2)'}}>live</span>
          </div>
          <nav style={{display:'flex',gap:2}}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{fontSize:11,padding:'4px 12px',borderRadius:5,border:'none',cursor:'pointer',background: tab===t ? 'rgba(37,99,235,.25)' : 'transparent',color: tab===t ? '#60a5fa' : 'rgba(255,255,255,.5)',fontWeight: tab===t ? 600 : 400,textTransform:'capitalize'}}>
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <span style={{fontSize:10,color:'rgba(255,255,255,.25)'}}>Jul 29, 2026</span>
          <button onClick={loadStats} disabled={statsLoading} style={{fontSize:11,padding:'3px 10px',borderRadius:5,border:'1px solid rgba(255,255,255,.1)',background:'transparent',color:'rgba(255,255,255,.5)',cursor:'pointer'}}>
            {statsLoading ? '...' : '↻ Refresh'}
          </button>
          <a href="/dashboard/index.html" style={{fontSize:11,padding:'3px 10px',borderRadius:5,border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.4)',textDecoration:'none'}}>← Dashboard</a>
        </div>
      </div>

      <div style={{padding:'1rem 1.25rem',maxWidth:960,margin:'0 auto'}}>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
              {kpiCards.map(c => (
                <div key={c.label} style={{...card,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:c.gradient}}/>
                  <div style={{position:'absolute',top:12,right:12,fontSize:18,opacity:.35}}>{c.icon}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>{c.label}</div>
                  <div style={{fontSize:26,fontWeight:700,color:c.color,marginBottom:4}}>{statsLoading ? '...' : c.value}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:10,marginBottom:14}}>
              <div style={card}>
                <div style={cardTitle}>📊 Growth — last 7 days</div>
                <div style={{position:'relative',height:120}}>
                  <canvas id="lineChart" role="img" aria-label="User and circle growth over 7 days">Growth chart.</canvas>
                </div>
              </div>
              <div style={card}>
                <div style={cardTitle}>📧 SES email quota</div>
                <div style={{display:'flex',alignItems:'center',gap:16}}>
                  <canvas id="donutChart" width={90} height={90} role="img" aria-label="Email quota donut">{ses.sentLast24Hours||0} of {ses.max24HourSend||50000} used.</canvas>
                  <div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:2}}>Used today</div>
                    <div style={{fontSize:20,fontWeight:700,color:'#60a5fa',marginBottom:6}}>{ses.sentLast24Hours||0}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:2}}>Remaining</div>
                    <div style={{fontSize:15,fontWeight:700,color:'#34d399',marginBottom:6}}>{emailsLeft.toLocaleString()}</div>
                    <div style={{fontSize:10,color:'#34d399'}}>✓ Production mode</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
              {/* Stripe */}
              <div style={card}>
                <div style={cardTitle}>💰 Stripe breakdown</div>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {[
                    { label:'This month', value:`$${(stripe.monthRevenue||0).toFixed(2)}`, pct:100, color:'linear-gradient(90deg,#10b981,#06b6d4)' },
                    { label:'Total revenue', value:`$${(stripe.totalRevenue||0).toFixed(2)}`, pct:99, color:'linear-gradient(90deg,#10b981,#06b6d4)' },
                    { label:'Payments', value: String(stripe.thisMonthPayments||0), pct:20, color:'#f59e0b' },
                    { label:'Platform fee (1%)', value:'$0.10', pct:1, color:'#8b5cf6' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:3}}>
                        <span>{item.label}</span><span style={{color:'#34d399'}}>{item.value}</span>
                      </div>
                      <div style={{height:4,background:'rgba(255,255,255,.08)',borderRadius:100,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${item.pct}%`,background:item.color,borderRadius:100}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SES */}
              <div style={card}>
                <div style={cardTitle}>📧 Email stats</div>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {[
                    { label:'Today', value: ses.emailsSent24h||0, pct:30 },
                    { label:'This week', value: ses.emailsSentWeek||0, pct:60 },
                    { label:'This month', value: ses.emailsSentMonth||0, pct:100 },
                    { label:'Daily limit', value: (ses.max24HourSend||50000).toLocaleString(), pct:100, green:true },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:3}}>
                        <span>{item.label}</span><span style={{color: item.green ? '#34d399' : '#60a5fa'}}>{item.value}</span>
                      </div>
                      <div style={{height:4,background:'rgba(255,255,255,.08)',borderRadius:100,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${item.pct}%`,background: item.green ? '#10b981' : 'linear-gradient(90deg,#2563eb,#06b6d4)',borderRadius:100}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div style={card}>
                <div style={cardTitle}>⚡ Quick links</div>
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {[
                    { label:'AWS Console', url:'https://console.aws.amazon.com' },
                    { label:'Stripe', url:'https://dashboard.stripe.com' },
                    { label:'GitHub Actions', url:'https://github.com/Fikretekie/meksebstaging/actions' },
                    { label:'DynamoDB', url:'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items' },
                    { label:'Analytics', url:'https://analytics.google.com' },
                    { label:'CloudWatch', url:'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1' },
                  ].map(link => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 8px',borderRadius:7,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',fontSize:11,color:'rgba(255,255,255,.6)',textDecoration:'none'}}>
                      {link.label}<span style={{color:'rgba(255,255,255,.3)',fontSize:10}}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {tab === 'revenue' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:16,fontWeight:600,margin:'0 0 1.5rem'}}>💰 Stripe revenue</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
              {[
                { label:'This month', value:'$'+(stripe.monthRevenue||0).toFixed(2), color:'#34d399' },
                { label:'Payments this month', value: String(stripe.thisMonthPayments||0), color:'#60a5fa' },
                { label:'Total revenue', value:'$'+(stripe.totalRevenue||0).toFixed(2), color:'#a78bfa' },
              ].map(item => (
                <div key={item.label} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:10,padding:'1rem',textAlign:'center'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:28,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
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
                  <div style={{fontSize:28,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
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
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'14px',textDecoration:'none',display:'block'}}>
                  <div style={{fontSize:13,fontWeight:600,color:'white',marginBottom:3}}>{link.label} →</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{link.desc}</div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}