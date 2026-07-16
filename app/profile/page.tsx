'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import styles from './page.module.css'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [circles, setCircles] = useState<any[]>([])
  const [totalSaved, setTotalSaved] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        setEmail(attributes.email || '')
        setFirstName(attributes.given_name || '')
        setLastName(attributes.family_name || '')

        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)
          const total = data.circles.reduce((sum: number, c: any) =>
            sum + parseFloat(c.totalSaved || '0'), 0)
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

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0]
  const initials = fullName.slice(0, 2).toUpperCase()
  const memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const circleColors = ['#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#06b6d4']

  return (
    <div className={styles.wrap}>
      <div className={styles.o1}/><div className={styles.grid}/>
      <div className={styles.inner}>

        <div className={styles.back}>
          <Link href="/dashboard" className={styles.backLink}>← Dashboard</Link>
        </div>

        {loading ? (
          <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
        ) : (
          <>
            {/* Profile card */}
            <div className={styles.profileCard}>
              <div className={styles.profileTop}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar}>{initials}</div>
                  <div className={styles.onlineDot}/>
                </div>
                <div className={styles.profileInfo}>
                  <h1 className={styles.name}>{fullName}</h1>
                  <div className={styles.location}>✉️ {email}</div>
                  <div className={styles.verifiedRow}>
                    <span className={styles.verified}>✓ Email Verified</span>
                    <span className={styles.verified}>✓ Account Active</span>
                    <span className={styles.memberSince}>Member since {memberSince}</span>
                  </div>
                </div>
                <Link href="/dashboard/settings/" className={styles.editBtn}>Edit profile</Link>
              </div>

              <div className={styles.bio}>
                {circles.length > 0
                  ? `Active member of ${circles.length} savings circle${circles.length !== 1 ? 's' : ''} on Mekseb. Building wealth through community savings.`
                  : 'Welcome to Mekseb! Create your first savings circle to get started building wealth with your community.'}
              </div>

              {/* Stats */}
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>{circles.length}</div>
                  <div className={styles.statLbl}>Active circles</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>${totalSaved.toLocaleString()}</div>
                  <div className={styles.statLbl}>Total saved</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>
                    {circles.reduce((sum, c) => sum + parseFloat(c.amount || '0'), 0).toLocaleString()}
                  </div>
                  <div className={styles.statLbl}>Monthly contribution</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statVal}>✓</div>
                  <div className={styles.statLbl}>Verified</div>
                </div>
              </div>
            </div>

            {/* Two columns */}
            <div className={styles.twoCols}>
              <div>
                <div className={styles.sectionTitle}>My circles</div>
                {circles.length === 0 ? (
                  <div style={{
                    background:'rgba(255,255,255,.03)',
                    border:'1px solid rgba(255,255,255,.08)',
                    borderRadius:'12px',
                    padding:'1.5rem',
                    textAlign:'center',
                    color:'rgba(255,255,255,.4)',
                    fontSize:'13px',
                  }}>
                    No circles yet.{' '}
                    <Link href="/dashboard/create/" style={{color:'#60a5fa'}}>
                      Create your first circle →
                    </Link>
                  </div>
                ) : (
                  <div className={styles.circleList}>
                    {circles.map((c, i) => (
                      <div key={c.circleId} className={styles.circleItem}>
                        <div className={styles.circleDot} style={{background: circleColors[i % 5]}}/>
                        <div className={styles.circleInfo}>
                          <div className={styles.circleName}>{c.name}</div>
                          <div className={styles.circleMeta}>
                            Admin · ${c.amount}/mo · {c.currency} · {c.status || 'active'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.sectionTitle} style={{marginTop:'1.75rem'}}>Account info</div>
                <div className={styles.goalCard}>
                  <div className={styles.goalLabel}>Email</div>
                  <div className={styles.goalValue}>{email}</div>
                  <div className={styles.goalSub}>
                    Circles: {circles.length} · Monthly total: $
                    {circles.reduce((sum, c) => sum + parseFloat(c.amount || '0'), 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.sectionTitle}>Recent activity</div>
                {circles.length === 0 ? (
                  <div style={{
                    color:'rgba(255,255,255,.4)',
                    fontSize:'13px',
                    padding:'1rem 0',
                  }}>
                    No activity yet. Create a circle to get started!
                  </div>
                ) : (
                  <div className={styles.activityList}>
                    {circles.map((c, i) => (
                      <div key={i} className={styles.actItem}>
                        <div className={styles.actIcon}>✦</div>
                        <div className={styles.actBody}>
                          <div className={styles.actText}>
                            Created <strong>{c.name}</strong> savings circle
                          </div>
                          <div className={styles.actTime}>
                            {new Date(c.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.actItem}>
                      <div className={styles.actIcon}>🎉</div>
                      <div className={styles.actBody}>
                        <div className={styles.actText}>Joined Mekseb</div>
                        <div className={styles.actTime}>{memberSince}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}