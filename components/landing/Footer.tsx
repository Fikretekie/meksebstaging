import styles from './Footer.module.css'
const links=['About','How it works','Security','Privacy policy','Terms','Contact']
export default function Footer(){
  return(
    <footer className={styles.footer}>
      <div className={styles.logo}>Me<span>K</span>seb</div>
      <p className={styles.tagline}>Save together. Grow together.</p>
      <div className={styles.links}>{links.map(l=><a key={l}>{l}</a>)}</div>
      <p className={styles.copy}>© 2026 Mekseb Inc. All rights reserved. Powered by AWS.</p>
    </footer>
  )
}