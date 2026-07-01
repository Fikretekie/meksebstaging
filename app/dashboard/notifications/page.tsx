import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const notifs=[
  {ico:'🔔',bg:'rgba(245,158,11,.14)',title:'Payment reminder — Work Circle',body:'Your $100 contribution is due in 3 days. Pay now to keep your on-time record.',time:'2 hours ago',unread:true},
  {ico:'👤',bg:'rgba(37,99,235,.14)',title:'New join request — Family Fund',body:'Daniel H. has applied to join your Family Fund circle. Review their application.',time:'5 hours ago',unread:true},
  {ico:'⚠️',bg:'rgba(239,68,68,.14)',title:'Late payment — Rachel B.',body:"Rachel B. is 5 days overdue on her $200 contribution. A reminder was sent automatically.",time:'1 day ago',unread:true},
  {ico:'🌐',bg:'rgba(139,92,246,.14)',title:'Network connection request',body:'Peter O. from Lagos wants to connect. You share an interest in investment circles.',time:'2 days ago',unread:true},
  {ico:'✅',bg:'rgba(16,185,129,.14)',title:'Payment confirmed — Invest Club',body:'Lisa E. paid her $500 contribution. Group total is now $3,400.',time:'3 days ago',unread:false},
  {ico:'👥',bg:'rgba(37,99,235,.14)',title:'New member — Work Circle',body:'Mike W. was accepted and joined. The circle is now at 6/6 members.',time:'1 week ago',unread:false},
  {ico:'📋',bg:'rgba(245,158,11,.14)',title:'Policy updated — Family Fund',body:'The group admin updated the withdrawal policy. Review the changes.',time:'2 weeks ago',unread:false},
]
export default function NotificationsPage(){
  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 style={{fontSize:"1.6rem",fontWeight:700,letterSpacing:"-.5px"}}>Notifications</h1><p style={{fontSize:"13.5px",color:"rgba(255,255,255,.5)",marginTop:4}}>4 unread alerts.</p></div>
        <button className={styles.btnGhost}>Mark all read</button>
      </div>
      <div className={styles.list}>
        {notifs.map((n,i)=>(
          <div key={i} className={styles.nf} style={{opacity:n.unread?1:.55}}>
            <div className={styles.ico} style={{background:n.bg}}>{n.ico}</div>
            <div className={styles.body}>
              <div className={styles.nfTitle}>{n.title}</div>
              <div className={styles.nfBody}>{n.body}</div>
              <div className={styles.nfTime}>{n.time}</div>
            </div>
            {n.unread && <div className={styles.dot}/>}
          </div>
        ))}
      </div>
    </div>
  )
}