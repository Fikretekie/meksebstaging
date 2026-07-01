'use client'
import Link from 'next/link'
import styles from './Nav.module.css'
export default function Nav() {
  const scrollTo = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.mark}>M</div>
        <span className={styles.name}>Me<span>K</span>seb</span>
      </div>
      <ul className={styles.links}>
        <li><a onClick={()=>scrollTo('features')}>Features</a></li>
        <li><a onClick={()=>scrollTo('how')}>How it works</a></li>
        <li><a onClick={()=>scrollTo('network')}>Network</a></li>
        <li><a onClick={()=>scrollTo('stories')}>Stories</a></li>
      </ul>
      <div className={styles.right}>
        <Link href="/auth/login" className={styles.ghost}>Sign in</Link>
        <Link href="/auth/signup" className={styles.primary}>Get started free</Link>
      </div>
    </nav>
  )
}