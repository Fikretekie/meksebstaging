'use client'
import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const memberColors = [
  'linear-gradient(135deg,#2563eb,#06b6d4)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
]

export default function GroupPage() {
  const [circle, setCircle] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [circleId, setCircleId] = useState('')

  // Invite modal state
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  // Group settings modal state
  const [showSettings, setShowSettings] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editGoal, setEditGoal] = useState('')
  const [editMaxMembers, setEditMaxMembers] = useState('')

  // Delete circle state
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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
      if (found) {
        setCircle(found)
        setEditName(found.name || '')
        setEditDesc(found.description || '')
        setEditGoal(found.goal || '')
        setEditMaxMembers(found.maxMembers || '')
      }

      const mRes = await fetch(`${API_URL}/members?circleId=${id}`)
      const mData = await mRes.json()
      if (mData.members) setMembers(mData.members)

    } catch (err) {
      console.error('loadData error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsError('')
    setSettingsSuccess('')

    if (editGoal && isNaN(parseFloat(editGoal))) {
      setSettingsError('Savings goal must be a number.')
      return
    }

    if (editMaxMembers && parseInt(editMaxMembers) < parseInt(circle.maxMembers)) {
      setSettingsError('Max members can only be increased, not decreased.')
      return
    }

    setSettingsLoading(true)
    try {
      const res = await fetch(`${API_URL}/circles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circleId,
          name: editName,
          description: editDesc,
          goal: editGoal,
          maxMembers: parseInt(editMaxMembers),
          updatedBy: userId,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setSettingsError(data.error)
      } else {
        setCircle((prev: any) => ({
          ...prev,
          name: editName,
          description: editDesc,
          goal: editGoal,
          maxMembers: editMaxMembers,
        }))
        setSettingsSuccess('Circle settings updated! ✅')
        setTimeout(() => {
          setSettingsSuccess('')
          setShowSettings(false)
        }, 2000)
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update settings.')
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleDeleteCircle = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.')
      return
    }

    // Check if circle has savings
    const totalSaved = parseFloat(circle.totalSaved || '0')
    if (totalSaved > 0) {
      setDeleteError(`This circle has $${totalSaved} saved. Please withdraw all funds before deleting.`)
      return
    }

    // Check if circle has other members
    const otherMembers = members.filter(m => m.userId !== userId)
    if (otherMembers.length > 0) {
      setDeleteError(`This circle has ${otherMembers.length} other member(s). Ask them to leave before deleting, or start a 75% vote to dissolve.`)
      return
    }

    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch(`${API_URL}/circles?circleId=${circleId}&userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.error) {
        setDeleteError(data.error)
        setDeleteLoading(false)
      } else {
        window.location.href = '/dashboard/groups/index.html'
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete circle.')
      setDeleteLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    setInviteLink('')
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
        setInviteLink(data.inviteUrl)
        setInviteEmail('')
      }
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invite.')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setInviteError('')
    setInviteSuccess('')
    setInviteLink('')
    setInviteLoading(true)
    try {
      const res = await fetch(`${API_URL}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circleId,
          invitedEmail: `link_${Date.now()}@mekseb.com`,
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
        setInviteLink(data.inviteUrl)
        setInviteSuccess('Link generated! Share it with anyone.')
      }
    } catch (err: any) {
      setInviteError(err.message || 'Failed to generate link.')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const isAdmin = circle.createdBy === userId
  const progress = circle.goal && !isNaN(parseFloat(circle.goal))
    ? Math.min((parseFloat(circle.totalSaved || '0') / parseFloat(circle.goal)) * 100, 100)
    : 0

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <a href="/dashboard/groups/index.html" style={{fontSize:'13px',color:'rgba(255,255,255,.5)',textDecoration:'none',display:'block',marginBottom:'8px'}}>← My circles</a>
          <h1 style={{fontSize:'1.8rem',fontWeight:700,color:'white',marginBottom:'4px'}}>{circle.name}</h1>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:'14px'}}>${circle.amount}/month · {circle.currency} · {isAdmin ? 'You are admin' : 'Member'}</p>
        </div>
        {isAdmin && (
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <button
              style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'9px 16px',borderRadius:'9px',fontSize:'13px',cursor:'pointer'}}
              onClick={() => setShowSettings(true)}
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
        )}
      </div>

      {/* Group Settings Modal */}
      {showSettings && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem',overflowY:'auto'}}>
          <div style={{background:'#0a1628',border:'1px solid rgba(255,255,255,.1)',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'480px',margin:'auto'}}>
            <h2 style={{color:'white',marginBottom:'0.5rem'}}>Group settings</h2>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:'13px',marginBottom:'1.5rem'}}>
              Edit your circle details. Changes to contribution amount and governance require member vote.
            </p>

            <form onSubmit={handleSaveSettings}>
              <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'1.5rem'}}>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Circle name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Description</label>
                  <textarea
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    rows={3}
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px',resize:'vertical',fontFamily:'inherit'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Savings goal ($)</label>
                  <input
                    type="number"
                    value={editGoal}
                    onChange={e => setEditGoal(e.target.value)}
                    placeholder="e.g. 10000"
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Max members (can only increase)</label>
                  <input
                    type="number"
                    value={editMaxMembers}
                    onChange={e => setEditMaxMembers(e.target.value)}
                    min={circle.maxMembers}
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px'}}
                  />
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,.3)',marginTop:'4px'}}>Current: {circle.maxMembers} members</p>
                </div>
              </div>

              <div style={{background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',borderRadius:'8px',padding:'10px 14px',fontSize:'12px',color:'#fbbf24',marginBottom:'1rem'}}>
                ⚠️ To change contribution amount, governance type, or currency — requires 75% member vote (coming soon).
              </div>

              {settingsSuccess && (
                <div style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#34d399',marginBottom:'1rem'}}>
                  {settingsSuccess}
                </div>
              )}
              {settingsError && (
                <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#f87171',marginBottom:'1rem'}}>
                  {settingsError}
                </div>
              )}

              <div style={{display:'flex',gap:'10px',marginBottom:'1.5rem'}}>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  style={{flex:1,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',padding:'11px',borderRadius:'8px',border:'none',fontWeight:600,cursor:'pointer',fontSize:'14px'}}
                >
                  {settingsLoading ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSettings(false); setSettingsError(''); setSettingsSuccess('') }}
                  style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',padding:'11px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div style={{borderTop:'1px solid rgba(239,68,68,.15)',paddingTop:'1.25rem'}}>
              <div style={{fontSize:'12px',color:'#f87171',fontWeight:600,marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.5px'}}>⚠️ Danger Zone</div>
              <button
                type="button"
                onClick={() => { setShowSettings(false); setShowDelete(true) }}
                style={{width:'100%',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.25)',color:'#f87171',padding:'10px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:600}}
              >
                🗑️ Delete this circle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Circle Modal */}
      {showDelete && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem'}}>
          <div style={{background:'#0a1628',border:'1px solid rgba(239,68,68,.3)',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'440px'}}>
            <h2 style={{color:'#f87171',marginBottom:'0.5rem'}}>🗑️ Delete circle</h2>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:'13px',marginBottom:'1.5rem'}}>
              This action is permanent and cannot be undone. All circle data will be deleted.
            </p>

            {/* Checks */}
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}>
                <span style={{color: parseFloat(circle.totalSaved || '0') === 0 ? '#34d399' : '#f87171'}}>
                  {parseFloat(circle.totalSaved || '0') === 0 ? '✅' : '❌'}
                </span>
                <span style={{color:'rgba(255,255,255,.7)'}}>
                  Balance: ${circle.totalSaved || 0} saved
                  {parseFloat(circle.totalSaved || '0') > 0 && <span style={{color:'#f87171'}}> — withdraw funds first!</span>}
                </span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}>
                <span style={{color: members.filter(m => m.userId !== userId).length === 0 ? '#34d399' : '#f87171'}}>
                  {members.filter(m => m.userId !== userId).length === 0 ? '✅' : '❌'}
                </span>
                <span style={{color:'rgba(255,255,255,.7)'}}>
                  Members: {members.length} total
                  {members.filter(m => m.userId !== userId).length > 0 && <span style={{color:'#f87171'}}> — ask others to leave first!</span>}
                </span>
              </div>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>
                Type DELETE to confirm
              </label>
              <input
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                style={{width:'100%',background:'rgba(239,68,68,.05)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px'}}
              />
            </div>

            {deleteError && (
              <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'8px',padding:'10px',fontSize:'13px',color:'#f87171',marginBottom:'1rem'}}>
                {deleteError}
              </div>
            )}

            <div style={{display:'flex',gap:'10px'}}>
              <button
                onClick={handleDeleteCircle}
                disabled={deleteLoading || deleteConfirm !== 'DELETE'}
                style={{flex:1,background: deleteConfirm === 'DELETE' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'rgba(239,68,68,.1)',color:'white',padding:'11px',borderRadius:'8px',border:'none',fontWeight:600,cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',fontSize:'14px',opacity: deleteLoading ? 0.7 : 1}}
              >
                {deleteLoading ? 'Deleting...' : 'Delete circle'}
              </button>
              <button
                onClick={() => { setShowDelete(false); setDeleteConfirm(''); setDeleteError('') }}
                style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',padding:'11px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem'}}>
          <div style={{background:'#0a1628',border:'1px solid rgba(255,255,255,.1)',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'460px'}}>
            <h2 style={{color:'white',marginBottom:'0.5rem'}}>Invite a member</h2>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:'13px',marginBottom:'1.5rem'}}>
              Send an invite email or generate a shareable link.
            </p>
            <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'8px',padding:'12px',marginBottom:'1.5rem',fontSize:'12px',color:'#93c5fd'}}>
              <div>💰 Contribution: <strong>${circle.amount} {circle.currency}/month</strong></div>
              <div style={{marginTop:'4px'}}>🏛️ Governance: <strong>
                {circle.governanceType === 'committee'
                  ? `Elected committee`
                  : `Everyone votes (${circle.withdrawalThreshold || 75}% threshold)`
                }
              </strong></div>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>
                Send invite by email
              </label>
              <form onSubmit={handleInvite} style={{display:'flex',gap:'8px'}}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="friend@email.com"
                  style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'white',fontSize:'14px'}}
                />
                <button type="submit" disabled={inviteLoading}
                  style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',padding:'10px 16px',borderRadius:'8px',border:'none',fontWeight:600,cursor:'pointer',fontSize:'13px',whiteSpace:'nowrap'}}>
                  {inviteLoading ? '...' : 'Send →'}
                </button>
              </form>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,.08)'}}/>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,.3)'}}>or</span>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,.08)'}}/>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>
                Share a link
              </label>
              {inviteLink ? (
                <div style={{display:'flex',gap:'8px'}}>
                  <input readOnly value={inviteLink}
                    style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'rgba(255,255,255,.7)',fontSize:'12px'}}/>
                  <button onClick={handleCopyLink}
                    style={{background: copied ? 'rgba(16,185,129,.2)' : 'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.1)',color: copied ? '#34d399' : 'white',padding:'10px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap'}}>
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              ) : (
                <button onClick={handleGenerateLink} disabled={inviteLoading}
                  style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'white',padding:'10px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>
                  {inviteLoading ? 'Generating...' : '🔗 Generate invite link'}
                </button>
              )}
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
            <button
              onClick={() => { setShowInvite(false); setInviteEmail(''); setInviteError(''); setInviteSuccess(''); setInviteLink('') }}
              style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',padding:'11px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'14px',marginBottom:'2rem'}}>
        {[
          { label:'Total saved', value:`$${circle.totalSaved || 0}` },
          { label:'Monthly amount', value:`$${circle.amount}` },
          { label:'Status', value:circle.status },
          { label:'Members', value:`${members.length} of ${circle.maxMembers}` },
        ].map(s => (
          <div key={s.label} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1rem'}}>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)',marginBottom:'4px'}}>{s.label}</div>
            <div style={{fontSize:'16px',fontWeight:700,color:'white'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      {circle.goal && !isNaN(parseFloat(circle.goal)) && (
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

      {/* Circle details + Governance */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'2rem'}}>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'12px',padding:'1.25rem'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',marginBottom:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>Circle details</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Circle name</span><span style={{color:'white'}}>{circle.name}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'rgba(255,255,255,.5)'}}>Contribution</span><span style={{color:'white'}}>${circle.amount}/mo · {circle.currency}</span></div>
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
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px'}}>
            Members ({members.length})
          </div>
          {isAdmin && (
            <button onClick={() => setShowInvite(true)}
              style={{fontSize:'12px',color:'#3b82f6',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>
              + Invite member
            </button>
          )}
        </div>
        {members.length === 0 ? (
          <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)',textAlign:'center',padding:'1rem'}}>
            👥 You are the only member. {isAdmin && <span style={{color:'#3b82f6',cursor:'pointer'}} onClick={() => setShowInvite(true)}>Invite others to join!</span>}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {members.map((m, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom: i < members.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:memberColors[i % 5],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'white',flexShrink:0}}>
                    {(m.displayName || m.email || 'M').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600,color:'white'}}>{m.displayName || m.email?.split('@')[0]}</div>
                    <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)'}}>{m.email} · Joined {new Date(m.joinedAt).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'11px',fontWeight:600,padding:'3px 10px',borderRadius:'100px',background: m.role === 'admin' ? 'rgba(37,99,235,.2)' : 'rgba(255,255,255,.06)',color: m.role === 'admin' ? '#60a5fa' : 'rgba(255,255,255,.5)'}}>
                    {m.role === 'admin' ? '👑 Admin' : 'Member'}
                  </span>
                  <span style={{fontSize:'11px',fontWeight:600,padding:'3px 10px',borderRadius:'100px',background:'rgba(16,185,129,.1)',color:'#34d399'}}>
                    ✓ Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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