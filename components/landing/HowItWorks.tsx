import styles from './HowItWorks.module.css'
const steps=[
  {n:'01',t:'Create your circle',d:'Name it, set the monthly amount, member limit, schedule, and your group policy.'},
  {n:'02',t:'Invite or recruit',d:'Send private invites or post a listing with qualifications for others to apply.'},
  {n:'03',t:'Contribute monthly',d:'Each member pays on schedule. Every contribution tracked and the group notified instantly.'},
  {n:'04',t:'Watch it grow',d:"Your circle's pot builds every month. Use it for investments, emergencies, or big goals."},
]
export default function HowItWorks(){
  return(
    <section className={styles.sec} id="how">
      <div className={styles.lbl}>Simple by design</div>
      <h2 className={styles.h2}>Up and running in 4 steps</h2>
      <p className={styles.p}>Your savings circle can be live in under 5 minutes.</p>
      <div className={styles.grid}>
        {steps.map(s=>(
          <div key={s.n} className={styles.step}>
            <div className={styles.ring}>{s.n}</div>
            <h3>{s.t}</h3><p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}