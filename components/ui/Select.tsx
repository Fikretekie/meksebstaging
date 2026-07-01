import styles from './Select.module.css'
interface Props {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}
export default function Select({ label, value, onChange, children }: Props) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={styles.select} value={value} onChange={onChange}>{children}</select>
    </div>
  )
}