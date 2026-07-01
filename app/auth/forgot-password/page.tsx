'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: AWS Cognito reset password
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  return (
    <div className={styles.card}>
      {!sent ? (
        <>
          <div className={styles.icon}>🔑</div>
          <h1 className={styles.title}>Reset password</h1>
          <p className={styles.sub}>Enter your email and we&apos;ll send you a reset link.</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input className={styles.input} type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link →'}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.title}>Check your inbox</h1>
          <p className={styles.sub}>We sent a reset link to <strong style={{color:'white'}}>{email}</strong>. It expires in 15 minutes.</p>
          <p className={styles.note}>Didn&apos;t receive it? Check your spam folder or <button className={styles.resend} onClick={()=>setSent(false)}>try again</button>.</p>
        </>
      )}
      <Link href="/auth/login" className={styles.back}>← Back to sign in</Link>
    </div>
  )
}