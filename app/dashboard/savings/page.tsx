'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const barColors = [
  '#2563eb,#06b6d4',
  '#10b981,#34d399',
  '#8b5cf6,#ec4899',
  '#f59e0b,#ef4444',
  '#06b6d4,#2563eb',
]

const circleColors = ['#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#06b6d4']

export default function SavingsPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSaved, setTotalSaved] = useState(0)
  const [thisMonth, setThisMonth] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)
          const total = data.circles.reduce((sum: number, c: any) =>
            sum + parseFloat(c.totalSaved || '0'), 0)
          setTotalSaved(total)
          const monthly = data.circles.reduce((sum: number, c: any) =>
            sum + parseFloat(c.amount || '0'), 0)
          setThisMonth(monthly)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Build monthly chart — show current month contributions
  const currentMonth = new Date().toLocaleString('default', { month: 'short' })
  const allMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const currentMonthIndex = new Date().getMonth()

  const months = allMonths.map((l, i) => {
    if (i === currentMonthIndex) {
      const pct = thisMonth > 0 ? Math.min(Math.round((thisMonth / 5000) * 100), 95) : 7
      return { l, v: `$${thisMonth.toLocaleString()}`, h: pct, c: '#10b981,#059669' }
    }
    return { l, v: '—', h: 7, c: 'rgba(255,255,255,.08),rgba(255,255,255,.08)' }
  })

  return (
    <div>
      <PageHeader title="Savings overview" sub="Cumulative savings across all your circles." />

      {loading ? (
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      ) : (
        <>
          <div className={styles.metrics}>
            <MetricCard color="blue"   label="📈 Total saved"   value={`$${totalSaved.toLocaleString()}`} note="Across all circles" noteType="neutral" />
            <MetricCard color="green"  label="📅 Monthly contributions" value={`$${thisMonth.toLocaleString()}`} note={`${circles.length} active circle${circles.length !== 1 ? 's' : ''}`} />
            <MetricCard color="gold"   label="✦ Total circles"  value={String(circles.length)} note="Active" noteType="neutral" />
            <MetricCard color="purple" label="🎯 Monthly goal"  value={`$${thisMonth.toLocaleString()}`} note="Per month" noteType="neutral" />
          </div>

          <div className={styles.card}>
            <div className={styles.cardH}>
              <span className={styles.cardT}>Monthly contributions — {new Date().getFullYear()}</span>
            </div>
            <div className={styles.chartPad}>
              <div className={styles.bars}>
                {months.map(m => (
                  <div key={m.l} className={styles.bw}>
                    <div className={styles.bv}>{m.v}</div>
                    <div className={styles.bar} style={{height:`${m.h}%`, background:`linear-gradient(180deg,${m.c})`}} />
                    <div className={styles.bl}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardH}>
              <span className={styles.cardT}>Breakdown by circle</span>
            </div>
            {circles.length === 0 ? (
              <div style={{padding:'2rem',color:'rgba(255,255,255,.5)',textAlign:'center'}}>
                No circles yet. <a href="/dashboard/create/" style={{color:'#60a5fa'}}>Create your first circle →</a>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Circle</th>
                      <th>Monthly contribution</th>
                      <th>Total saved</th>
                      <th>Goal</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circles.map((c, i) => {
                      const saved = parseFloat(c.totalSaved || '0')
                      const goal = 10000
                      const pct = Math.min(Math.round((saved / goal) * 100), 100)
                      return (
                        <tr key={c.circleId}>
                          <td style={{fontWeight:600}}>{c.name}</td>
                          <td className={styles.muted}>${c.amount}/mo</td>
                          <td style={{color: circleColors[i % 5], fontWeight:600}}>
                            ${saved.toLocaleString()}
                          </td>
                          <td className={styles.muted}>{c.goal || '—'}</td>
                          <td>
                            <div className={styles.progRow}>
                              <div className={styles.progBar}>
                                <div className={styles.progFill} style={{
                                  width:`${pct}%`,
                                  background:`linear-gradient(90deg,${barColors[i % 5]})`
                                }}/>
                              </div>
                              <span className={styles.pct}>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}