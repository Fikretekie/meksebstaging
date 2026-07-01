'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const countries = ['United States','United Kingdom','Canada','Australia','Ethiopia','Nigeria','Kenya','Ghana','South Africa','Germany','France','Spain','UAE','India','Other']

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', country:'United States', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.firstName||!form.lastName||!form.email||!form.password) { setError('Please fill in all required fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    // TODO: connect to AWS Cognito
    setTimeout(() => { setLoading(false); router.push('/onboarding') }, 1200)
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.sub}>Start saving together with your community</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>First name <span className={styles.req}>*</span></label>
            <input className={styles.input} type="text" placeholder="James" value={form.firstName} onChange={set('firstName')} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Last name <span className={styles.req}>*</span></label>
            <input className={styles.input} type="text" placeholder="Richardson" value={form.lastName} onChange={set('lastName')} required />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email address <span className={styles.req}>*</span></label>
          <input className={styles.input} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Country</label>
          <select className={styles.select} value={form.country} onChange={set('country')}>
            {countries.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password <span className={styles.req}>*</span></label>
          <input className={styles.input} type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirm password <span className={styles.req}>*</span></label>
          <input className={styles.input} type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} required />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <p className={styles.terms}>By creating an account you agree to our{' '}
          <a href="#" className={styles.link}>Terms of Service</a> and{' '}
          <a href="#" className={styles.link}>Privacy Policy</a>.
        </p>
        <button className={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
      </form>
      <div className={styles.divider}><span>or sign up with</span></div>
      <div className={styles.socials}>
        <button className={styles.social}>🌐 Google</button>
        <button className={styles.social}>🍎 Apple</button>
      </div>
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/auth/login" className={styles.link}>Sign in →</Link>
      </p>
    </div>
  )
}