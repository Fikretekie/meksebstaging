'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import styles from './page.module.css'

export default function NotificationsPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const email = attributes.email || ''
        setUserName(email.split('@')[0])
        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)
          // Generate real notifications based on actual circles
          const notifs: any[] = []
          data.circles.forEach((c: any) => {
            // Payment due notification
            const nextMonth = new Date()
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth.setDate(1)
            const daysUntil = Math.ceil((nextMonth.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            notifs.push({
              ico: '💰',
              bg: 'rgba(37,99,235,.14)',
              title: `Circle active — ${c.name}`,
              body: `Your ${c.name} circle is active. Next contribution of $${c.amount} is due in ${daysUntil} days.`,
              time: 'Just now',
              unread: true,
            })
          })
          // Welcome notification
          notifs.push({
            ico: '🎉',
            bg: 'rgba(16,185,129,.14)',
            title: 'Welcome to Mekseb!',
            body: `Welcome ${email.split('@')[0]}! Your account is set up and ready. Create or join a savings circle to get started.`,
            time: 'Recently',
            unread: false,
          })
          setNotifications(notifs)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div>
      <div style={{
        display:'flex',
        alignItems:'flex-start',
        justifyContent:'space-between',
        marginBottom:'2rem',
        flexWrap:'wrap',
        gap:'1rem',
      }}>
        <div>
          <h1 style={{fontSize:'1.6rem',fontWeight:700,letterSpacing:'-.5px'}}>
            Notifications
          </h1>
          <p style={{fontSize:'13.5px',color:'rgba(255,255,255,.5)',marginTop:4}}>
            {loading ? 'Loading...' : unreadCount > 0 ? `${unreadCount} unread alert${unreadCount !== 1 ? 's' : ''}.` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            className={styles.btnGhost}
            onClick={() => setNotifications(n => n.map(x => ({...x, unread: false})))}
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{
          textAlign:'center',
          padding:'4rem 2rem',
          background:'rgba(255,255,255,.03)',
          border:'1px solid rgba(255,255,255,.08)',
          borderRadius:'16px',
        }}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔔</div>
          <div style={{fontSize:'1.2rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
            No notifications yet
          </div>
          <div style={{fontSize:'14px',color:'rgba(255,255,255,.5)'}}>
            Notifications about your circles, payments, and activity will appear here.
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map((n, i) => (
            <div
              key={i}
              className={styles.nf}
              style={{opacity: n.unread ? 1 : .55, cursor:'pointer'}}
              onClick={() => setNotifications(prev =>
                prev.map((x, idx) => idx === i ? {...x, unread: false} : x)
              )}
            >
              <div className={styles.ico} style={{background: n.bg}}>{n.ico}</div>
              <div className={styles.body}>
                <div className={styles.nfTitle}>{n.title}</div>
                <div className={styles.nfBody}>{n.body}</div>
                <div className={styles.nfTime}>{n.time}</div>
              </div>
              {n.unread && <div className={styles.dot}/>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}