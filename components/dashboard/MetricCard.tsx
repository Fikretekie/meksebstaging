import styles from './MetricCard.module.css'
interface Props { color:'blue'|'green'|'gold'|'purple'|'cyan'; label:string; value:string; note:string; noteType?:'up'|'down'|'neutral' }
export default function MetricCard({ color, label, value, note, noteType='up' }: Props) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.note} ${styles[noteType]}`}>{note}</div>
    </div>
  )
}