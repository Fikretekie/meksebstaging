'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const memberData = [
  {name:'James R.',initials:'JR',role:'Admin',bg:'linear-gradient(135deg,#2563eb,#06b6d4)',paid:true,total:'$1,400',joined:'Jan 2025'},
  {name:'Sarah M.',initials:'SM',role:'Member',bg:'linear-gradient(135deg,#8b5cf6,#ec4899)',paid:true,total:'$1,400',joined:'Jan 2025'},
  {name:'Tom K.',  initials:'TK',role:'Member',bg:'linear-gradient(135deg,#10b981,#06b6d4)',paid:false,total:'$1,300',joined:'Feb 2025'},
  {name:'Lisa E.', initials:'LE',role:'Member',bg:'linear-gradient(135deg,#f59e0b,#ef4444)',paid:true,total:'$1,400',joined:'Jan 2025'},
  {name:'Rachel B.',initials:'RB',role:'Member',bg:'linear-gradient(135deg,#ec4899,#8b5cf6)',paid:false,total:'$1,200',joined:'Mar 2025'},
]

function GroupDetail() {
  const params = useSearchParams()
  const name = params.get('name') || 'Family Fund'
  return (
    <div>
      <div className={styles.back}><Link href="/dashboard/groups" className={styles.backLink}>← My circles</Link></div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.sub}>5 members · $200/month · You are admin</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnGhost}>Group settings</button>
          <button className={styles.btnPrimary}>Invite member</button>
        </div>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.statLabel}>Total saved</div><div className={styles.statVal} style={{color:'#60a5fa'}}>$7,200</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>This month</div><div className={styles.statVal} style={{color:'#fbbf24'}}>$1,000</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Members paid</div><div className={styles.statVal} style={{color:'#34d399'}}>3/5</div></div>
        <div className={styles.statCard}><div className={styles.statLabel}>Goal</div><div className={styles.statVal}>$12,000</div></div>
      </div>
      <div className={styles.progSection}>
        <div className={styles.progLabels}><span>Progress to goal</span><span>$7,200 / $12,000 (60%)</span></div>
        <div className={styles.progBar}><div className={styles.progFill} style={{width:'60%'}}/></div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Members — June 2026 payment status</span></div>
        <div className={styles.memberList}>
          {memberData.map(m=>(
            <div key={m.name} className={styles.memberRow}>
              <div className={styles.memberLeft}>
                <div className={styles.av} style={{background:m.bg}}>{m.initials}</div>
                <div><div className={styles.memberName}>{m.name}</div><div className={styles.memberMeta}>{m.role} · Joined {m.joined}</div></div>
              </div>
              <div className={styles.memberRight}>
                <div className={styles.memberTotal}>{m.total} total</div>
                <span className={`${styles.stb} ${m.paid?styles.ok:styles.late}`}>{m.paid?'✓ Paid':'✗ Unpaid'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Group policy summary</span><Link href="/dashboard/policy" className={styles.viewAll}>View full policy →</Link></div>
        <div className={styles.policyGrid}>
          <div className={styles.policyItem}><div className={styles.policyLabel}>Contribution</div><div className={styles.policyVal}>$200 on the 1st of every month</div></div>
          <div className={styles.policyItem}><div className={styles.policyLabel}>Withdrawal</div><div className={styles.policyVal}>Requires 4/5 member vote</div></div>
          <div className={styles.policyItem}><div className={styles.policyLabel}>Quitting</div><div className={styles.policyVal}>30 days notice required</div></div>
          <div className={styles.policyItem}><div className={styles.policyLabel}>New members</div><div className={styles.policyVal}>Unanimous approval</div></div>
        </div>
      </div>
    </div>
  )
}

export default function GroupPage() {
  return <Suspense fallback={<div style={{padding:'2rem',color:'rgba(255,255,255,.5)'}}>Loading...</div>}><GroupDetail /></Suspense>
}