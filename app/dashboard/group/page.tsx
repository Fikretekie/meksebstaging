'use client'
import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import styles from './page.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function GroupPage() {
  const [circle, setCircle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [circleId, setCircleId] = useState('')

  // Invite modal state
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [inviteError, setInviteError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (!id) return
    setCircleId(id)
    loadData(id)
  }, [])

  const loadData = async (id: string) => {
    try {
      const session = await fetchAuthSession()
      const payload = session.tokens?.idToken?.payload
      const uid = (payload?.sub as string) || ''
      setUserId(uid)

      const res = await fetch(`${API_URL}/circles?userId=${uid}`)
      const data = await res.json()
      const found = data.circles?.find((c: any) => c.circleId === id)
      if (found) setCircle(found)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    if (!inviteEmail) { setInviteError('Please enter an email address.'); return }
    setInviteLoading(true)
    try {
      const res = await fetch(`${API_URL}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circleId,
          invitedEmail: inviteEmail,
          invitedBy: userId,
          circleName: circle?.name,
          amount: circle?.amount,
          currency: circle?.currency,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setInviteError(data.error)
      } else {
        setInviteSuccess(`Invite sent to ${inviteEmail}! ✅`)
        setInviteEmail('')
        setTimeout(() => {
          setInviteSuccess('')
          setShowInvite(false)
        }, 3000)
      }
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invite.')
    } finally {
      setInviteLoading(false)
    }
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',color:'rgba(255,255,255,.5)'}}>
      Loading...
    </div>
  )

  if (!circle) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',color:'rgba(255,255,255,.5)'}}>
      Circle not found.
    </div>
  )

  const progress = circle.goal ? Math.min((circle.totalSaved / parseFloat(circle.goal)) * 100, 100) : 0

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <a href="/dashboard/groups/index.html" style={{fontSize:'13px',color:'rgba(255,255,255,.5)',textDecoration:'none',display:'block',marginBottom:'8px'}}>← My circles</a>
          <h1 style={{fontSize:'1.8rem',fontWeight:700,color:'white',marginBottom:'4px'}}>{circle.name}</h1>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:'14px'}}>${circle.amount}/month · {circle.currency} · You are admin</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button
            style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'9px 16px',borderRadius:'9px',fontSize:'13px',cursor:'pointer'}}
            onClick={() => alert('Group settings coming soon!')}
          >
            Group settings
          </button>
          <button
            style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',padding:'9px 16px',borderRadius:'9px',fontSize:'13px',fontWeight:600,border:'none',cursor:'pointer'}}
            onClick={() => setShowInvite(true)}
          >
            + Invite member
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem'}}>
          <div style={{background:'#0a1628',border:'1px solid rgba(255,255,255,.1)',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'440px'}}>
            <h2 style={{color:'white',marginBottom:'0.5rem'}}>Invite a member</h2>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:'13px',marginBottom:'1.5rem'}}>
              They will receive an email with the circle details and policy to review before joining.
            </p>
            <form onSubmit={handleInvite}>
              <div style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="friend@email.com"
                  style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'11px 14px',color:'white',fontSize:'14px'}}
                />
              </div>

              <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'8px',padding:'12px',marginBottom:'1rem',fontSize:'12px',color:'#93c5fd'}}>
                <div>💰 Contribution: <strong>${circle.amount} {circle.currency}/month</strong></div>
                <div style={{marginTop:'4px'}}>🏛️ Governance: <strong>
                  {circle.governanceType === 'committee'
                    ? `Elected committee`
                    : `Everyone votes (${circle.withdrawalThreshold || 75}% threshold)`
                  }
                </strong></div>
              </div>

              {inviteSuccess && (
                <div style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#34d399',marginBottom:'1rem'}}>
                  {inviteSuccess}
                </div>
              )}
              {inviteError && (
                <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#f87171',marginBottom:'1rem'}}>
                  {inviteError}
                </div>
              )}

              <div style={{display:'flex',gap:'10px'}}>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  style={{flex:1,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',padding:'11px',borderRadius:'8px',border:'none',fontWeight:600,cursor:'pointer',fontSize:'14px'}}
                >
                  {inviteLoading ? 'Sending...' : 'Send invite →'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowInvite(false); setInviteEmail(''); setInviteError(''); setInviteSuccess('') }}
                  style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',padding:'11px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'14px',marginBottom:'2rem'}}>
        {[
          { label:'Total saved', value:`$${circle.totalSaved || 0}` },
          { label:'Monthly amount', value:`$${circle.amount}` },
          { label:'Status', value:circle.status },
          { label:'Goal', value:circle.goal || 'Not set' },
        ].map(s => (
          <div key={s.label} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1rem'}}>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>{s.label}</div>
            <div style={{fontSize:'16px',fontWeight:700,color:'white'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      {circle.goal && (
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem',marginBottom:'2rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'13px'}}>
            <span style={{color:'rgba(255,255,255,.5)'}}>Progress to goal</span>
            <span style={{color:'white',fontWeight:600}}>${circle.totalSaved || 0} / ${circle.goal} ({Math.round(progress)}%)</span>
          </div>
          <div style={{height:'8px',background:'rgba(255,255,255,.08)',borderRadius:'100px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#2563eb,#06b6d4)',borderRadius:'100px',transition:'width .5s'}}/>
          </div>
        </div>
      )}

      {/* Circle details */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'2rem'}}>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>Circle details</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Circle name</span><span style={{color:'white'}}>{circle.name}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Monthly contribution</span><span style={{color:'white'}}>${circle.amount}/mo · {circle.currency}</span></div>
            {circle.description && <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Description</span><span style={{color:'white'}}>{circle.description}</span></div>}
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Created</span><span style={{color:'white'}}>{circle.createdAt ? new Date(circle.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '-'}</span></div>
          </div>
        </div>

        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>Governance</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <span style={{color:'rgba(255,255,255,.5)'}}>Type</span>
              <span style={{color:'white'}}>{circle.governanceType === 'committee' ? '🏛️ Elected committee' : '👥 Everyone votes'}</span>
            </div>
            {circle.governanceType !== 'committee' && (
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'rgba(255,255,255,.5)'}}>Threshold</span>
                <span style={{color:'white'}}>{circle.withdrawalThreshold || 75}% must approve</span>
              </div>
            )}
            {circle.governanceType === 'committee' && (
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'rgba(255,255,255,.5)'}}>Committee size</span>
                <span style={{color:'white'}}>{circle.committeeSize} members</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members */}
      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem',marginBottom:'2rem'}}>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>Members</div>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)',textAlign:'center',padding:'1rem'}}>
          👥 You are the only member. <span style={{color:'#3b82f6',cursor:'pointer'}} onClick={() => setShowInvite(true)}>Invite others to join!</span>
        </div>
      </div>

      {/* Policy */}
      <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>Group policy summary</div>
          <a href="/dashboard/policy/index.html" style={{fontSize:'12px',color:'#3b82f6',textDecoration:'none'}}>View full policy →</a>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Contribution</span><span style={{color:'white'}}>${circle.amount}/mo on the 1st of every month</span></div>
          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Withdrawal</span><span style={{color:'white'}}>{circle.governanceType === 'committee' ? `Committee approval required` : `${circle.withdrawalThreshold || 75}% member approval required`}</span></div>
          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>New members</span><span style={{color:'white'}}>Invite only</span></div>
        </div>
      </div>
    </div>
  )
}