import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const txns=[
  {date:'Jun 1, 2026',circle:'Family Fund', amt:'$200',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'Jun 1, 2026',circle:'Invest Club', amt:'$500',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'Jun 5, 2026',circle:'Work Circle', amt:'$100',amtColor:'#fbbf24',card:'Visa ···4242',status:'pending'},
  {date:'May 1, 2026',circle:'Family Fund', amt:'$200',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'May 1, 2026',circle:'Invest Club', amt:'$500',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'May 3, 2026',circle:'Work Circle', amt:'$100',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'Apr 1, 2026',circle:'Family Fund', amt:'$200',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
  {date:'Apr 1, 2026',circle:'Invest Club', amt:'$500',amtColor:'#34d399',card:'Visa ···4242',status:'paid'},
]
const sm: Record<string,{l:string;c:string}> = {paid:{l:'✓ Paid',c:'ok'},pending:{l:'⏳ Pending',c:'pend'}}
export default function PaymentsPage(){
  return(
    <div>
      <PageHeader title="Payments" sub="Full transaction history across all circles." />
      <div className={styles.metrics}>
        <MetricCard color="blue"   label="💳 Total paid" value="$14,800" note="47 payments" noteType="neutral"/>
        <MetricCard color="green"  label="✅ On time"    value="45"      note="96% on-time"/>
        <MetricCard color="gold"   label="⏳ Pending"    value="$100"    note="Work Circle" noteType="neutral"/>
        <MetricCard color="purple" label="📅 Next due"   value="Jul 1"   note="$800 total" noteType="neutral"/>
      </div>
      <div className={styles.card}>
        <div className={styles.cardH}><span className={styles.cardT}>Transaction history</span><button className={styles.btnPrimary}>+ Pay now</button></div>
        <div className={styles.tw}><table className={styles.table}>
          <thead><tr><th>Date</th><th>Circle</th><th>Amount</th><th>Card</th><th>Status</th></tr></thead>
          <tbody>{txns.map((t,i)=>(
            <tr key={i}>
              <td>{t.date}</td><td className={styles.muted}>{t.circle}</td>
              <td style={{fontWeight:600,color:t.amtColor}}>{t.amt}</td>
              <td className={styles.muted}>{t.card}</td>
              <td><span className={`${styles.stb} ${styles[sm[t.status].c]}`}>{sm[t.status].l}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  )
}