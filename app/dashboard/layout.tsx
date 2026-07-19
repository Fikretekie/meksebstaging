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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const loadUser = async (retryCount = 0) => {
      try {
        const attributes = await fetchUserAttributes()
        const email = attributes.email || ''
        setUserEmail(email)
        const name = email.split('@')[0]
        setUserName(name)
        setInitials(name.slice(0, 2).toUpperCase())
        setAuthReady(true)

        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircleCount(data.circles.length)
        }
      } catch (err) {
        if (retryCount < 2) {
          setTimeout(() => loadUser(retryCount + 1), 500)
        } else {
          window.location.href = '/auth/login/index.html'
        }
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut({ global: true })
    } catch (err) {
      console.error(err)
    } finally {
      window.location.href = '/auth/login/index.html'
    }
  }

  const nav = [
    { group:'Overview', items:[
      { href:'/dashboard/index.html', label:'Dashboard', icon:'⊞' },
      { href:'/dashboard/savings/index.html', label:'Savings', icon:'💰' },
      { href:'/dashboard/groups/index.html', label:'My circles', icon:'👥', badge: circleCount > 0 ? String(circleCount) : null },
      { href:'/dashboard/payments/index.html', label:'Payments', icon:'💳' },
    ]},
    { group:'Community', items:[
      { href:'/dashboard/network/index.html', label:'Network', icon:'🌐' },
      { href:'/dashboard/requests/index.html', label:'Join requests', icon:'📬' },
      { href:'/dashboard/notifications/index.html', label:'Alerts', icon:'🔔' },
    ]},
    { group:'Manage', items:[
      { href:'/dashboard/create/index.html', label:'Create circle', icon:'✦' },
      { href:'/dashboard/policy/index.html', label:'Group policy', icon:'📋' },
      { href:'/dashboard/settings/index.html', label:'Settings', icon:'⚙' },
    ]},
  ]

  if (!authReady) {
    return (
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        minHeight:'100vh',
        background:'var(--navy)',
        color:'rgba(255,255,255,.5)',
        fontSize:'14px',
      }}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'2rem',marginBottom:'1rem'}}>
            <div className={styles.mark} style={{margin:'0 auto 1rem',width:40,height:40,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:'white'}}>M</div>
          </div>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div>
      <nav className={styles.nav}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span/>
            <span/>
            <span/>
          </button>
          <Link href="/dashboard/index.html" className={styles.logo}>
            <div className={styles.mark}>M</div>
            <span className={styles.name}>Me<span>K</span>seb</span>
          </Link>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userEmail}>{userEmail}</div>
          </div>
          <Link href="/dashboard/profile/index.html" className={styles.avatar}>{initials}</Link>
          <button onClick={handleSignOut} className={styles.btnGhost}>Sign out</button>
        </div>
      </nav>

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={styles.shell}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          {nav.map(g => (
            <div key={g.group} className={styles.sbGroup}>
              <div className={styles.sbLabel}>{g.group}</div>
              {g.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.si} ${path === item.href ? styles.siActive : ''}`}
                  onClick={() => setSidebarOpen(false)}
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