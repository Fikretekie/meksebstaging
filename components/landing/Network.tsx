import Link from 'next/link'
import styles from './Network.module.css'
const people=[
  {i:'JR',bg:'linear-gradient(135deg,#2563eb,#06b6d4)',n:'James R.',t:'Real estate'},
  {i:'AM',bg:'linear-gradient(135deg,#8b5cf6,#ec4899)',n:'Aisha M.',t:'Startup fund'},
  {i:'CL',bg:'linear-gradient(135deg,#10b981,#06b6d4)',n:'Carlos L.',t:'Emergency fund'},
  {i:'NK',bg:'linear-gradient(135deg,#f59e0b,#ef4444)',n:'Nina K.',t:'Education'},
  {i:'PO',bg:'linear-gradient(135deg,#06b6d4,#2563eb)',n:'Peter O.',t:'Invest club'},
  {i:'SR',bg:'linear-gradient(135deg,#ec4899,#8b5cf6)',n:'Sofia R.',t:'Travel fund'},
]
export default function Network(){
  return(
    <section className={styles.sec} id="network">
      <div className={styles.lbl}>The Mekseb Network</div>
      <h2 className={styles.h2}>Find your people</h2>
      <p className={styles.p}>Don&apos;t have a group yet? Connect with people who share your financial vision and build a circle together.</p>
      <div className={styles.card}>
        <div className={styles.hub}>M</div>
        <div className={styles.people}>
          {people.map(p=>(
            <div key={p.i} className={styles.np}>
              <div className={styles.av} style={{background:p.bg}}>{p.i}</div>
              <div className={styles.npName}>{p.n}</div>
              <div className={styles.npTag}>{p.t}</div>
            </div>
          ))}
        </div>
        <p className={styles.desc}>Browse verified members by goal, contribution range, or country. Message, connect, and form a circle — all inside Mekseb.</p>
        <Link href="/auth/signup" className={styles.btn}>Browse the network →</Link>
      </div>
    </section>
  )
}