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

        // Load circles
        const data = await getCircles(userId)
        if (data.circles) {
          setCircles(data.circles)

          // Calculate next due amount (sum of all monthly contributions)
          const monthlyTotal = data.circles.reduce((sum: number, c: any) =>
            sum + parseFloat(c.amount || '0'), 0)
          setNextDue(monthlyTotal)

          // Load payments for each circle
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

          // Sort by date descending
          allPayments.sort((a, b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime())
          setPayments(allPayments)

          // Calculate totals
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

  // Get next due date (1st of next month)
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const nextDueDate = nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

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

          <div className={styles.card}>
            <div className={styles.cardH}>
              <span className={styles.cardT}>Transaction history</span>
            </div>
            {payments.length === 0 ? (
              <div style={{padding:'2rem',color:'rgba(255,255,255,.5)',textAlign:'center'}}>
                No payments yet. Payments will appear here once you start contributing to circles.
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

          {/* Circles with no payments yet */}
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
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circles.map((c, i) => (
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{c.name}</td>
                        <td style={{color:'#34d399',fontWeight:600}}>${c.amount}/mo</td>
                        <td className={styles.muted}>{c.currency}</td>
                        <td><span className={`${styles.stb} ${styles.ok}`}>Active</span></td>
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