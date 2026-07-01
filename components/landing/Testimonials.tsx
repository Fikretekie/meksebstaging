import styles from './Testimonials.module.css'
const testi=[
  {s:'★★★★★',q:'We started a 6-person family circle at $150/month. Within a year we had a down payment on a rental property. Mekseb made it feel effortless.',n:'Marcus J.',r:'Family Circle · Houston, TX',bg:'linear-gradient(135deg,#2563eb,#06b6d4)',i:'MJ'},
  {s:'★★★★★',q:"I found 4 people on the Mekseb network with the same vision. We'd never met — now we're on year two and completely trust each other.",n:'Amina O.',r:'Network circle · London, UK',bg:'linear-gradient(135deg,#8b5cf6,#ec4899)',i:'AO'},
  {s:'★★★★★',q:'My coworkers and I use it for our savings pool. Automatic reminders saved us from awkward conversations. The group policy feature is brilliant.',n:'David K.',r:'Work Circle · Toronto, CA',bg:'linear-gradient(135deg,#10b981,#06b6d4)',i:'DK'},
]
export default function Testimonials(){
  return(
    <section className={styles.sec} id="stories">
      <div className={styles.lbl}>Real stories</div>
      <h2 className={styles.h2}>What members say</h2>
      <p className={styles.p}>Thousands of people are already saving smarter with Mekseb.</p>
      <div className={styles.grid}>
        {testi.map(t=>(
          <div key={t.n} className={styles.card}>
            <div className={styles.stars}>{t.s}</div>
            <p className={styles.quote}>&ldquo;{t.q}&rdquo;</p>
            <div className={styles.author}>
              <div className={styles.av} style={{background:t.bg}}>{t.i}</div>
              <div><div className={styles.name}>{t.n}</div><div className={styles.role}>{t.r}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}