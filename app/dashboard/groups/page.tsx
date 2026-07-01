'use client'
import Link from 'next/link'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const groups=[
  {name:'Family Fund', meta:'5 members · $200/mo · Admin', saved:'$7,200', goal:'$12,000', pct:60, total:'$1,000/mo', color:'blue',   members:[{i:'JR',c:'#2563eb,#06b6d4'},{i:'SM',c:'#8b5cf6,#ec4899'},{i:'TK',c:'#10b981,#06b6d4'},{i:'LE',c:'#f59e0b,#ef4444'},{i:'RB',c:'#ec4899,#8b5cf6'}] },
  {name:'Work Circle', meta:'6 members · $100/mo · Member',saved:'$4,200', goal:'$7,200',  pct:58, total:'$600/mo',   color:'green',  members:[{i:'JR',c:'#2563eb,#06b6d4'},{i:'MW',c:'#06b6d4,#2563eb'},{i:'TK',c:'#10b981,#06b6d4'},{i:'+3',c:'#8b5cf6,#ec4899'}] },
  {name:'Invest Club', meta:'3 members · $500/mo · Admin', saved:'$3,400', goal:'$6,000',  pct:57, total:'$1,500/mo', color:'purple', members:[{i:'LE',c:'#f59e0b,#ef4444'},{i:'RB',c:'#ec4899,#8b5cf6'},{i:'JR',c:'#2563eb,#06b6d4'}] },
]
const barColor: Record<string,string>={blue:'linear-gradient(90deg,#2563eb,#06b6d4)',green:'linear-gradient(90deg,#10b981,#34d399)',purple:'linear-gradient(90deg,#8b5cf6,#ec4899)'}
export default function GroupsPage(){
  return(
    <div>
      <PageHeader title="My circles" sub="You manage or belong to 3 savings circles." btnLabel="+ New circle" btnHref="/dashboard/create" />
      <div className={styles.grid}>
        {groups.map(g=>(
          <Link key={g.name} href={`/dashboard/group?name=${encodeURIComponent(g.name)}`} className={styles.gc}>
            <div className={styles.topBar} style={{background:barColor[g.color]}}/>
            <div className={styles.gcHead}>
              <div><div className={styles.gcName}>{g.name}</div><div className={styles.gcMeta}>{g.meta}</div></div>
              <span className={styles.activeBadge}>Active</span>
            </div>
            <div className={styles.progLabels}><span>Saved</span><span>{g.saved} / {g.goal}</span></div>
            <div className={styles.progBar}><div className={styles.progFill} style={{width:`${g.pct}%`,background:barColor[g.color]}}/></div>
            <div className={styles.gcFoot}>
              <div className={styles.avStack}>{g.members.map(m=><div key={m.i} className={styles.av} style={{background:`linear-gradient(135deg,${m.c})`}}>{m.i}</div>)}</div>
              <div className={styles.amt}><div className={styles.amtVal}>{g.total}</div><div className={styles.amtLbl}>group total</div></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}