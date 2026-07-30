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
    if (!stats || tab !== 'overview') return
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
              pointRadius: 3,
              pointBackgroundColor: '#2563eb',
            },{
              label: 'Circles',
              data: [3,4,5,5,6,6, stats.totalCircles || 7],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,.05)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#10b981',
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: 'rgba(255,255,255,.35)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.04)' } },
              y: { ticks: { color: 'rgba(255,255,255,.35)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.04)' } }
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
              data: [emailsUsed, Math.max(1, emailsLimit - emailsUsed)],
              backgroundColor: ['#2563eb', 'rgba(255,255,255,.06)'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: false,
            cutout: '72%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        })
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [stats, tab])

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
    padding:16,
    marginBottom:10,
  }

  const barSection = (items: {label:string, value:any, pct:number, bg?:string, color?:string}[]) => (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {items.map(item => (
        <div key={item.label}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}>
            <span style={{color:'rgba(255,255,255,.5)'}}>{item.label}</span>
            <span style={{color:item.color || '#34d399',fontWeight:600}}>{item.value}</span>
          </div>
          <div style={{height:5,background:'rgba(255,255,255,.08)',borderRadius:100,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${item.pct}%`,background:item.bg || 'linear-gradient(90deg,#10b981,#06b6d4)',borderRadius:100}}/>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',fontFamily:'system-ui,sans-serif',color:'white'}}>

      {/* Top Nav */}
      <div style={{background:'#0a1628',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'0 14px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52,position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'white'}}>M</div>
          <span style={{fontSize:14,fontWeight:600}}>Admin</span>
          <span style={{fontSize:11,background:'rgba(16,185,129,.15)',color:'#34d399',padding:'2px 8px',borderRadius:100,border:'1px solid rgba(16,185,129,.2)'}}>live</span>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={loadStats} disabled={statsLoading} style={{fontSize:12,padding:'5px 12px',borderRadius:6,border:'1px solid rgba(255,255,255,.12)',background:'transparent',color:'rgba(255,255,255,.6)',cursor:'pointer',whiteSpace:'nowrap'}}>
            {statsLoading ? '...' : '↻ Refresh'}
          </button>
          <a href="/dashboard/index.html" style={{fontSize:12,padding:'5px 12px',borderRadius:6,border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.5)',textDecoration:'none',whiteSpace:'nowrap'}}>← Dashboard</a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',background:'rgba(255,255,255,.03)',borderBottom:'1px solid rgba(255,255,255,.06)',overflowX:'auto',padding:'0 14px'}}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{fontSize:12,padding:'12px 16px',border:'none',background:'transparent',color: tab===t ? '#60a5fa' : 'rgba(255,255,255,.4)',cursor:'pointer',whiteSpace:'nowrap',borderBottom: tab===t ? '2px solid #2563eb' : '2px solid transparent',fontWeight: tab===t ? 600 : 400,textTransform:'capitalize'}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{padding:'14px',maxWidth:960,margin:'0 auto'}}>

        {tab === 'overview' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:10}}>
              {kpiCards.map(c => (
                <div key={c.label} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:16,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:c.gradient}}/>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:6}}>{c.label}</div>
                  <div style={{fontSize:28,fontWeight:700,color:c.color,marginBottom:4,lineHeight:1}}>{statsLoading ? '...' : c.value}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{c.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:12}}>📊 Growth — last 7 days</div>
              <div style={{position:'relative',height:130}}>
                <canvas id="lineChart" role="img" aria-label="User and circle growth over 7 days">Growth chart.</canvas>
              </div>
              <div style={{display:'flex',gap:16,marginTop:10,justifyContent:'center'}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.5)',display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:10,height:10,borderRadius:2,background:'#2563eb',display:'inline-block'}}/>Users
                </span>
                <span style={{fontSize:11,color:'rgba(255,255,255,.5)',display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:10,height:10,borderRadius:2,background:'#10b981',display:'inline-block'}}/>Circles
                </span>
              </div>
            </div>

            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:14}}>📧 SES email quota</div>
              <div style={{display:'flex',alignItems:'center',gap:20}}>
                <canvas id="donutChart" width={90} height={90} role="img" aria-label="Email quota donut">{ses.sentLast24Hours||0} of {ses.max24HourSend||50000} used.</canvas>
                <div style={{flex:1}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:3}}>Used today</div>
                      <div style={{fontSize:24,fontWeight:700,color:'#60a5fa'}}>{ses.sentLast24Hours||0}</div>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:3}}>Remaining</div>
                      <div style={{fontSize:20,fontWeight:700,color:'#34d399'}}>{emailsLeft.toLocaleString()}</div>
                    </div>
                    <div style={{gridColumn:'span 2'}}>
                      <div style={{fontSize:11,color:'#34d399'}}>✓ Production · {(ses.max24HourSend||50000).toLocaleString()}/day limit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:14}}>💰 Stripe revenue</div>
              {barSection([
                { label:'This month', value:`$${(stripe.monthRevenue||0).toFixed(2)}`, pct:100, color:'#34d399' },
                { label:'Total revenue', value:`$${(stripe.totalRevenue||0).toFixed(2)}`, pct:99, color:'#34d399' },
                { label:'Payments', value: String(stripe.thisMonthPayments||0), pct:10, bg:'#f59e0b', color:'#fbbf24' },
              ])}
            </div>

            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:14}}>📧 Email stats</div>
              {barSection([
                { label:'Today', value: ses.emailsSent24h||0, pct:5, bg:'#2563eb', color:'#60a5fa' },
                { label:'This week', value: ses.emailsSentWeek||0, pct:40, bg:'#2563eb', color:'#60a5fa' },
                { label:'This month', value: ses.emailsSentMonth||0, pct:80, bg:'linear-gradient(90deg,#2563eb,#06b6d4)', color:'#60a5fa' },
                { label:'Daily limit', value: (ses.max24HourSend||50000).toLocaleString(), pct:100, bg:'#10b981', color:'#34d399' },
              ])}
            </div>

            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:12}}>⚡ Quick links</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[
                  { label:'AWS Console', url:'https://console.aws.amazon.com' },
                  { label:'Stripe Dashboard', url:'https://dashboard.stripe.com' },
                  { label:'GitHub Actions', url:'https://github.com/Fikretekie/meksebstaging/actions' },
                  { label:'DynamoDB', url:'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#/tables/mekseb-staging/items' },
                  { label:'Google Analytics', url:'https://analytics.google.com' },
                  { label:'CloudWatch', url:'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1' },
                  { label:'SES Console', url:'https://console.aws.amazon.com/ses/home?region=us-east-1' },
                ].map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',borderRadius:9,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',fontSize:13,color:'rgba(255,255,255,.7)',textDecoration:'none'}}>
                    {link.label}<span style={{color:'rgba(255,255,255,.3)'}}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'revenue' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:17,fontWeight:600,margin:'0 0 1.5rem'}}>💰 Stripe revenue</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginBottom:16}}>
              {[
                { label:'This month', value:'$'+(stripe.monthRevenue||0).toFixed(2), color:'#34d399' },
                { label:'Payments', value: String(stripe.thisMonthPayments||0), color:'#60a5fa' },
                { label:'Total revenue', value:'$'+(stripe.totalRevenue||0).toFixed(2), color:'#a78bfa' },
                { label:'Platform fee', value:'$0.10', color:'#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:10,padding:'1rem',textAlign:'center'}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.45)',marginBottom:8}}>{item.label}</div>
                  <div style={{fontSize:26,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',padding:'13px',background:'rgba(37,99,235,.1)',border:'1px solid rgba(37,99,235,.2)',borderRadius:10,color:'#60a5fa',textDecoration:'none',fontSize:14,fontWeight:600}}>Open Stripe Dashboard →</a>
          </div>
        )}

        {tab === 'emails' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:17,fontWeight:600,margin:'0 0 1.5rem'}}>📧 SES email stats</h2>
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
                  <div style={{fontSize:12,color:'rgba(255,255,255,.45)',marginBottom:8}}>{item.label}</div>
                  <div style={{fontSize:26,fontWeight:700,color:item.color}}>{statsLoading ? '...' : item.value}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',fontSize:13,color:'#34d399',padding:'12px',background:'rgba(16,185,129,.05)',borderRadius:9,border:'1px solid rgba(16,185,129,.15)'}}>
              ✓ SES production mode · {ses.maxSendRate||14} emails/second
            </div>
          </div>
        )}

        {tab === 'links' && (
          <div style={card}>
            <h2 style={{color:'white',fontSize:17,fontWeight:600,margin:'0 0 1.5rem'}}>⚡ Quick links</h2>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
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
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',textDecoration:'none'}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:'white',marginBottom:3}}>{link.label}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{link.desc}</div>
                  </div>
                  <span style={{color:'rgba(255,255,255,.3)',fontSize:14}}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}