'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCurrentUser, signOut } from 'aws-amplify/auth'
import styles from './layout.module.css'

const nav = [
  { group:'Overview', items:[
    { href:'/dashboard/',label:'Dashboard',icon:'⊞' },
    { href:'/dashboard/savings/',label:'Savings',icon:'💰' },
    { href:'/dashboard/groups/',label:'My circles',icon:'👥',badge:'3' },
    { href:'/dashboard/payments/',label:'Payments',icon:'💳' },
  ]},
  { group:'Community', items:[
    { href:'/dashboard/network/',label:'Network',icon:'🌐' },
    { href:'/dashboard/requests/',label:'Join requests',icon:'📬',badge:'2' },
    { href:'/dashboard/notifications/',label:'Alerts',icon:'🔔',badge:'4',badgeRed:true },
  ]},
  { group:'Manage', items:[
    { href:'/dashboard/create/',label:'Create circle',icon:'✦' },
    { href:'/dashboard/policy/',label:'Group policy',icon:'📋' },
    { href:'/dashboard/settings/',label:'Settings',icon:'⚙' },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [userName, setUserName] = useState('Loading...')
  const [userEmail, setUserEmail] = useState('')
  const [initials, setInitials] = useState('...')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser()
        const email = user.signInDetails?.loginId || ''
        setUserEmail(email)
        const name = email.split('@')[0]
        setUserName(name)
        setInitials(name.slice(0, 2).toUpperCase())
      } catch (err) {
        window.location.href = '/auth/login/'
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/auth/login/'
    } catch (err) {
      window.location.href = '/auth/login/'
    }
  }

  return (
    <div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <div className={styles.mark}>M</div>
          <span className={styles.name}>Me<span>K</span>seb</span>
        </Link>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userEmail}>{userEmail}</div>
          </div>
          <Link href="/profile/" className={styles.avatar}>{initials}</Link>
          <button onClick={handleSignOut} className={styles.btnGhost}>Sign out</button>
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