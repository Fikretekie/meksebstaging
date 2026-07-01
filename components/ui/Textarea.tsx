import styles from './Textarea.module.css'
interface Props {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  hint?: string
  rows?: number
}
export default function Textarea({ label, placeholder, value, onChange, hint, rows=4 }: Props) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={styles.ta} placeholder={placeholder} value={value} onChange={onChange} rows={rows} />
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  )
}