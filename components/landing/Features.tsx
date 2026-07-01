import styles from './Features.module.css'
const feats=[
  {ico:'👥',bg:'rgba(37,99,235,.14)',t:'Private savings circles',d:"Create a closed group with custom rules, monthly targets, and full privacy. Your circle, your terms."},
  {ico:'💳',bg:'rgba(6,182,212,.14)',t:'Seamless card payments',d:'Every member contributes directly from their card. Payments tracked and confirmed in real time.'},
  {ico:'📊',bg:'rgba(245,158,11,.14)',t:'Live payment tracking',d:"See exactly who paid, who's pending, and the running total — updated the moment a payment clears."},
  {ico:'🔔',bg:'rgba(139,92,246,.14)',t:'Automatic reminders',d:"The system sends monthly reminders so you don't have to. Email, SMS, and in-app — automatically."},
  {ico:'🌍',bg:'rgba(16,185,129,.14)',t:'Multi-country, multi-currency',d:'Members from different countries? Mekseb handles cross-border payments and currency conversion.'},
  {ico:'📋',bg:'rgba(236,72,153,.14)',t:'Group-written policy',d:"Every circle sets its own rules — withdrawals, quitting, adding members — enforced by the platform."},
]
export default function Features(){
  return(
    <section className={styles.sec} id="features">
      <div className={styles.lbl}>Why Mekseb</div>
      <h2 className={styles.h2}>Built for real communities</h2>
      <p className={styles.p}>Every feature was designed around one idea: money is better when it moves together.</p>
      <div className={styles.grid}>
        {feats.map(f=>(
          <div key={f.t} className={styles.card}>
            <div className={styles.ico} style={{background:f.bg}}>{f.ico}</div>
            <h3>{f.t}</h3><p>{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}