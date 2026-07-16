'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import MetricCard from '@/components/dashboard/MetricCard'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const sm: Record<string,{l:string;c:string}> = {
  paid:{l:'✓ Paid',c:'ok'},
  pending:{l:'⏳ Pending',c:'pend'},
  late:{l:'✗ Late',c:'late'}
}

const btnStyle = {
  display:'inline-block' as const,
  background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
  color:'white',
  padding:'10px 18px',
  borderRadius:'8px',
  textDecoration:'none' as const,
  fontSize:'13px',
  fontWeight:600,
  cursor:'pointer' as const,
  border:'none' as const,
}

const linkStyle = {
  color:'#60a5fa',
  fontSize:'13px',
  textDecoration:'none' as const,
  fontWeight:600,
  cursor:'pointer' as const,
  background:'none' as const,
  border:'none' as const,
}

export default function PaymentsPage(){
  const [circles, setCircles] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  const [nextDue, setNextDue] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const userId = attributes.sub || ''

        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)

          const monthlyTotal = data.circles.reduce((sum: number, c: any) =>
            sum + parseFloat(c.amount || '0'), 0)
          setNextDue(monthlyTotal)

          const allPayments: any[] = []
          for (const circle of data.circles) {
            try {
              const res = await fetch(`${API_URL}/payments?userId=${userId}&circleId=${circle.circleId}`)
              const pData = await res.json()
              if (pData.payments) {
                pData.payments.forEach((p: any) => {
                  allPayments.push({
                    ...p,
                    circleName: circle.name,
                    currency: circle.currency,
                  })
                })
              }
            } catch (err) {
              console.error('Error loading payments:', err)
            }
          }

          allPayments.sort((a, b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime())
          setPayments(allPayments)

          const paid = allPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
          const pending = allPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
          setTotalPaid(paid)
          setTotalPending(pending)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const nextDueDate = nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const goToPay = (circleId: string) => {
    window.location.href = `/dashboard/pay/?circleId=${circleId}`
  }

  return(
    <div>
      <PageHeader title="Payments" sub="Full transaction history across all circles." />

      {loading ? (
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      ) : (
        <>
          <div className={styles.metrics}>
            <MetricCard color="blue"   label="💳 Total paid"  value={`$${totalPaid.toLocaleString()}`}    note={`${payments.filter(p=>p.status==='paid').length} payments`} noteType="neutral"/>
            <MetricCard color="green"  label="✅ On time"     value={String(payments.filter(p=>p.status==='paid').length)} note="Paid on time"/>
            <MetricCard color="gold"   label="⏳ Pending"     value={`$${totalPending.toLocaleString()}`} note={`${payments.filter(p=>p.status==='pending').length} pending`} noteType="neutral"/>
            <MetricCard color="purple" label="📅 Next due"    value={nextDueDate} note={`$${nextDue.toLocaleString()} total`} noteType="neutral"/>
          </div>

          {/* Pay now buttons */}
          {circles.length > 0 && (
            <div className={styles.card} style={{marginBottom:'1.5rem'}}>
              <div className={styles.cardH}>
                <span className={styles.cardT}>💳 Pay monthly contribution</span>
              </div>
              <div style={{padding:'1rem 1.5rem'}}>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)',marginBottom:'0.75rem'}}>
                  Select a circle to make your monthly payment:
                </div>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {circles.map((c: any) => (
                    <button
                      key={c.circleId}
                      onClick={() => goToPay(c.circleId)}
                      style={btnStyle}
                    >
                      💳 Pay ${c.amount} — {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardH}>
              <span className={styles.cardT}>Transaction history</span>
            </div>
            {payments.length === 0 ? (
              <div style={{padding:'2rem',color:'rgba(255,255,255,.5)',textAlign:'center'}}>
                No payments yet. Use the Pay button above to make your first contribution!
              </div>
            ) : (
              <div className={styles.tw}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Circle</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((t, i) => (
                      <tr key={i}>
                        <td>{new Date(t.paidAt || t.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}</td>
                        <td className={styles.muted}>{t.circleName}</td>
                        <td style={{fontWeight:600,color:'#34d399'}}>${parseFloat(t.amount||'0').toLocaleString()}</td>
                        <td className={styles.muted}>{t.currency || 'USD'}</td>
                        <td><span className={`${styles.stb} ${styles[sm[t.status]?.c || 'pend']}`}>{sm[t.status]?.l || '⏳ Pending'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {circles.length > 0 && payments.length === 0 && (
            <div className={styles.card}>
              <div className={styles.cardH}>
                <span className={styles.cardT}>Your circles</span>
              </div>
              <div className={styles.tw}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Circle</th>
                      <th>Monthly amount</th>
                      <th>Currency</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circles.map((c, i) => (
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{c.name}</td>
                        <td style={{color:'#34d399',fontWeight:600}}>${c.amount}/mo</td>
                        <td className={styles.muted}>{c.currency}</td>
                        <td>
                          <button onClick={() => goToPay(c.circleId)} style={linkStyle}>
                            Pay now →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}