'use client'
import { useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { createCircle, sendEmail } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

export default function CreatePage(){
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name:'', amount:'', currency:'USD', maxMembers:'', dueDay:'1st of month',
    goal:'', desc:'', access:'Invite only', qualifications:'',
    withdrawal:'', quitting:'',
    governanceType: 'everyone', // 'everyone' or 'committee'
    withdrawalThreshold: 75, // percentage
    committeeSize: 3, // 3 or 5
  })
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const session = await fetchAuthSession()
      const payload = session.tokens?.idToken?.payload
      const userId = (payload?.sub as string) || ''
      const circleId = `circle_${Date.now()}`
      await createCircle({
        circleId,
        name: form.name,
        amount: parseFloat(form.amount) || 0,
        currency: form.currency,
        maxMembers: parseInt(form.maxMembers) || 5,
        goal: form.goal,
        description: form.desc,
        createdBy: userId,
        governanceType: form.governanceType,
        withdrawalThreshold: form.governanceType === 'everyone' ? form.withdrawalThreshold : null,
        committeeSize: form.governanceType === 'committee' ? form.committeeSize : null,
      })
      try {
        await sendEmail('CIRCLE_CREATED', {
          name: form.name,
          amount: parseFloat(form.amount) || 0,
          currency: form.currency,
          goal: form.goal,
          createdBy: userId,
        })
      } catch (emailErr) {
        console.error('Email failed:', emailErr)
      }
      window.location.replace('/dashboard/groups/index.html')
    } catch (err: any) {
      setError(err.message || 'Failed to create circle. Please try again.')
      setLoading(false)
    }
  }

  return(
    <div>
      <PageHeader title="Create a circle" sub="Set up a new savings circle for your community." />
      <div className={styles.steps}>
        {["Circle details","Membership","Governance & Policy"].map((s,i)=>(
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
            <div className={styles.fg}><label className={styles.label}>Contribution amount <span className={styles.req}>*</span></label><input className={styles.input} type="number" placeholder="300" value={form.amount} onChange={set('amount')} /></div>
            <div className={styles.fg}><label className={styles.label}>Currency</label><select className={styles.select} value={form.currency} onChange={set('currency')}><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>NGN</option><option>ETB</option><option>ERN</option></select></div>
          </div>
          <div className={styles.row}>
            <div className={styles.fg}><label className={styles.label}>Max members</label><input className={styles.input} type="number" placeholder="10" value={form.maxMembers} onChange={set('maxMembers')} /></div>
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
            <textarea className={styles.ta} rows={4} placeholder="e.g. Must be employed full-time, verified ID..." value={form.qualifications} onChange={set('qualifications')} />
            <div className={styles.hint}>Applicants will see these before applying.</div></div>
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>💡 Tip: Strong qualifications = reliable members</div>
            <div className={styles.infoText}>Circles with clear requirements have 42% fewer late payments on average.</div>
          </div>
        </>)}

        {step===2 && (<>
          <div className={styles.secTitle}>Governance & Withdrawal Policy</div>

          {/* Governance Type */}
          <div className={styles.fg}>
            <label className={styles.label}>Withdrawal approval method</label>
            <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
              <button
                type="button"
                onClick={() => setForm(f=>({...f, governanceType:'everyone'}))}
                style={{
                  flex:1, padding:'14px', borderRadius:'10px', cursor:'pointer',
                  border: form.governanceType==='everyone' ? '2px solid #2563eb' : '1px solid rgba(255,255,255,.1)',
                  background: form.governanceType==='everyone' ? 'rgba(37,99,235,.15)' : 'rgba(255,255,255,.04)',
                  color:'white', textAlign:'left', transition:'all .2s',
                }}
              >
                <div style={{fontWeight:700, fontSize:'14px', marginBottom:'4px'}}>👥 Everyone Votes</div>
                <div style={{fontSize:'12px', color:'rgba(255,255,255,.5)'}}>All members vote on withdrawals. You set the approval threshold.</div>
              </button>
              <button
                type="button"
                onClick={() => setForm(f=>({...f, governanceType:'committee'}))}
                style={{
                  flex:1, padding:'14px', borderRadius:'10px', cursor:'pointer',
                  border: form.governanceType==='committee' ? '2px solid #2563eb' : '1px solid rgba(255,255,255,.1)',
                  background: form.governanceType==='committee' ? 'rgba(37,99,235,.15)' : 'rgba(255,255,255,.04)',
                  color:'white', textAlign:'left', transition:'all .2s',
                }}
              >
                <div style={{fontWeight:700, fontSize:'14px', marginBottom:'4px'}}>🏛️ Elected Committee</div>
                <div style={{fontSize:'12px', color:'rgba(255,255,255,.5)'}}>A small elected board approves withdrawals on behalf of all members.</div>
              </button>
            </div>
          </div>

          {/* Everyone Votes - Threshold Slider */}
          {form.governanceType === 'everyone' && (
            <div className={styles.fg}>
              <label className={styles.label}>
                Approval threshold — <span style={{color:'#3b82f6',fontWeight:700}}>{form.withdrawalThreshold}% of members must approve</span>
              </label>
              <input
                type="range"
                min="51"
                max="100"
                value={form.withdrawalThreshold}
                onChange={e => setForm(f=>({...f, withdrawalThreshold: parseInt(e.target.value)}))}
                style={{width:'100%', marginTop:'8px', accentColor:'#2563eb'}}
              />
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'rgba(255,255,255,.4)',marginTop:'4px'}}>
                <span>51% — Simple majority</span>
                <span>75% — Recommended</span>
                <span>100% — Everyone</span>
              </div>
              <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'8px',padding:'10px 14px',marginTop:'10px',fontSize:'12px',color:'#93c5fd'}}>
                {form.withdrawalThreshold === 100
                  ? '⚠️ All members must approve — one unresponsive member can block the group.'
                  : form.withdrawalThreshold >= 75
                  ? `✅ ${form.withdrawalThreshold}% threshold — strong consensus required. In a 10-member circle, ${Math.ceil(10 * form.withdrawalThreshold / 100)} members must approve.`
                  : `⚡ ${form.withdrawalThreshold}% threshold — simple majority. In a 10-member circle, ${Math.ceil(10 * form.withdrawalThreshold / 100)} members must approve.`
                }
              </div>
            </div>
          )}

          {/* Committee - Size selector */}
          {form.governanceType === 'committee' && (
            <div className={styles.fg}>
              <label className={styles.label}>Committee size</label>
              <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
                {[3, 5].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setForm(f=>({...f, committeeSize: size}))}
                    style={{
                      flex:1, padding:'14px', borderRadius:'10px', cursor:'pointer',
                      border: form.committeeSize===size ? '2px solid #2563eb' : '1px solid rgba(255,255,255,.1)',
                      background: form.committeeSize===size ? 'rgba(37,99,235,.15)' : 'rgba(255,255,255,.04)',
                      color:'white', textAlign:'center', transition:'all .2s',
                    }}
                  >
                    <div style={{fontWeight:700, fontSize:'18px', marginBottom:'4px'}}>{size} Members</div>
                    <div style={{fontSize:'12px', color:'rgba(255,255,255,.5)'}}>
                      {size === 3 ? 'Small circles (5-15 members)' : 'Larger circles (15+ members)'}
                    </div>
                    <div style={{fontSize:'11px', color:'#3b82f6', marginTop:'4px'}}>
                      {Math.ceil(size/2)} of {size} must approve
                    </div>
                  </button>
                ))}
              </div>
              <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'8px',padding:'10px 14px',marginTop:'10px',fontSize:'12px',color:'#93c5fd'}}>
                ✅ You will be the first committee member. Remaining {form.committeeSize - 1} members will be elected by the group after launch.
              </div>
            </div>
          )}

          {/* Withdrawal Rules */}
          <div className={styles.fg}><label className={styles.label}>Additional withdrawal rules</label>
            <textarea className={styles.ta} rows={3} placeholder="e.g. Minimum 6 months membership, 30-day notice required..." value={form.withdrawal} onChange={set('withdrawal')} /></div>

          <div className={styles.fg}><label className={styles.label}>If someone quits</label>
            <textarea className={styles.ta} rows={3} placeholder="e.g. 30-day notice required, last contribution forfeited..." value={form.quitting} onChange={set('quitting')} /></div>

          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>📋 Your policy will be shown to all members</div>
            <div className={styles.infoText}>All members must agree to the governance policy before joining.</div>
          </div>

          {error && <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#f87171'}}>{error}</div>}
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