import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'
const sections=[
  {l:'Contribution rules',c:'#60a5fa',t:'Each member contributes $200 on the 1st of every month via Mekseb. Payments 5+ days late incur a $10 fee. After 30 days the admin reviews and may suspend the member pending a group vote.'},
  {l:'Withdrawal policy',c:'#60a5fa',t:'Withdrawals require approval from at least 4 of 5 members via in-app vote. Emergency withdrawals (medical, bereavement) are granted within 24 hours. All planned withdrawals require 14 days notice.'},
  {l:'Quitting the circle',c:'#60a5fa',t:"A member wishing to leave must give 30 days written notice. Their final month's contribution is forfeited. All prior savings are returned within 14 business days of departure."},
  {l:'Adding new members',c:'#60a5fa',t:'New members require unanimous approval. Applicants must pass ID verification, provide income proof, and meet the qualification checklist. A 3-month probationary period applies.'},
  {l:'Dispute resolution',c:'#fbbf24',t:"Disputes go to a group vote first. If unresolved within 7 days, Mekseb's mediation team is engaged. Their ruling is final and binding for all members."},
]
export default function PolicyPage(){
  return(
    <div>
      <PageHeader title="Group policy" sub="Family Fund — official circle rules." />
      <div className={styles.meta}>
        <div><div className={styles.metaTitle}>📋 Family Fund — Circle Policy</div><div className={styles.metaSub}>Jun 1, 2026 · Approved by all 5 members</div></div>
        <span className={styles.badge}>Ratified</span>
      </div>
      <div className={styles.card}>
        {sections.map((s,i)=>(
          <div key={s.l} className={styles.sec} style={{borderBottom:i<sections.length-1?'1px solid rgba(255,255,255,.08)':'none'}}>
            <div className={styles.sLabel} style={{color:s.c}}>{s.l}</div>
            <p className={styles.sText}>{s.t}</p>
          </div>
        ))}
      </div>
      <div className={styles.editCard}>
        <div><div className={styles.editTitle}>Want to propose a policy change?</div><div className={styles.editSub}>Changes to the policy require a group vote. All members will be notified.</div></div>
        <button className={styles.btnPrimary}>Propose change</button>
      </div>
    </div>
  )
}