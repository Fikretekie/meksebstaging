import styles from './Card.module.css'
interface Props { children: React.ReactNode; className?: string; topColor?: string }
export default function Card({ children, className, topColor }: Props) {
  return (
    <div className={`${styles.card} ${className||''}`}>
      {topColor && <div className={styles.topBar} style={{ background: topColor }} />}
      {children}
    </div>
  )
}