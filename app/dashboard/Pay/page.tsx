'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const API_URL = process.env.NEXT_PUBLIC_API_URL

const cardStyle = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: 'rgba(255,255,255,.4)' },
    },
    invalid: { color: '#f87171' },
  },
}

function PaymentForm({ circle, userId, userEmail }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fees, setFees] = useState<any>(null)

  const amount = parseFloat(circle.amount || '0')
  const meksebFee = Math.round(amount * 0.01 * 100) / 100
  const stripeFeePct = 0.029
  const stripeFeeFixed = 0.30
  const stripeFee = Math.round((amount * stripeFeePct + stripeFeeFixed) * 100) / 100
  const totalAmount = Math.round((amount + meksebFee + stripeFee) * 100) / 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      // Create payment intent
      const res = await fetch(`${API_URL}/stripe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          circleId: circle.circleId,
          amount: amount,
          currency: circle.currency || 'USD',
          circleName: circle.name,
          userEmail,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { email: userEmail },
        },
      })

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'rgba(16,185,129,.1)',
        border: '1px solid rgba(16,185,129,.2)',
        borderRadius: '16px',
      }}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
          Payment successful!
        </div>
        <div style={{fontSize:'14px',color:'rgba(255,255,255,.6)',marginBottom:'2rem'}}>
          Your ${amount} contribution to {circle.name} has been received.
        </div>
        <Link href="/dashboard/payments/" style={{
          display:'inline-block',
          background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
          color:'white',
          padding:'10px 24px',
          borderRadius:'10px',
          textDecoration:'none',
          fontWeight:600,
        }}>
          View payments →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Fee breakdown */}
      <div style={{
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)',marginBottom:'1rem'}}>Payment breakdown</div>
        {[
          { label: `Circle contribution (${circle.name})`, value: `$${amount.toFixed(2)}` },
          { label: 'Mekseb platform fee (1%)', value: `$${meksebFee.toFixed(2)}` },
          { label: 'Card processing fee (2.9% + $0.30)', value: `$${stripeFee.toFixed(2)}` },
        ].map(item => (
          <div key={item.label} style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
            <span style={{fontSize:'13px',color:'rgba(255,255,255,.6)'}}>{item.label}</span>
            <span style={{fontSize:'13px',color:'white',fontWeight:600}}>{item.value}</span>
          </div>
        ))}
        <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'8px',marginTop:'8px',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:'14px',fontWeight:700,color:'white'}}>Total charged</span>
          <span style={{fontSize:'14px',fontWeight:700,color:'#60a5fa'}}>${totalAmount.toFixed(2)}</span>
        </div>
        <div style={{marginTop:'8px',fontSize:'12px',color:'rgba(16,185,129,.8)'}}>
          ✓ Circle receives full ${amount.toFixed(2)}
        </div>
      </div>

      {/* Card input */}
      <div style={{
        background: 'rgba(255,255,255,.05)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '1rem',
      }}>
        <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)',marginBottom:'10px'}}>Card details</div>
        <CardElement options={cardStyle} />
      </div>

      {error && (
        <div style={{
          background:'rgba(239,68,68,.1)',
          border:'1px solid rgba(239,68,68,.2)',
          borderRadius:'8px',
          padding:'10px 14px',
          color:'#f87171',
          fontSize:'13px',
          marginBottom:'1rem',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        style={{
          width: '100%',
          padding: '14px',
          background: loading ? 'rgba(37,99,235,.5)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>

      <div style={{textAlign:'center',marginTop:'12px',fontSize:'12px',color:'rgba(255,255,255,.3)'}}>
        🔒 Secured by Stripe · Your card info is never stored on Mekseb
      </div>
    </form>
  )
}

function PayPage() {
  const params = useSearchParams()
  const circleId = params.get('circleId') || ''
  const [circle, setCircle] = useState<any>(null)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const uid = attributes.sub || ''
        const email = attributes.email || ''
        setUserId(uid)
        setUserEmail(email)

        const res = await fetch(`${API_URL}/circles?userId=${uid}`)
        const data = await res.json()
        if (data.circles) {
          const found = data.circles.find((c: any) => c.circleId === circleId)
          if (found) setCircle(found)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [circleId])

  if (loading) return <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>

  if (!circle) return (
    <div style={{textAlign:'center',padding:'4rem'}}>
      <div style={{fontSize:'2rem',marginBottom:'1rem'}}>💳</div>
      <div style={{color:'white',fontWeight:700,marginBottom:'0.5rem'}}>Circle not found</div>
      <Link href="/dashboard/payments/" style={{color:'#60a5fa'}}>← Back to payments</Link>
    </div>
  )

  return (
    <div style={{maxWidth:'480px',margin:'0 auto',padding:'2rem 1rem'}}>
      <Link href="/dashboard/payments/" style={{color:'rgba(255,255,255,.5)',fontSize:'13px',textDecoration:'none',display:'block',marginBottom:'1.5rem'}}>
        ← Back to payments
      </Link>

      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:'4px'}}>Make a payment</h1>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,.5)'}}>
          Monthly contribution to {circle.name}
        </p>
      </div>

      <div style={{
        background: 'rgba(37,99,235,.1)',
        border: '1px solid rgba(37,99,235,.2)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width:40,height:40,borderRadius:'50%',
          background:'linear-gradient(135deg,#2563eb,#06b6d4)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:'14px',fontWeight:700,color:'white',flexShrink:0,
        }}>
          {circle.name?.slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{fontWeight:600,color:'white'}}>{circle.name}</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)'}}>
            ${circle.amount}/mo · {circle.currency}
          </div>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm circle={circle} userId={userId} userEmail={userEmail} />
      </Elements>
    </div>
  )
}

export default function PayPageWrapper() {
  return (
    <Suspense fallback={<div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>}>
      <PayPage />
    </Suspense>
  )
}