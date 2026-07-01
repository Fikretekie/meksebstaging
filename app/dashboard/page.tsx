import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const payments = [
  { name:'James R. (You)', initials:'JR', color:'blue',   circle:'Family Fund',  amount:'$200', due:'Jun 1', status:'paid' },
  { name:'Sarah M.',       initials:'SM', color:'purple', circle:'Family Fund',  amount:'$200', due:'Jun 1', status:'paid' },
  { name:'Tom K.',         initials:'TK', color:'green',  circle:'Work Circle',  amount:'$100', due:'Jun 5', status:'pending' },
  { name:'Lisa E.',        initials:'LE', color:'gold',   circle:'Invest Club',  amount:'$500', due:'Jun 1', status:'paid' },
  { name:'Rachel B.',      initials:'RB', color:'pink',   circle:'Family Fund',  amount:'$200', due:'Jun 1', status:'late' },
  { name:'Mike W.',        initials:'MW', color:'cyan',   circle:'Work Circle',  amount:'$100', due:'Jun 5', status:'paid' },
]
const avBg: Record<string,string> = {
  blue:'linear-gradient(135deg,#2563eb,#06b6d4)', purple:'linear-gradient(135deg,#8b5cf6,#ec4899)',
  green:'linear-gradient(135deg,#10b981,#06b6d4)', gold:'linear-gradient(135deg,#f59e0b,#ef4444)',
  pink:'linear-gradient(135deg,#ec4899,#8b5cf6)', cyan:'linear-gradient(135deg,#06b6d4,#2563eb)',
}
const statusMap: Record<string,{label:string;cls:string}> = {
  paid:{label:'✓ Paid',cls:'ok'}, pending:{label:'⏳ Pending',cls:'pend'}, late:{label:'✗ Late',cls:'late'}
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Good morning, James 👋" sub="Your savings snapshot for June 2026." btnLabel="+ New circle" btnHref="/dashboard/create" />
      <div className={styles.metrics}>
        <MetricCard color="blue"   label="💰 Total saved"   value="$14,800" note="↑ +$1,800 this month" />
        <MetricCard color="gold"   label="🏦 Active circles" value="3"       note="14 members total" noteType="neutral" />
        <MetricCard color="green"  label="✅ On-time rate"  value="96%"     note="↑ Up from 91%" />
        <MetricCard color="purple" label="📬 Late payments"  value="2"       note="Action needed" noteType="down" />
        <MetricCard color="cyan"   label="🌐 Network rank"  value="Top 8%"  note="Most trusted saver" />
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Payment status — June 2026</span><button className={styles.btnGhost}>Send reminders</button></div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Member</th><th>Circle</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map(p=>(
                <tr key={p.name}>
                  <td><div className={styles.member}><div className={styles.av} style={{background:avBg[p.color]}}>{p.initials}</div>{p.name}</div></td>
                  <td className={styles.muted}>{p.circle}</td>
                  <td className={styles.bold}>{p.amount}</td>
                  <td className={styles.muted}>{p.due}</td>
                  <td><span className={`${styles.stb} ${styles[statusMap[p.status].cls]}`}>{statusMap[p.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}