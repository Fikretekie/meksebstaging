import Link from 'next/link'
import styles from './not-found.module.css'
export default function NotFound(){
  return(
    <div className={styles.wrap}>
      <div className={styles.o1}/><div className={styles.grid}/>
      <div className={styles.inner}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.sub}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className={styles.btns}>
          <Link href="/" className={styles.btnPrimary}>← Back to home</Link>
          <Link href="/dashboard" className={styles.btnGhost}>Go to dashboard</Link>
        </div>
      </div>
    </div>
  )
}