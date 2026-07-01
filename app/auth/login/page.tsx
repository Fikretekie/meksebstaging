'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    // TODO: connect to AWS Cognito
    setTimeout(() => { setLoading(false); router.push('/dashboard') }, 1200)
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.sub}>Sign in to your Mekseb account</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email address</label>
          <input className={styles.input} type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Password</label>
            <Link href="/auth/forgot-password" className={styles.forgot}>Forgot password?</Link>
          </div>
          <input className={styles.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </form>
      <div className={styles.divider}><span>or continue with</span></div>
      <div className={styles.socials}>
        <button className={styles.social}>🌐 Google</button>
        <button className={styles.social}>🍎 Apple</button>
      </div>
      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className={styles.link}>Create one free →</Link>
      </p>
    </div>
  )
}