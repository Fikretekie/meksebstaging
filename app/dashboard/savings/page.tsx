import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const months = [
  {l:'Jan',v:'$1.2k',h:52,c:'#3b82f6,#1d4ed8'},{l:'Feb',v:'$1.2k',h:52,c:'#3b82f6,#1d4ed8'},
  {l:'Mar',v:'$1.5k',h:65,c:'#06b6d4,#0891b2'},{l:'Apr',v:'$1.5k',h:65,c:'#06b6d4,#0891b2'},
  {l:'May',v:'$1.7k',h:75,c:'#8b5cf6,#6d28d9'},{l:'Jun',v:'$1.8k',h:82,c:'#10b981,#059669'},
  {l:'Jul',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},{l:'Aug',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},
  {l:'Sep',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},{l:'Oct',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},
  {l:'Nov',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},{l:'Dec',v:'—',h:7,c:'rgba(255,255,255,.08),rgba(255,255,255,.08)'},
]
const circles=[
  {n:'Family Fund',contrib:'$200/mo',total:'$7,200',color:'#60a5fa',pct:60,bar:'#2563eb,#06b6d4'},
  {n:'Work Circle',contrib:'$100/mo',total:'$4,200',color:'#34d399',pct:42,bar:'#10b981,#34d399'},
  {n:'Invest Club',contrib:'$500/mo',total:'$3,400',color:'#a78bfa',pct:34,bar:'#8b5cf6,#ec4899'},
]
export default function SavingsPage() {
  return (
    <div>
      <PageHeader title="Savings overview" sub="Cumulative savings across all your circles." />
      <div className={styles.metrics}>
        <MetricCard color="blue"   label="📈 All time"    value="$14,800" note="Since Jan 2025" noteType="neutral" />
        <MetricCard color="green"  label="📅 This year"   value="$10,800" note="↑ On track" />
        <MetricCard color="gold"   label="📆 This month"  value="$1,800"  note="3 circles" noteType="neutral" />
        <MetricCard color="purple" label="🎯 Annual goal" value="$24,000" note="By Dec 2026" noteType="neutral" />
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Monthly contributions — 2026</span></div>
        <div className={styles.chartPad}>
          <div className={styles.bars}>
            {months.map(m=>(
              <div key={m.l} className={styles.bw}>
                <div className={styles.bv}>{m.v}</div>
                <div className={styles.bar} style={{height:`${m.h}%`,background:`linear-gradient(180deg,${m.c})`}} />
                <div className={styles.bl}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Breakdown by circle</span></div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Circle</th><th>Your contribution</th><th>Group total</th><th>Progress</th></tr></thead>
            <tbody>
              {circles.map(c=>(
                <tr key={c.n}>
                  <td style={{fontWeight:600}}>{c.n}</td>
                  <td className={styles.muted}>{c.contrib}</td>
                  <td style={{color:c.color,fontWeight:600}}>{c.total}</td>
                  <td><div className={styles.progRow}><div className={styles.progBar}><div className={styles.progFill} style={{width:`${c.pct}%`,background:`linear-gradient(90deg,${c.bar})`}}/></div><span className={styles.pct}>{c.pct}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}