'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const avColors = [
  'linear-gradient(135deg,#2563eb,#06b6d4)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('there')
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSaved, setTotalSaved] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const email = attributes.email || ''
        const name = email.split('@')[0]
        setUserName(name)

        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)
          const total = data.circles.reduce((sum: number, c: any) => sum + parseFloat(c.totalSaved || '0'), 0)
          setTotalSaved(total)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${userName} 👋`}
        sub="Your savings snapshot."
        btnLabel="+ New circle"
        btnHref="/dashboard/create/"
      />
      <div className={styles.metrics}>
        <MetricCard color="blue"   label="💰 Total saved"   value={`$${totalSaved.toLocaleString()}`} note="Across all your circles" />
        <MetricCard color="gold"   label="🏦 Active circles" value={String(circles.length)} note={`${circles.length} circle${circles.length !== 1 ? 's' : ''} active`} noteType="neutral" />
        <MetricCard color="green"  label="✅ On-time rate"  value="—"     note="Coming soon" />
        <MetricCard color="purple" label="📬 Late payments"  value="—"       note="Coming soon" noteType="down" />
        <MetricCard color="cyan"   label="🌐 Network rank"  value="—"  note="Coming soon" />
      </div>

      <div className={styles.card}>
        <div className={styles.cardH}>
          <span className={styles.cardT}>My circles</span>
        </div>
        {loading ? (
          <div style={{padding:'2rem',color:'rgba(255,255,255,.5)'}}>Loading...</div>
        ) : circles.length === 0 ? (
          <div style={{padding:'2rem',color:'rgba(255,255,255,.5)',textAlign:'center'}}>
            No circles yet. <a href="/dashboard/create/" style={{color:'#60a5fa'}}>Create your first circle →</a>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Circle</th>
                  <th>Monthly</th>
                  <th>Currency</th>
                  <th>Goal</th>
                  <th>Total Saved</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {circles.map((c, i) => (
                  <tr key={c.circleId}>
                    <td>
                      <div className={styles.member}>
                        <div className={styles.av} style={{background: avColors[i % 5]}}>
                          {getInitials(c.name || 'C')}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className={styles.bold}>${c.amount}/mo</td>
                    <td className={styles.muted}>{c.currency}</td>
                    <td className={styles.muted}>{c.goal || '—'}</td>
                    <td className={styles.bold}>${parseFloat(c.totalSaved || '0').toLocaleString()}</td>
                    <td>
                      <span className={`${styles.stb} ${styles.ok}`}>
                        {c.status || 'active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}