'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchUserAttributes } from 'aws-amplify/auth'
import styles from './page.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const memberColors = [
  'linear-gradient(135deg,#2563eb,#06b6d4)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
]

function GroupDetail() {
  const params = useSearchParams()
  const circleId = params.get('id') || ''
  const [circle, setCircle] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const uid = attributes.sub || ''
        setUserId(uid)

        if (!circleId) return

        // Load circle details
        const res = await fetch(`${API_URL}/circles?userId=${uid}`)
        const data = await res.json()
        if (data.circles) {
          const found = data.circles.find((c: any) => c.circleId === circleId)
          if (found) setCircle(found)
        }

        // Load members
        const mRes = await fetch(`${API_URL}/members?circleId=${circleId}`)
        if (mRes.ok) {
          const mData = await mRes.json()
          if (mData.members) setMembers(mData.members)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [circleId])

  if (loading) {
    return <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
  }

  if (!circle) {
    return (
      <div style={{textAlign:'center',padding:'4rem 2rem'}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>👥</div>
        <div style={{fontSize:'1.2rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>Circle not found</div>
        <Link href="/dashboard/groups/" style={{color:'#60a5fa'}}>← Back to my circles</Link>
      </div>
    )
  }

  const totalSaved = parseFloat(circle.totalSaved || '0')
  const monthlyAmount = parseFloat(circle.amount || '0')
  const goal = 10000
  const pct = Math.min(Math.round((totalSaved / goal) * 100), 100)
  const isAdmin = circle.createdBy === userId

  return (
    <div>
      <div className={styles.back}>
        <Link href="/dashboard/groups/" className={styles.backLink}>← My circles</Link>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{circle.name}</h1>
          <p className={styles.sub}>
            ${monthlyAmount}/month · {circle.currency} · {isAdmin ? 'You are admin' : 'Member'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnGhost}>Group settings</button>
          <button className={styles.btnPrimary}>Invite member</button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total saved</div>
          <div className={styles.statVal} style={{color:'#60a5fa'}}>${totalSaved.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Monthly amount</div>
          <div className={styles.statVal} style={{color:'#fbbf24'}}>${monthlyAmount.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Status</div>
          <div className={styles.statVal} style={{color:'#34d399'}}>{circle.status || 'Active'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Goal</div>
          <div className={styles.statVal}>{circle.goal || '—'}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progSection}>
        <div className={styles.progLabels}>
          <span>Progress to goal</span>
          <span>${totalSaved.toLocaleString()} / ${goal.toLocaleString()} ({pct}%)</span>
        </div>
        <div className={styles.progBar}>
          <div className={styles.progFill} style={{width:`${pct}%`}}/>
        </div>
      </div>

      {/* Circle details */}
      <div className={styles.card}>
        <div className={styles.cardH}>
          <span className={styles.cardT}>Circle details</span>
        </div>
        <div className={styles.policyGrid}>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Circle name</div>
            <div className={styles.policyVal}>{circle.name}</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Monthly contribution</div>
            <div className={styles.policyVal}>${monthlyAmount}/mo · {circle.currency}</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Description</div>
            <div className={styles.policyVal}>{circle.description || '—'}</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Created</div>
            <div className={styles.policyVal}>
              {circle.createdAt ? new Date(circle.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className={styles.card}>
        <div className={styles.cardH}>
          <span className={styles.cardT}>Members</span>
        </div>
        {members.length === 0 ? (
          <div style={{padding:'1.5rem',color:'rgba(255,255,255,.4)',fontSize:'13px',textAlign:'center'}}>
            <div style={{marginBottom:'0.5rem'}}>👥</div>
            You are the only member. Invite others to join!
          </div>
        ) : (
          <div className={styles.memberList}>
            {members.map((m, i) => (
              <div key={i} className={styles.memberRow}>
                <div className={styles.memberLeft}>
                  <div className={styles.av} style={{background: memberColors[i % 5]}}>
                    {(m.email || m.userId || 'M').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.memberName}>{m.email || m.userId}</div>
                    <div className={styles.memberMeta}>{m.role || 'Member'} · Joined {new Date(m.joinedAt).toLocaleDateString('en-US', {month:'short',year:'numeric'})}</div>
                  </div>
                </div>
                <div className={styles.memberRight}>
                  <span className={`${styles.stb} ${styles.ok}`}>✓ Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Policy summary */}
      <div className={styles.card}>
        <div className={styles.cardH}>
          <span className={styles.cardT}>Group policy summary</span>
          <Link href="/dashboard/policy/" className={styles.viewAll}>View full policy →</Link>
        </div>
        <div className={styles.policyGrid}>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Contribution</div>
            <div className={styles.policyVal}>${monthlyAmount}/mo on the 1st of every month</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Withdrawal</div>
            <div className={styles.policyVal}>Requires all member digital signatures + 30 days notice</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>Quitting</div>
            <div className={styles.policyVal}>30 days notice required</div>
          </div>
          <div className={styles.policyItem}>
            <div className={styles.policyLabel}>New members</div>
            <div className={styles.policyVal}>Admin approval required</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GroupPage() {
  return (
    <Suspense fallback={<div style={{padding:'2rem',color:'rgba(255,255,255,.5)'}}>Loading...</div>}>
      <GroupDetail />
    </Suspense>
  )
}