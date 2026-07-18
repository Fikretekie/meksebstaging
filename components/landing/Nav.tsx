'use client'
import { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.mark}>M</div>
          <span className={styles.name}>Me<span>K</span>seb</span>
        </div>

        {/* Desktop nav links */}
        <ul className={styles.links}>
          <li><a onClick={()=>scrollTo('features')} style={{cursor:'pointer'}}>Features</a></li>
          <li><a onClick={()=>scrollTo('how')} style={{cursor:'pointer'}}>How it works</a></li>
          <li><a onClick={()=>scrollTo('network')} style={{cursor:'pointer'}}>Network</a></li>
          <li><a onClick={()=>scrollTo('stories')} style={{cursor:'pointer'}}>Stories</a></li>
        </ul>

        {/* Desktop CTA buttons */}
        <div className={styles.cta}>
          <a href="/auth/login/index.html" className={styles.signin}>Sign in</a>
          <a href="/auth/signup/index.html" className={styles.btnPrimary}>Get started free</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.mobileMenu}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen1 : styles.bar}/>
          <span className={menuOpen ? styles.barOpen2 : styles.bar}/>
          <span className={menuOpen ? styles.barOpen3 : styles.bar}/>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={styles.mobileDropdown}>
          <a onClick={()=>scrollTo('features')} className={styles.mobileLink}>Features</a>
          <a onClick={()=>scrollTo('how')} className={styles.mobileLink}>How it works</a>
          <a onClick={()=>scrollTo('network')} className={styles.mobileLink}>Network</a>
          <a onClick={()=>scrollTo('stories')} className={styles.mobileLink}>Stories</a>
          <div className={styles.mobileDivider}/>
          <a href="/auth/login/index.html" className={styles.mobileLink}>Sign in</a>
          <a href="/auth/signup/index.html" className={styles.mobilePrimary}>Get started free →</a>
        </div>
      )}
    </nav>
  )
}