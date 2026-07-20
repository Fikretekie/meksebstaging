'use client'
import { useEffect, useState } from 'react'
import { getUserAttributes } from '@/lib/getUser'
import { createUser, sendEmail } from '@/lib/api'
import styles from './page.module.css'

const countries = ['United States','United Kingdom','Canada','Australia','Ethiopia','Eritrea','Nigeria','Kenya','Ghana','South Africa','Germany','France','Spain','UAE','India','Other']

const goals = [
  'Buy a home',
  'Start a business',
  'Emergency fund',
  'Education fund',
  'Retirement savings',
  'Travel fund',
  'Investment portfolio',
  'Other',
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [prefilling, setPrefilling] = useState(true)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: 'United States',
    bio: '',
    goal: '',
    circleName: '',
    amount: '',
    currency: 'USD',
  })
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const prefill = async () => {
      try {
        const attributes = await getUserAttributes()
        setUserId(attributes.sub || '')
        setEmail(attributes.email || '')
      } catch (err) {
        console.error(err)
      } finally {
        setPrefilling(false)
      }
    }
    prefill()
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFinish = async () => {
    setLoading(true)
    try {
      // Save user profile to DynamoDB
      await createUser({
        userId,
        email,
        firstName: form.firstName,
        lastName: form.lastName,
        country: form.country,
      })
      // Send welcome email with real name now
      try {
        await sendEmail('USER_SIGNUP', {
          email,
          firstName: form.firstName,
          lastName: form.lastName,
          country: form.country,
        })
      } catch (emailErr) {
        console.error('Email failed:', emailErr)
      }
      window.location.href = '/dashboard/index.html'
    } catch (err) {
      console.error(err)
      window.location.href = '/dashboard/index.html'
    }
  }

  if (prefilling) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'rgba(255,255,255,.5)'}}>
        Loading your profile...
      </div>
    )
  }

  const steps = ['Your profile', 'Your savings goal', 'Your first circle']

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.mark}>M</div>
            <span className={styles.name}>Me<span>K</span>seb</span>
          </div>
          <div className={styles.stepIndicator}>
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressFill} style={{width:`${((step + 1) / steps.length) * 100}%`}}/>
        </div>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={s} className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
              <div className={styles.stepNum}>{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>Tell us about yourself</h2>
            <p className={styles.stepSub}>This helps other members on the network find and trust you.</p>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First name <span className={styles.req}>*</span></label>
                <input className={styles.input} type="text" value={form.firstName} onChange={set('firstName')} placeholder="James" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last name <span className={styles.req}>*</span></label>
                <input className={styles.input} type="text" value={form.lastName} onChange={set('lastName')} placeholder="Richardson" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Country</label>
              <select className={styles.select} value={form.country} onChange={set('country')}>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Short bio <span style={{color:'rgba(255,255,255,.3)',fontWeight:400}}>(optional)</span></label>
              <textarea className={styles.ta} rows={3} value={form.bio} onChange={set('bio')} placeholder="Tell the community a bit about yourself and your savings goals..." />
            </div>

            <button className={styles.btnNext} onClick={() => setStep(1)}>
              Continue →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>What are you saving for?</h2>
            <p className={styles.stepSub}>Choose your primary savings goal. You can always change this later.</p>

            <div className={styles.goalGrid}>
              {goals.map(g => (
                <button
                  key={g}
                  className={`${styles.goalBtn} ${form.goal === g ? styles.goalBtnActive : ''}`}
                  onClick={() => setForm(f => ({...f, goal: g}))}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{display:'flex',gap:'12px',marginTop:'1.5rem'}}>
              <button className={styles.btnBack} onClick={() => setStep(0)}>← Back</button>
              <button className={styles.btnNext} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>Create your first circle</h2>
            <p className={styles.stepSub}>Start saving with your community. You can skip this and do it later.</p>

            <div className={styles.field}>
              <label className={styles.label}>Circle name <span style={{color:'rgba(255,255,255,.3)',fontWeight:400}}>(optional)</span></label>
              <input className={styles.input} type="text" value={form.circleName} onChange={set('circleName')} placeholder="e.g. Family Savings Fund" />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Monthly amount</label>
                <input className={styles.input} type="number" value={form.amount} onChange={set('amount')} placeholder="200" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Currency</label>
                <select className={styles.select} value={form.currency} onChange={set('currency')}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>CAD</option>
                  <option>ETB</option>
                  <option>ERN</option>
                </select>
              </div>
            </div>

            <div style={{display:'flex',gap:'12px',marginTop:'1.5rem',flexWrap:'wrap'}}>
              <button className={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
              <button
                className={styles.btnNext}
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Go to dashboard →'}
              </button>
              <button
                className={styles.btnSkip}
                onClick={handleFinish}
                disabled={loading}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}