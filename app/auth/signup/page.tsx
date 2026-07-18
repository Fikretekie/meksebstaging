'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.mark}>M</div>
          <span className={styles.name}>Me<span>K</span>seb</span>
        </Link>

        {/* Desktop nav links */}
        <div className={styles.links}>
          <Link href="#features" className={styles.link}>Features</Link>
          <Link href="#how" className={styles.link}>How it works</Link>
          <Link href="#network" className={styles.link}>Network</Link>
          <Link href="#stories" className={styles.link}>Stories</Link>
        </div>

        {/* Desktop CTA buttons */}
        <div className={styles.cta}>
          <Link href="/auth/login/index.html" className={styles.signin}>Sign in</Link>
          <Link href="/auth/signup/index.html" className={styles.btnPrimary}>Get started free</Link>
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className={styles.mobileDropdown}>
          <Link href="#features" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="#how" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="#network" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Network</Link>
          <Link href="#stories" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Stories</Link>
          <div className={styles.mobileDivider}/>
          <Link href="/auth/login/index.html" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign in</Link>
          <Link href="/auth/signup/index.html" className={styles.mobilePrimary} onClick={() => setMenuOpen(false)}>Get started free →</Link>
        </div>
      )}
    </nav>
  )
}