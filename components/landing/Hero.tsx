import Link from 'next/link'
import styles from './Hero.module.css'
export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.o1}/><div className={styles.o2}/><div className={styles.o3}/><div className={styles.o4}/>
      <div className={styles.grid}/><div className={styles.fade}/>
      <div className={styles.inner}>
        <div className={styles.pill}><div className={styles.pulse}/>Trusted by 1,200+ savings circles worldwide</div>
        <h1 className={styles.h1}>Save together.<br/><span className={styles.grad}>Grow together.</span></h1>
        <p className={styles.sub}>Mekseb is the modern platform for community savings — where trusted circles of friends, family, and coworkers pool money, build wealth, and invest in their shared future.</p>
        <div className={styles.btns}>
          <Link href="/auth/signup" className={styles.btnHero}>Start your circle — it&apos;s free →</Link>
          <Link href="/auth/login" className={styles.btnOutline}>Explore the dashboard</Link>
        </div>
        <div className={styles.statsBar}>
          <div className={styles.stat}><div className={styles.statN}>$2.4M+</div><div className={styles.statL}>Saved by members</div></div>
          <div className={styles.stat}><div className={styles.statN}>1,200+</div><div className={styles.statL}>Active circles</div></div>
          <div className={styles.stat}><div className={styles.statN}>45+</div><div className={styles.statL}>Countries</div></div>
          <div className={styles.stat}><div className={styles.statN}>99.9%</div><div className={styles.statL}>Uptime</div></div>
        </div>
      </div>
      <div className={styles.scrollCue}><div className={styles.ring}>↓</div><span>Scroll</span></div>
    </section>
  )
}