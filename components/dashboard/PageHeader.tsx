import styles from './PageHeader.module.css'
import Link from 'next/link'
interface Props { title:string; sub?:string; btnLabel?:string; btnHref?:string; onBtn?:()=>void }
export default function PageHeader({ title, sub, btnLabel, btnHref }: Props) {
  return (
    <div className={styles.ph}>
      <div><h1 className={styles.title}>{title}</h1>{sub && <p className={styles.sub}>{sub}</p>}</div>
      {btnLabel && btnHref && <Link href={btnHref} className={styles.btn}>{btnLabel}</Link>}
    </div>
  )
}