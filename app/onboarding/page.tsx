'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from 'aws-amplify/auth'
import { createUser } from '@/lib/api'
import styles from './page.module.css'

const steps = ['Your profile', 'Your savings goal', 'Your first circle']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ bio:'', goal:'', monthly:'', currency:'USD', intent:'create' })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState('United States')
  const [loading, setLoading] = useState(false)
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      setLoading(true)
      try {
        const user = await getCurrentUser()
        await createUser({
          userId: user.userId,
          email: user.signInDetails?.loginId || '',
          firstName,
          lastName,
          country,
        })
        router.push('/dashboard')
      } catch (err) {
        console.error(err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
  }

  const back = () => setStep(s => s - 1)

  return (
    <div className={styles.wrap}>
      <div className={styles.o1}/><div className={styles.o2}/><div className={styles.grid}/>
      <div className={styles.inner}>
        <div className={styles.logo}><div className={styles.mark}>M</div><span className={styles.name}>Me<span>K</span>seb</span></div>
        <div className={styles.card}>
          <div className={styles.progress}>
            {steps.map((s,i)=>(
              <div key={s} className={styles.stepWrap}>
                <div className={`${styles.stepDot} ${i<=step?styles.stepActive:''}`}>{i<step?'✓':(i+1)}</div>
                <div className={`${styles.stepLabel} ${i===step?styles.stepLabelActive:''}`}>{s}</div>
              </div>
            ))}
          </div>

          {step===0 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Tell us about yourself</h2>
              <p className={styles.stepSub}>This helps other members on the network find and trust you.</p>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>First name</label>
                  <input className={styles.input} type="text" placeholder="James" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last name</label>
                  <input className={styles.input} type="text" placeholder="Richardson" value={lastName} onChange={e=>setLastName(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <select className={styles.select} value={country} onChange={e=>setCountry(e.target.value)}>
                  {['United States','United Kingdom','Canada','Australia','Ethiopia','Nigeria','Kenya','Ghana','South Africa','Germany','France','Spain','UAE','India','Other'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Short bio</label>
                <textarea className={styles.ta} rows={3} placeholder="e.g. Software engineer based in Houston." value={form.bio} onChange={set('bio')} />
              </div>
            </div>
          )}

          {step===1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>What are you saving for?</h2>
              <p className={styles.stepSub}>Set your savings vision so others on the network can find people with matching goals.</p>
              <div className={styles.goalGrid}>
                {['Real estate','Emergency fund','Investment club','Education','Startup fund','Travel','Retirement','Other'].map(g=>(
                  <button key={g} type="button" className={`${styles.goalBtn} ${form.goal===g?styles.goalActive:''}`} onClick={()=>setForm(f=>({...f,goal:g}))}>{g}</button>
                ))}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Monthly budget</label>
                  <input className={styles.input} type="number" placeholder="e.g. 200" value={form.monthly} onChange={set('monthly')} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Currency</label>
                  <select className={styles.select} value={form.currency} onChange={set('currency')}>
                    <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>NGN</option><option>ETB</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step===2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>How do you want to start?</h2>
              <p className={styles.stepSub}>You can always do both later.</p>
              <div className={styles.intentCards}>
                <div className={`${styles.intentCard} ${form.intent==='create'?styles.intentActive:''}`} onClick={()=>setForm(f=>({...f,intent:'create'}))}>
                  <div className={styles.intentIcon}>✦</div>
                  <div className={styles.intentTitle}>Create a new circle</div>
                  <div className={styles.intentDesc}>Start your own savings group and invite members you trust.</div>
                </div>
                <div className={`${styles.intentCard} ${form.intent==='join'?styles.intentActive:''}`} onClick={()=>setForm(f=>({...f,intent:'join'}))}>
                  <div className={styles.intentIcon}>🌐</div>
                  <div className={styles.intentTitle}>Browse the network</div>
                  <div className={styles.intentDesc}>Find people with the same vision and join or form a circle together.</div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {step>0 && <button className={styles.btnBack} type="button" onClick={back}>← Back</button>}
            <button className={styles.btnNext} type="button" onClick={next} disabled={loading}>
              {loading ? 'Saving...' : step===steps.length-1 ? 'Go to dashboard →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}