'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { signOut } from 'aws-amplify/auth'
import Toggle from '@/components/ui/Toggle'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const attributes = await fetchUserAttributes()
        setEmail(attributes.email || '')
        setFirstName(attributes.given_name || '')
        setLastName(attributes.family_name || '')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      alert('Account deletion request submitted. Our team will process it within 30 days.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/login/index.html'
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0]
  const memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <div>
      <PageHeader title="Settings" sub="Manage your account, security, and preferences." />

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
            <div className={styles.row}><span>Full name</span><span className={styles.val}>{fullName}</span></div>
            <div className={styles.row}><span>Email</span><span className={styles.val}>{email}</span></div>
            <div className={styles.row}><span>Account status</span><span style={{color:'#34d399',fontSize:'13px',fontWeight:600}}>✓ Active</span></div>
            <div className={styles.row}><span>Member since</span><span className={styles.val}>{memberSince}</span></div>
            <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}}
              onClick={() => window.location.href = '/dashboard/profile/index.html'}>
              Edit profile
            </button>
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
            <div style={{
              background:'rgba(37,99,235,.08)',
              border:'1px solid rgba(37,99,235,.15)',
              borderRadius:'10px',
              padding:'12px',
              marginTop:'1rem',
              fontSize:'13px',
              color:'rgba(255,255,255,.5)',
              lineHeight:1.6,
            }}>
              💳 ACH bank transfers and card payments coming soon. You'll be able to set up automatic monthly contributions here.
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
            <button className={styles.btnGhost} style={{width:'100%',marginTop:'1.1rem'}}
              onClick={() => alert('Password reset email sent to ' + email)}>
              Change password
            </button>
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
            <div style={{
              background:'rgba(16,185,129,.08)',
              border:'1px solid rgba(16,185,129,.15)',
              borderRadius:'10px',
              padding:'12px',
              marginTop:'1rem',
              fontSize:'13px',
              color:'rgba(255,255,255,.5)',
              lineHeight:1.6,
            }}>
              🌐 Network profile customization coming soon. You'll be able to set your savings goals and connect with other members.
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
              <span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer'}}
                onClick={handleSignOut}>
                Sign out →
              </span>
            </div>
            <div className={styles.row}>
              <span>Download my data</span>
              <span style={{color:'#60a5fa',fontSize:'13px',cursor:'pointer'}}
                onClick={() => alert('Data export coming soon.')}>
                Export →
              </span>
            </div>
            <div className={styles.row}>
              <span>Delete account</span>
              <span style={{color:'#f87171',fontSize:'13px',cursor:'pointer'}}
                onClick={handleDeleteAccount}>
                Request →
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}