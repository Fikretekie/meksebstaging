'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn, signOut, signInWithRedirect } from 'aws-amplify/auth'
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      try { await signOut() } catch(e) {}
      await signIn({ username: email, password })
      window.location.href = '/dashboard/index.html'
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithRedirect({ provider: 'Google' })
    } catch (err: any) {
      setError(err.message || 'Google sign in failed.')
      setGoogleLoading(false)
    }
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
        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '11px 16px',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#3c3c3c',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            opacity: googleLoading ? 0.7 : 1,
            transition: 'all .2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Apple Button */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '11px 16px',
            background: 'black',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 814 1000">
            <path fill="white" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.5 46.4 174.9 46.4 42.7 0 109.2-49 192.5-49 31 0 108.3 2.6 168.9 75.7zm-126.7-96.3c-36.6 45.5-97.1 79.2-161.5 79.2-10.9 0-22.2-1.3-33.2-4.3 1.3-49.6 24.9-96.5 56.9-128.5 36.6-37.2 97.7-64.3 151.4-64.3 9.7 0 18.7.6 28.4 2.6-1.9 48.3-21.9 94.5-42 115.3z"/>
          </svg>
          Continue with Apple
        </button>
      </div>

      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup/index.html" className={styles.link}>Create one free →</Link>
      </p>
    </div>
  )
}