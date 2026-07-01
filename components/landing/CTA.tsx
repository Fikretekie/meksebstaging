import Link from 'next/link'
import styles from './CTA.module.css'
export default function CTA(){
  return(
    <section className={styles.sec}>
      <div className={styles.box}>
        <div className={styles.orb}/>
        <div className={styles.pill}><div className={styles.pulse}/>No credit card required</div>
        <h2 className={styles.h2}>Ready to save together.<br/><span className={styles.grad}>Grow together?</span></h2>
        <p className={styles.p}>Create your circle in under 5 minutes. Invite your people and start building toward your shared future — today.</p>
        <div className={styles.btns}>
          <Link href="/auth/signup" className={styles.btnHero}>Create your circle →</Link>
          <Link href="/auth/login" className={styles.btnOutline}>Sign in</Link>
        </div>
      </div>
    </section>
  )
}