'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserAttributes } from '@/lib/getUser'
import { getCircles } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const barColor: Record<string,string> = {
  0:'linear-gradient(90deg,#2563eb,#06b6d4)',
  1:'linear-gradient(90deg,#10b981,#34d399)',
  2:'linear-gradient(90deg,#8b5cf6,#ec4899)',
  3:'linear-gradient(90deg,#f59e0b,#ef4444)',
  4:'linear-gradient(90deg,#06b6d4,#2563eb)',
}

export default function GroupsPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCircles = async () => {
      try {
        const attributes = await getUserAttributes()
        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCircles()
  }, [])

  if (loading) {
    return (
      <div>
        <PageHeader title="My circles" sub="Loading your circles..." />
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      </div>
    )
  }

  if (circles.length === 0) {
    return (
      <div>
        <PageHeader title="My circles" sub="You don't have any circles yet." btnLabel="+ New circle" btnHref="/dashboard/create/" />
        <div style={{textAlign:'center',padding:'4rem',color:'rgba(255,255,255,.4)'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>👥</div>
          <div style={{fontSize:'1.1rem',marginBottom:'.5rem'}}>No circles yet</div>
          <div style={{fontSize:'13px'}}>Create your first savings circle to get started!</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My circles" sub={`You belong to ${circles.length} savings circle${circles.length!==1?'s':''}.`} btnLabel="+ New circle" btnHref="/dashboard/create/" />
      <div className={styles.grid}>
        {circles.map((g, index) => {
          const saved = parseFloat(g.totalSaved || '0')
          const goal = 10000
          const pct = Math.min(Math.round((saved / goal) * 100), 100)
          const color = barColor[index % 5]
          return (
            <Link key={g.circleId} href={`/dashboard/group/?id=${g.circleId}`} className={styles.gc}>
              <div className={styles.topBar} style={{background:color}}/>
              <div className={styles.gcHead}>
                <div>
                  <div className={styles.gcName}>{g.name}</div>
                  <div className={styles.gcMeta}>${g.amount}/mo · {g.currency}</div>
                </div>
                <span className={styles.activeBadge}>{g.status || 'Active'}</span>
              </div>
              <div className={styles.progLabels}><span>Saved</span><span>${saved} / ${goal}</span></div>
              <div className={styles.progBar}><div className={styles.progFill} style={{width:`${pct}%`,background:color}}/></div>
              <div className={styles.gcFoot}>
                <div className={styles.amt}>
                  <div className={styles.amtVal}>${g.amount}/mo</div>
                  <div className={styles.amtLbl}>{g.goal || 'Savings goal'}</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}