import styles from './Badge.module.css'
interface Props { children: React.ReactNode; variant?: 'green'|'gold'|'red'|'blue'|'purple' }
export default function Badge({ children, variant='green' }: Props) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}