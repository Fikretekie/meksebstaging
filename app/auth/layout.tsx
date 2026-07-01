import Link from 'next/link'
import styles from './layout.module.css'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.o1}/><div className={styles.o2}/><div className={styles.grid}/>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.mark}>M</div>
          <span className={styles.name}>Me<span>K</span>seb</span>
        </Link>
        {children}
      </div>
    </div>
  )
}