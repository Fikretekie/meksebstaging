import styles from './DataTable.module.css'
interface Col { key:string; label:string; render?:(val:any,row:any)=>React.ReactNode }
interface Props { columns:Col[]; rows:any[]; title?:string; action?:React.ReactNode }
export default function DataTable({ columns, rows, title, action }: Props) {
  return (
    <div className={styles.card}>
      {(title||action) && <div className={styles.header}>{title&&<div className={styles.title}>{title}</div>}{action}</div>}
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead>
          <tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={c.key}>{c.render?c.render(r[c.key],r):r[c.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}