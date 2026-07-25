'use client'
import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function JoinPage() {
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [invite, setInvite] = useState<any>(null)
  const [circle, setCircle] = useState<any>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (!t) {
      setError('Invalid invite link.')
      setLoading(false)
      return
    }
    setToken(t)
    fetchInvite(t)
  }, [])

  const fetchInvite = async (t: string) => {
    try {
      const res = await fetch(`${API_URL}/invites?token=${t}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setInvite(data.invite)
        setCircle(data.circle)
      }
    } catch (err) {
      setError('Failed to load invite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!agreed) { setError('Please agree to the circle policy first.'); return }
    setJoining(true)
    setError('')
    try {
      // Check if user is logged in
      let userId = ''
      let email = ''
      let firstName = ''
      try {
        const session = await fetchAuthSession()
        const payload = session.tokens?.idToken?.payload
        userId = (payload?.sub as string) || ''
        email = (payload?.email as string) || ''
        firstName = (payload?.given_name as string) || email.split('@')[0]
      } catch (e) {
        // Not logged in - redirect to signup with token
        window.location.href = `/auth/signup/index.html?invite=${token}`
        return
      }

      if (!userId) {
        window.location.href = `/auth/signup/index.html?invite=${token}`
        return
      }

      // Join the circle
      const res = await fetch(`${API_URL}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, email, firstName }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setJoining(false)
      } else {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/dashboard/groups/index.html'
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join circle.')
      setJoining(false)
    }
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a',color:'rgba(255,255,255,.5)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48,height:48,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:22,color:'white',margin:'0 auto 1rem'}}>M</div>
        Loading invite...
      </div>
    </div>
  )

  if (error && !invite) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a',color:'white',padding:'2rem'}}>
      <div style={{textAlign:'center',maxWidth:'400px'}}>
        <div style={{fontSize:'48px',marginBottom:'1rem'}}>⚠️</div>
        <h2 style={{marginBottom:'0.5rem'}}>Invite Error</h2>
        <p style={{color:'rgba(255,255,255,.5)',marginBottom:'2rem'}}>{error}</p>
        <a href="/" style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',padding:'12px 28px',borderRadius:'10px',textDecoration:'none',fontWeight:700}}>
          Go to Mekseb →
        </a>
      </div>
    </div>
  )

  if (success) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#060d1a',color:'white',padding:'2rem'}}>
      <div style={{textAlign:'center',maxWidth:'400px'}}>
        <div style={{fontSize:'48px',marginBottom:'1rem'}}>🎉</div>
        <h2 style={{marginBottom:'0.5rem'}}>Welcome to the circle!</h2>
        <p style={{color:'rgba(255,255,255,.5)'}}>Redirecting to your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#060d1a',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{width:'100%',maxWidth:'520px',background:'#0a1628',border:'1px solid rgba(255,255,255,.08)',borderRadius:'20px',padding:'2.5rem'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'2rem'}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,color:'white'}}>M</div>
          <span style={{fontSize:'20px',fontWeight:700,color:'white'}}>Me<span style={{color:'#3b82f6'}}>K</span>seb</span>
        </div>

        <h1 style={{fontSize:'1.6rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
          You're invited! 🎉
        </h1>
        <p style={{color:'rgba(255,255,255,.5)',marginBottom:'2rem',fontSize:'14px'}}>
          You have been invited to join a savings circle on Mekseb.
        </p>

        {/* Circle Details */}
        <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <h2 style={{color:'white',fontSize:'1.2rem',fontWeight:700,marginBottom:'1rem'}}>
            {circle?.name || invite?.circleName}
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
              <span style={{color:'rgba(255,255,255,.5)'}}>Monthly contribution</span>
              <span style={{color:'white',fontWeight:600}}>${circle?.amount} {circle?.currency}</span>
            </div>
            {circle?.goal && (
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                <span style={{color:'rgba(255,255,255,.5)'}}>Savings goal</span>
                <span style={{color:'white',fontWeight:600}}>{circle?.goal}</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
              <span style={{color:'rgba(255,255,255,.5)'}}>Max members</span>
              <span style={{color:'white',fontWeight:600}}>{circle?.maxMembers} members</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
              <span style={{color:'rgba(255,255,255,.5)'}}>Governance</span>
              <span style={{color:'white',fontWeight:600}}>
                {circle?.governanceType === 'committee'
                  ? `Elected committee (${circle?.committeeSize} members)`
                  : `Everyone votes (${circle?.withdrawalThreshold}% threshold)`
                }
              </span>
            </div>
          </div>
          {circle?.description && (
            <p style={{color:'rgba(255,255,255,.6)',fontSize:'13px',marginTop:'1rem',lineHeight:1.6}}>
              {circle.description}
            </p>
          )}
        </div>

        {/* Invite expires */}
        {invite?.expiresAt && (
          <div style={{background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',borderRadius:'8px',padding:'10px 14px',marginBottom:'1.5rem',fontSize:'13px',color:'#fbbf24'}}>
            ⏰ This invite expires on {new Date(invite.expiresAt).toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})}
          </div>
        )}

        {/* Agreement checkbox */}
        <div
          onClick={() => setAgreed(!agreed)}
          style={{display:'flex',alignItems:'flex-start',gap:'12px',cursor:'pointer',marginBottom:'1.5rem',padding:'14px',background:'rgba(255,255,255,.03)',border:`1px solid ${agreed ? '#2563eb' : 'rgba(255,255,255,.1)'}`,borderRadius:'10px',transition:'all .2s'}}
        >
          <div style={{width:20,height:20,borderRadius:'5px',border:`2px solid ${agreed ? '#2563eb' : 'rgba(255,255,255,.3)'}`,background:agreed?'#2563eb':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'1px',transition:'all .2s'}}>
            {agreed && <span style={{color:'white',fontSize:'12px',fontWeight:700}}>✓</span>}
          </div>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,.7)',lineHeight:1.6,margin:0}}>
            I agree to the circle policy, contribution amount of <strong style={{color:'white'}}>${circle?.amount} {circle?.currency}</strong>, and the governance rules. I understand my contributions are binding once I join.
          </p>
        </div>

        {error && (
          <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#f87171',marginBottom:'1rem'}}>
            {error}
          </div>
        )}

        {/* Join button */}
        <button
          onClick={handleJoin}
          disabled={joining || !agreed}
          style={{
            width:'100%', padding:'14px', borderRadius:'10px', border:'none',
            background: agreed ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(255,255,255,.1)',
            color:'white', fontSize:'15px', fontWeight:700, cursor: agreed ? 'pointer' : 'not-allowed',
            transition:'all .2s', marginBottom:'1rem',
            opacity: joining ? 0.7 : 1,
          }}
        >
          {joining ? 'Joining...' : agreed ? 'Join Circle →' : 'Agree to policy to join'}
        </button>

        <p style={{textAlign:'center',fontSize:'12px',color:'rgba(255,255,255,.3)'}}>
          Don't have an account? You'll be asked to create one.
        </p>
      </div>
    </div>
  )
}