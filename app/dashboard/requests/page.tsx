import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const reqs=[
  {i:'DH',bg:'linear-gradient(135deg,#f59e0b,#ef4444)',name:'Daniel H.', target:'Family Fund', date:'Jun 25, 2026',
   msg:"Software engineer with stable income and 3 years of savings circle experience. I commit to every payment without exception.",
   tags:['✓ ID Verified','✓ Credit checked','✓ Full-time employed','USA 🇺🇸','$200/mo budget']},
  {i:'RH',bg:'linear-gradient(135deg,#06b6d4,#8b5cf6)',name:'Rachel H.',target:'Invest Club', date:'Jun 26, 2026',
   msg:'Financial analyst, 7 years experience, clean record. I take community savings seriously and want a circle that matches my commitment.',
   tags:['✓ ID Verified','✓ Full-time employed','UK 🇬🇧','$500/mo budget']},
]
export default function RequestsPage(){
  return(
    <div>
      <PageHeader title="Join requests" sub="2 applicants waiting for your review." />
      {reqs.map(r=>(
        <div key={r.name} className={styles.rq}>
          <div className={styles.rqHead}><div className={styles.av} style={{background:r.bg}}>{r.i}</div><div><div className={styles.rqName}>{r.name}</div><div className={styles.rqMeta}>Applying to: <strong style={{color:'white'}}>{r.target}</strong> · {r.date}</div></div></div>
          <p className={styles.rqMsg}>{r.msg}</p>
          <div className={styles.tags}>{r.tags.map(t=><span key={t} className={styles.tag}>{t}</span>)}</div>
          <div className={styles.actions}>
            <button className={styles.btnAccept}>✓ Accept</button>
            <button className={styles.btnReject}>✗ Decline</button>
            <button className={styles.btnGhost}>View profile</button>
          </div>
        </div>
      ))}
    </div>
  )
}