'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './layout.module.css'

const nav = [
  { group:'Overview', items:[
    { href:'/dashboard',label:'Dashboard',icon:'⊞' },
    { href:'/dashboard/savings',label:'Savings',icon:'💰' },
    { href:'/dashboard/groups',label:'My circles',icon:'👥',badge:'3' },
    { href:'/dashboard/payments',label:'Payments',icon:'💳' },
  ]},
  { group:'Community', items:[
    { href:'/dashboard/network',label:'Network',icon:'🌐' },
    { href:'/dashboard/requests',label:'Join requests',icon:'📬',badge:'2' },
    { href:'/dashboard/notifications',label:'Alerts',icon:'🔔',badge:'4',badgeRed:true },
  ]},
  { group:'Manage', items:[
    { href:'/dashboard/create',label:'Create circle',icon:'✦' },
    { href:'/dashboard/policy',label:'Group policy',icon:'📋' },
    { href:'/dashboard/settings',label:'Settings',icon:'⚙' },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <div className={styles.mark}>M</div>
          <span className={styles.name}>Me<span>K</span>seb</span>
        </Link>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>James Richardson</div>
            <div className={styles.userEmail}>james.r@email.com</div>
          </div>
          <Link href="/profile" className={styles.avatar}>JR</Link>
          <Link href="/auth/login" className={styles.btnGhost}>Sign out</Link>
        </div>
      </nav>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          {nav.map(g=>(
            <div key={g.group} className={styles.sbGroup}>
              <div className={styles.sbLabel}>{g.group}</div>
              {g.items.map(item=>(
                <Link key={item.href} href={item.href} className={`${styles.si} ${path===item.href?styles.siActive:''}`}>
                  <span className={styles.siIcon}>{item.icon}</span>
                  {item.label}
                  {item.badge && <span className={`${styles.badge} ${item.badgeRed?styles.badgeRed:''}`}>{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}