'use client'
import { useState } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const people=[
  {i:'AM',bg:'linear-gradient(135deg,#8b5cf6,#ec4899)',name:'Aisha M.', loc:'London, UK',   vision:"Looking to build a 6-person circle focused on property investment. Long-term, reliable members only.",   tags:['Real estate','$300/mo','Long-term'],   mo:'$300',mem:'6',hor:'3yr'},
  {i:'CL',bg:'linear-gradient(135deg,#10b981,#06b6d4)',name:'Carlos L.',loc:'Miami, FL',     vision:'Building an emergency fund circle. Stable income and serious commitment required.',                       tags:['Emergency fund','$150/mo','Conservative'],mo:'$150',mem:'5',hor:'2yr'},
  {i:'NK',bg:'linear-gradient(135deg,#f59e0b,#ef4444)',name:'Nina K.',  loc:'Toronto, CA',  vision:'MBA student building an education fund circle. Open to students and early-career professionals.',          tags:['Education','$100/mo','Students ok'],   mo:'$100',mem:'8',hor:'1.5yr'},
  {i:'PO',bg:'linear-gradient(135deg,#06b6d4,#2563eb)',name:'Peter O.', loc:'Lagos, NG',    vision:'Tech entrepreneur building a high-contribution investment club targeting startup equity.',                  tags:['Startup fund','$1k/mo','High conviction'],mo:'$1,000',mem:'4',hor:'5yr'},
  {i:'SR',bg:'linear-gradient(135deg,#ec4899,#8b5cf6)',name:'Sofia R.', loc:'Barcelona, ES',vision:'Travel fund circle — saving toward an annual group trip. Fun, social, flexible.',                         tags:['Travel','$75/mo','Social'],            mo:'$75',mem:'10',hor:'1yr'},
  {i:'DM',bg:'linear-gradient(135deg,#2563eb,#06b6d4)',name:'David M.', loc:'Nairobi, KE',  vision:'Accountant building a long-term retirement savings circle. Financially stable members only.',             tags:['Retirement','$250/mo','Long-term'],    mo:'$250',mem:'5',hor:'10yr'},
]
const goalTags=['All goals','Real estate','Emergency fund','Investment club','Education','Startup fund','Travel','Retirement']
export default function NetworkPage(){
  const [active,setActive]=useState('All goals')
  return(
    <div>
      <PageHeader title="Community network" sub="Find people who share your savings vision and build a circle together." />
      <div className={styles.banner}>
        <div><div className={styles.bannerTitle}>Your network profile is live</div><div className={styles.bannerSub}>12 people viewed your profile this week.</div></div>
        <button className={styles.btnPrimary}>Edit profile</button>
      </div>
      <div className={styles.searchRow}>
        <input className={styles.searchInput} type="text" placeholder="Search by name, goal, or location..." />
        <button className={styles.btnPrimary}>Search</button>
      </div>
      <div className={styles.tagRow}>{goalTags.map(t=><button key={t} className={`${styles.tag} ${active===t?styles.tagOn:''}`} onClick={()=>setActive(t)}>{t}</button>)}</div>
      <div className={styles.grid}>
        {people.map(p=>(
          <div key={p.name} className={styles.pc}>
            <div className={styles.pcHead}><div className={styles.av} style={{background:p.bg}}>{p.i}</div><div><div className={styles.pcName}>{p.name}</div><div className={styles.pcLoc}>📍 {p.loc} · ✓ Verified</div></div></div>
            <p className={styles.pcVision}>{p.vision}</p>
            <div className={styles.pcTags}>{p.tags.map(t=><span key={t} className={styles.pcTag}>{t}</span>)}</div>
            <div className={styles.pcNums}>
              <div><div className={styles.nv}>{p.mo}</div><div className={styles.nl}>Monthly</div></div>
              <div><div className={styles.nv}>{p.mem}</div><div className={styles.nl}>Members</div></div>
              <div><div className={styles.nv}>{p.hor}</div><div className={styles.nl}>Horizon</div></div>
            </div>
            <button className={styles.cb}>Connect with {p.name.split(' ')[0]} →</button>
          </div>
        ))}
      </div>
    </div>
  )
}