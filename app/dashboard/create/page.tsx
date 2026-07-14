'use client'
import { useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { createCircle } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

export default function CreatePage(){
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name:'', amount:'', currency:'USD', maxMembers:'', dueDay:'1st of month', goal:'', desc:'', access:'Invite only', qualifications:'', withdrawal:'', quitting:'' })
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await getCurrentUser()
      const circleId = `circle_${Date.now()}`
      await createCircle({
        circleId,
        name: form.name,
        amount: parseFloat(form.amount) || 0,
        currency: form.currency,
        maxMembers: parseInt(form.maxMembers) || 5,
        goal: form.goal,
        description: form.desc,
        createdBy: user.userId,
      })
      window.location.href = '/dashboard/groups/'
    } catch (err: any) {
      setError(err.message || 'Failed to create circle. Please try again.')
      setLoading(false)
    }
  }

  return(
    <div>
      <PageHeader title="Create a circle" sub="Set up a new savings circle for your community." />
      <div className={styles.steps}>
        {["Circle details","Membership","Policy"].map((s,i)=>(
          <div key={s} className={`${styles.stepItem} ${i===step?styles.stepActive:''} ${i<step?styles.stepDone:''}`}>
            <div className={styles.stepNum}>{i<step?'✓':(i+1)}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className={styles.form}>
        {step===0 && (<>
          <div className={styles.secTitle}>Circle details</div>
          <div className={styles.fg}><label className={styles.label}>Circle name <span className={styles.req}>*</span></label><input className={styles.input} type="text" placeholder="e.g. Family Savings Fund" value={form.name} onChange={set('name')} /></div>
          <div className={styles.row}>
            <div className={styles.fg}><label className={styles.label}>Monthly contribution <span className={styles.req}>*</span></label><input className={styles.input} type="number" placeholder="100" value={form.amount} onChange={set('amount')} /></div>
            <div className={styles.fg}><label className={styles.label}>Currency</label><select className={styles.select} value={form.currency} onChange={set('currency')}><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>NGN</option><option>ETB</option></select></div>
          </div>
          <div className={styles.row}>
            <div className={styles.fg}><label className={styles.label}>Max members</label><input className={styles.input} type="number" placeholder="5" value={form.maxMembers} onChange={set('maxMembers')} /></div>
            <div className={styles.fg}><label className={styles.label}>Payment due day</label><select className={styles.select} value={form.dueDay} onChange={set('dueDay')}><option>1st of month</option><option>5th of month</option><option>15th of month</option><option>Last day of month</option></select></div>
          </div>
          <div className={styles.fg}><label className={styles.label}>Savings goal</label><input className={styles.input} type="text" placeholder="e.g. Property down payment by Dec 2027" value={form.goal} onChange={set('goal')} /></div>
          <div className={styles.fg}><label className={styles.label}>Description</label><textarea className={styles.ta} rows={3} placeholder="What is this circle saving for?" value={form.desc} onChange={set('desc')} /></div>
        </>)}
        {step===1 && (<>
          <div className={styles.secTitle}>Membership settings</div>
          <div className={styles.fg}><label className={styles.label}>Who can join?</label>
            <select className={styles.select} value={form.access} onChange={set('access')}><option>Invite only — private</option><option>Open application with admin review</option><option>Public — anyone can join</option></select></div>
          <div className={styles.fg}><label className={styles.label}>Qualification requirements</label>
            <textarea className={styles.ta} rows={4} placeholder="e.g. Must be employed full-time, verified ID, credit score 650+..." value={form.qualifications} onChange={set('qualifications')} />
            <div className={styles.hint}>Applicants will see these before applying.</div></div>
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>💡 Tip: Strong qualifications = reliable members</div>
            <div className={styles.infoText}>Circles with clear requirements have 42% fewer late payments on average.</div>
          </div>
        </>)}
        {step===2 && (<>
          <div className={styles.secTitle}>Circle policy</div>
          <div className={styles.fg}><label className={styles.label}>Withdrawal rules</label>
            <textarea className={styles.ta} rows={3} placeholder="e.g. Requires 75% member vote, 6 months minimum membership..." value={form.withdrawal} onChange={set('withdrawal')} /></div>
          <div className={styles.fg}><label className={styles.label}>If someone quits</label>
            <textarea className={styles.ta} rows={3} placeholder="e.g. 30-day notice required, last contribution forfeited..." value={form.quitting} onChange={set('quitting')} /></div>
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>📋 Your policy will be shown to all members</div>
            <div className={styles.infoText}>All members must agree to the policy before joining. You can edit it later with group approval.</div>
          </div>
          {error && <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#f87171',marginTop:'1rem'}}>{error}</div>}
        </>)}
        <div className={styles.actions}>
          {step>0 && <button className={styles.btnBack} onClick={()=>setStep(s=>s-1)}>← Back</button>}
          {step<2 && <button className={styles.btnNext} onClick={()=>setStep(s=>s+1)}>Continue →</button>}
          {step===2 && <button className={styles.btnCreate} onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create circle →'}</button>}
          <button className={styles.btnSave} onClick={()=>{}}>Save draft</button>
        </div>
      </div>
    </div>
  )
}