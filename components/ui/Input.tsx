import styles from './Input.module.css'
interface Props {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  hint?: string
  error?: string
  required?: boolean
}
export default function Input({ label, type="text", placeholder, value, onChange, hint, error, required }: Props) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.req}> *</span>}</label>}
      <input className={`${styles.input} ${error ? styles.inputErr : ""}`} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} />
      {hint && !error && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}