'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchUserAttributes, signOut } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import styles from './layout.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [userName, setUserName] = useState('Loading...')
  const [userEmail, setUserEmail] = useState('')
  const [initials, setInitials] = useState('...')
  const [circleCount, setCircleCount] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const loadUser = async (retryCount = 0) => {
      try {
        const attributes = await fetchUserAttributes()
        const email = attributes.email || ''
        setUserEmail(email)
        const name = email.split('@')[0]
        setUserName(name)
        setInitials(name.slice(0, 2).toUpperCase())
        setAuthChecked(true)

        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircleCount(data.circles.length)
        }
      } catch (err) {
        // Retry up to 3 times before redirecting
        if (retryCount < 3) {
          setTimeout(() => loadUser(retryCount + 1), 1000)
        } else {
          window.location.href = '/auth/login/index.html'
        }
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/auth/login/index.html'
    } catch (err) {
      window.location.href = '/auth/login/index.html'
    }
  }

  const nav = [
    { group:'Overview', items:[
      { href:'/dashboard/', label:'Dashboard', icon:'⊞' },
      { href:'/dashboard/savings/', label:'Savings', icon:'💰' },
      { href:'/dashboard/groups/', label:'My circles', icon:'👥', badge: circleCount > 0 ? String(circleCount) : null },
      { href:'/dashboard/payments/', label:'Payments', icon:'💳' },
    ]},
    { group:'Community', items:[
      { href:'/dashboard/network/', label:'Network', icon:'🌐' },
      { href:'/dashboard/requests/', label:'Join requests', icon:'📬' },
      { href:'/dashboard/notifications/', label:'Alerts', icon:'🔔' },
    ]},
    { group:'Manage', items:[
      { href:'/dashboard/create/', label:'Create circle', icon:'✦' },
      { href:'/dashboard/policy/', label:'Group policy', icon:'📋' },
      { href:'/dashboard/settings/', label:'Settings', icon:'⚙' },
    ]},
  ]

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
          <Link href="/dashboard/profile/" className={styles.avatar}>{initials}</Link>
          <button onClick={handleSignOut} className={styles.btnGhost}>Sign out</button>
        </div>
      </nav>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          {nav.map(g => (
            <div key={g.group} className={styles.sbGroup}>
              <div className={styles.sbLabel}>{g.group}</div>
              {g.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.si} ${path === item.href ? styles.siActive : ''}`}
                >
                  <span className={styles.siIcon}>{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
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