'use client'
import { useEffect, useState } from 'react'
import { signOut, updatePassword, deleteUser } from 'aws-amplify/auth'
import { getUserAttributes } from '@/lib/getUser'
import styles from './page.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div
      onClick={() => setOn(!on)}
      style={{
        width: 40, height: 22, borderRadius: 100,
        background: on ? '#2563eb' : 'rgba(255,255,255,.15)',
        cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: 'white', transition: 'left .2s',
      }}/>
    </div>
  )
}

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  // Change password state
  const [showPwForm, setShowPwForm] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const attributes = await getUserAttributes()
        setEmail(attributes.email || '')
        setUserId(attributes.sub || '')
        const name = attributes.email?.split('@')[0] || ''
        setFirstName(name)
        setEditFirstName(name)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return }
    setPwLoading(true)
    try {
      await updatePassword({ oldPassword: oldPw, newPassword: newPw })
      setPwSuccess(true)
      setShowPwForm(false)
      setOldPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          firstName: editFirstName,
          lastName: editLastName,
          country: 'United States',
        }),
      })
      setFirstName(editFirstName)
      setLastName(editLastName)
      setShowEditProfile(false)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    setDeleteLoading(true)
    try {
      // Delete from DynamoDB first
      await fetch(`${API_URL}/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      // Send admin notification
      await fetch(`${API_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'USER_LEFT', data: { email } }),
      })
      // Delete from Cognito
      await deleteUser()
      window.location.href = '/'
    } catch (err: any) {
      console.error(err)
      setDeleteLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ global: true })
    } catch (err) {
      console.error(err)
    } finally {
      window.location.href = '/auth/login/index.html'
    }
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0]
  const memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <div>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.6rem',fontWeight:700,letterSpacing:'-.5px'}}>Settings</h1>
        <p style={{fontSize:'13.5px',color:'rgba(255,255,255,.5)',marginTop:4}}>Manage your account, security, and preferences.</p>
      </div>

      {loading ? (
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      ) : (
        <div className={styles.grid}>

          {/* Profile */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(37,99,235,.14)'}}>👤</div>
              <div className={styles.cardTitle}>Profile</div>
            </div>

            {profileSuccess && (
              <div style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#34d399',marginBottom:'1rem'}}>
                ✅ Profile updated successfully!
              </div>
            )}

            {showEditProfile ? (
              <form onSubmit={handleEditProfile}>
                <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'1rem'}}>
                  <div>
                    <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'4px'}}>FIRST NAME</label>
                    <input
                      value={editFirstName}
                      onChange={e => setEditFirstName(e.target.value)}
                      style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px'}}
                    />
                  </div>
                  <div>
                    <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'4px'}}>LAST NAME</label>
                    <input
                      value={editLastName}
                      onChange={e => setEditLastName(e.target.value)}
                      style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px'}}
                    />
                  </div>
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button type="submit" disabled={profileLoading} style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',border:'none',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>
                    {profileLoading ? 'Saving...' : 'Save changes'}
                  </button>
                  <button type="button" onClick={() => setShowEditProfile(false)} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',cursor:'pointer'}}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.row}><span>Full name</span><span className={styles.val}>{fullName}</span></div>
                <div className={styles.row}><span>Email</span><span className={styles.val}>{email}</span></div>
                <div className={styles.row}><span>Account status</span><span style={{color:'#34d399',fontSize:'13px',fontWeight:600}}>✓ Active</span></div>
                <div className={styles.row}><span>Member since</span><span className={styles.val}>{memberSince}</span></div>
                <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}} onClick={() => setShowEditProfile(true)}>
                  Edit profile
                </button>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(6,182,212,.14)'}}>🔔</div>
              <div className={styles.cardTitle}>Notifications</div>
            </div>
            <div className={styles.row}><span>Payment reminders</span><Toggle defaultOn={true}/></div>
            <div className={styles.row}><span>Late payment alerts</span><Toggle defaultOn={true}/></div>
            <div className={styles.row}><span>Join requests</span><Toggle defaultOn={true}/></div>
            <div className={styles.row}><span>Circle activity</span><Toggle defaultOn={true}/></div>
            <div className={styles.row}><span>Email digest</span><Toggle defaultOn={false}/></div>
            <div className={styles.row}><span>SMS alerts</span><Toggle defaultOn={false}/></div>
          </div>

          {/* Payment method */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(245,158,11,.14)'}}>💳</div>
              <div className={styles.cardTitle}>Payment method</div>
            </div>
            <div className={styles.row}>
              <span>Status</span>
              <span style={{color:'#fbbf24',fontSize:'13px'}}>Coming soon</span>
            </div>
            <div style={{background:'rgba(37,99,235,.08)',border:'1px solid rgba(37,99,235,.15)',borderRadius:'10px',padding:'12px',marginTop:'1rem',fontSize:'13px',color:'rgba(255,255,255,.5)',lineHeight:1.6}}>
              💳 ACH bank transfers and card payments coming soon.
            </div>
          </div>

          {/* Security */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(139,92,246,.14)'}}>🔒</div>
              <div className={styles.cardTitle}>Security</div>
            </div>
            <div className={styles.row}><span>Authentication</span><span style={{color:'#34d399',fontSize:'13px',fontWeight:600}}>✓ AWS Cognito</span></div>
            <div className={styles.row}><span>Email verified</span><span style={{color:'#34d399',fontSize:'13px',fontWeight:600}}>✓ Verified</span></div>
            <div className={styles.row}><span>Two-factor auth</span><Toggle defaultOn={false}/></div>
            <div className={styles.row}><span>Login alerts</span><Toggle defaultOn={true}/></div>

            {pwSuccess && (
              <div style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#34d399',margin:'1rem 0'}}>
                ✅ Password changed successfully!
              </div>
            )}

            {showPwForm ? (
              <form onSubmit={handleChangePassword} style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'10px'}}>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'4px'}}>CURRENT PASSWORD</label>
                  <input type="password" value={oldPw} onChange={e=>setOldPw(e.target.value)} placeholder="Current password"
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'4px'}}>NEW PASSWORD</label>
                  <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="New password (min 8 chars)"
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:'11px',color:'rgba(255,255,255,.5)',display:'block',marginBottom:'4px'}}>CONFIRM NEW PASSWORD</label>
                  <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Repeat new password"
                    style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px'}}
                  />
                </div>
                {pwError && <div style={{color:'#f87171',fontSize:'13px'}}>{pwError}</div>}
                <div style={{display:'flex',gap:'8px'}}>
                  <button type="submit" disabled={pwLoading} style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'white',border:'none',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>
                    {pwLoading ? 'Changing...' : 'Change password'}
                  </button>
                  <button type="button" onClick={() => setShowPwForm(false)} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',cursor:'pointer'}}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}} onClick={() => setShowPwForm(true)}>
                Change password
              </button>
            )}
          </div>

          {/* Network profile */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(16,185,129,.14)'}}>🌐</div>
              <div className={styles.cardTitle}>Network profile</div>
            </div>
            <div className={styles.row}><span>Profile visible</span><Toggle defaultOn={true}/></div>
            <div className={styles.row}>
              <span>Status</span>
              <span style={{color:'#fbbf24',fontSize:'13px'}}>Coming soon</span>
            </div>
            <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',marginTop:'1rem',fontSize:'13px',color:'rgba(255,255,255,.5)',lineHeight:1.6}}>
              🌐 Network profile customization coming soon.
            </div>
          </div>

          {/* Danger zone */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.ico} style={{background:'rgba(239,68,68,.12)'}}>⚠️</div>
              <div className={styles.cardTitle}>Danger zone</div>
            </div>
            <div className={styles.row}>
              <span>Sign out</span>
              <span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer',fontWeight:600}} onClick={handleSignOut}>
                Sign out →
              </span>
            </div>
            <div className={styles.row}>
              <span>Download my data</span>
              <span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer',fontWeight:600}}
                onClick={() => alert('Data export coming soon.')}>
                Export →
              </span>
            </div>

            {showDeleteConfirm ? (
              <div style={{marginTop:'1rem',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'10px',padding:'1rem'}}>
                <p style={{fontSize:'13px',color:'#f87171',marginBottom:'0.75rem'}}>
                  ⚠️ This action is permanent and cannot be undone. All your data will be deleted.
                </p>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,.5)',marginBottom:'0.75rem'}}>
                  Type <strong style={{color:'white'}}>DELETE</strong> to confirm:
                </p>
                <input
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'14px',marginBottom:'0.75rem'}}
                />
                <div style={{display:'flex',gap:'8px'}}>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                    style={{background:'#dc2626',color:'white',border:'none',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer',opacity:deleteConfirmText !== 'DELETE' ? 0.5 : 1}}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete my account'}
                  </button>
                  <button onClick={() => {setShowDeleteConfirm(false); setDeleteConfirmText('')}} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',borderRadius:'8px',padding:'9px 16px',fontSize:'13px',cursor:'pointer'}}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.row}>
                <span>Delete account</span>
                <span style={{color:'#f87171',fontSize:'13px',cursor:'pointer',fontWeight:600}} onClick={() => setShowDeleteConfirm(true)}>
                  Delete →
                </span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}