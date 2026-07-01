'use client'
import Link from 'next/link'
import styles from './page.module.css'

const activity = [
  {icon:'💳',text:'Paid $200 contribution to Family Fund',time:'Jun 1, 2026'},
  {icon:'✅',text:'Joined Invest Club as a founding member',time:'May 15, 2026'},
  {icon:'👥',text:'Accepted Rachel H. into Family Fund',time:'May 10, 2026'},
  {icon:'💳',text:'Paid $500 contribution to Invest Club',time:'May 1, 2026'},
  {icon:'✦',text:'Created Invest Club savings circle',time:'Apr 28, 2026'},
]

export default function ProfilePage(){
  return(
    <div className={styles.wrap}>
      <div className={styles.o1}/><div className={styles.grid}/>
      <div className={styles.inner}>
        <div className={styles.back}><Link href="/dashboard" className={styles.backLink}>← Dashboard</Link></div>
        <div className={styles.profileCard}>
          <div className={styles.profileTop}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>JR</div>
              <div className={styles.onlineDot}/>
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>James Richardson</h1>
              <div className={styles.location}>📍 Houston, Texas, USA</div>
              <div className={styles.verifiedRow}>
                <span className={styles.verified}>✓ ID Verified</span>
                <span className={styles.verified}>✓ Card linked</span>
                <span className={styles.memberSince}>Member since Jan 2025</span>
              </div>
            </div>
            <Link href="/dashboard/settings" className={styles.editBtn}>Edit profile</Link>
          </div>
          <div className={styles.bio}>Software engineer based in Houston. Building wealth through community savings and long-term investment. Active in 3 savings circles.</div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}><div className={styles.statVal}>3</div><div className={styles.statLbl}>Active circles</div></div>
            <div className={styles.statItem}><div className={styles.statVal}>$14,800</div><div className={styles.statLbl}>Total saved</div></div>
            <div className={styles.statItem}><div className={styles.statVal}>96%</div><div className={styles.statLbl}>On-time rate</div></div>
            <div className={styles.statItem}><div className={styles.statVal}>Top 8%</div><div className={styles.statLbl}>Network rank</div></div>
          </div>
        </div>
        <div className={styles.twoCols}>
          <div>
            <div className={styles.sectionTitle}>My circles</div>
            <div className={styles.circleList}>
              {[
                {name:'Family Fund',role:'Admin',members:5,monthly:'$200',color:'#60a5fa'},
                {name:'Work Circle',role:'Member',members:6,monthly:'$100',color:'#34d399'},
                {name:'Invest Club',role:'Admin',members:3,monthly:'$500',color:'#a78bfa'},
              ].map(c=>(
                <div key={c.name} className={styles.circleItem}>
                  <div className={styles.circleDot} style={{background:c.color}}/>
                  <div className={styles.circleInfo}>
                    <div className={styles.circleName}>{c.name}</div>
                    <div className={styles.circleMeta}>{c.role} · {c.members} members · {c.monthly}/mo</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sectionTitle} style={{marginTop:'1.75rem'}}>Network goal</div>
            <div className={styles.goalCard}>
              <div className={styles.goalLabel}>Looking for</div>
              <div className={styles.goalValue}>Investment club members</div>
              <div className={styles.goalSub}>Monthly budget: $500–$1,000 · Time horizon: 5yr</div>
            </div>
          </div>
          <div>
            <div className={styles.sectionTitle}>Recent activity</div>
            <div className={styles.activityList}>
              {activity.map((a,i)=>(
                <div key={i} className={styles.actItem}>
                  <div className={styles.actIcon}>{a.icon}</div>
                  <div className={styles.actBody}><div className={styles.actText}>{a.text}</div><div className={styles.actTime}>{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}