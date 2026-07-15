'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import { sendEmail } from '@/lib/api'
import styles from './page.module.css'

const countries = ['United States','United Kingdom','Canada','Australia','Ethiopia','Nigeria','Kenya','Ghana','South Africa','Germany','France','Spain','UAE','India','Other']

export default function SignupPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', country:'United States', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'signup'|'verify'>('signup')
  const [code, setCode] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.firstName||!form.lastName||!form.email||!form.password) { setError('Please fill in all required fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            given_name: form.firstName,
            family_name: form.lastName,
          }
        }
      })
      setStep('verify')
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.')
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await confirmSignUp({ username: form.email, confirmationCode: code })
      // Send welcome email to user + admin alert
      try {
        await sendEmail('USER_SIGNUP', {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          country: form.country,
        })
      } catch (emailErr) {
        console.error('Email failed:', emailErr)
      }
      window.location.href = '/onboarding'
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.')
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.sub}>We sent a verification code to <strong style={{color:'white'}}>{form.email}</strong></p>
        <form className={styles.form} onSubmit={handleVerify}>
          <div className={styles.field}>
            <label className={styles.label}>Verification code</label>
            <input className={styles.input} type="text" placeholder="Enter 6-digit code" value={code} onChange={e=>setCode(e.target.value)} required />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify email'}
          </button>
        </form>
      </div>
    )
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <div className={styles.divider}><span>or sign up with</span></div>
      <div className={styles.socials}>
        <button className={styles.social}>Google</button>
        <button className={styles.social}>Apple</button>
      </div>
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/auth/login" className={styles.link}>Sign in</Link>
      </p>
    </div>
  )
}