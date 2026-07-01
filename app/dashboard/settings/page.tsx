'use client'
import Toggle from '@/components/ui/Toggle'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
export default function SettingsPage(){
  return(
    <div>
      <PageHeader title="Settings" sub="Manage your account, security, and preferences." />
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(37,99,235,.14)'}}>👤</div><div className={styles.cardTitle}>Profile</div></div>
          <div className={styles.row}><span>Full name</span><span className={styles.val}>James Richardson</span></div>
          <div className={styles.row}><span>Email</span><span className={styles.val}>james.r@email.com</span></div>
          <div className={styles.row}><span>Country</span><span className={styles.val}>United States 🇺🇸</span></div>
          <div className={styles.row}><span>ID verified</span><span style={{color:'#34d399',fontSize:'13px',fontWeight:600}}>✓ Verified</span></div>
          <div className={styles.row}><span>Member since</span><span className={styles.val}>Jan 2025</span></div>
          <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}}>Edit profile</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(6,182,212,.14)'}}>🔔</div><div className={styles.cardTitle}>Notifications</div></div>
          <div className={styles.row}><span>Payment reminders</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Late payment alerts</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Join requests</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Network messages</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Email digest</span><Toggle defaultOn={false}/></div>
          <div className={styles.row}><span>SMS alerts</span><Toggle defaultOn={false}/></div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(245,158,11,.14)'}}>💳</div><div className={styles.cardTitle}>Payment method</div></div>
          <div className={styles.row}><span>Card</span><span style={{color:'#60a5fa',fontSize:'13px'}}>Visa ···4242</span></div>
          <div className={styles.row}><span>Expires</span><span className={styles.val}>09/28</span></div>
          <div className={styles.row}><span>Billing name</span><span className={styles.val}>James Richardson</span></div>
          <div className={styles.row}><span>Auto-pay</span><Toggle defaultOn={true}/></div>
          <div style={{display:'flex',gap:'8px',marginTop:'1.1rem'}}>
            <button className={styles.btnGhost} style={{flex:1}}>Change card</button>
            <button className={styles.btnGhost} style={{flex:1}}>Add card</button>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(139,92,246,.14)'}}>🔒</div><div className={styles.cardTitle}>Security</div></div>
          <div className={styles.row}><span>Two-factor auth</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Login alerts</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Password</span><span className={styles.val}>Changed 30d ago</span></div>
          <div className={styles.row}><span>Active sessions</span><span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer'}}>2 active →</span></div>
          <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}}>Change password</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(16,185,129,.14)'}}>🌐</div><div className={styles.cardTitle}>Network profile</div></div>
          <div className={styles.row}><span>Profile visible</span><Toggle defaultOn={true}/></div>
          <div className={styles.row}><span>Goal</span><span className={styles.val}>Investment club</span></div>
          <div className={styles.row}><span>Monthly budget</span><span className={styles.val}>$500–$1,000</span></div>
          <div className={styles.row}><span>Profile views</span><span style={{color:'#60a5fa',fontSize:'13px'}}>12 this week</span></div>
          <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}}>Edit network profile</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.ico} style={{background:'rgba(239,68,68,.12)'}}>⚠️</div><div className={styles.cardTitle}>Danger zone</div></div>
          <div className={styles.row}><span>Leave a circle</span><span style={{color:'#f87171',fontSize:'13px',cursor:'pointer'}}>Choose →</span></div>
          <div className={styles.row}><span>Download my data</span><span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer'}}>Export →</span></div>
          <div className={styles.row}><span>Delete account</span><span style={{color:'#f87171',fontSize:'13px',cursor:'pointer'}}>Request →</span></div>
        </div>
      </div>
    </div>
  )
}