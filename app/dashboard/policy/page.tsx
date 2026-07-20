'use client'
import { useEffect, useState } from 'react'
import { getUserAttributes } from '@/lib/getUser'
import { getCircles } from '@/lib/api'
import Link from 'next/link'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

const defaultPolicy = [
  {
    label: 'Contribution rules',
    color: '#60a5fa',
    text: 'Each member contributes the agreed monthly amount on the due date via Mekseb. Payments 5+ days late will be flagged and the circle admin will be notified automatically. After 30 days of non-payment, the admin may review the member status.',
  },
  {
    label: 'Withdrawal policy',
    color: '#60a5fa',
    text: 'Withdrawals require digital signatures from ALL circle members via the Mekseb app. All withdrawals require 30 days processing notice as per Mekseb platform policy. Emergency withdrawals follow the same process but Mekseb will expedite the review.',
  },
  {
    label: 'Quitting the circle',
    color: '#60a5fa',
    text: 'A member wishing to leave must give 30 days notice. All pending contributions must be paid before leaving. Prior savings remain in the circle unless all members agree to a partial withdrawal.',
  },
  {
    label: 'Adding new members',
    color: '#60a5fa',
    text: 'New members require approval from the circle admin. Applicants must complete ID verification on Mekseb and meet any qualification requirements set by the admin. A probationary period may apply at the admin discretion.',
  },
  {
    label: 'Dispute resolution',
    color: '#fbbf24',
    text: 'Disputes between members should be resolved within the circle first. If unresolved, members may contact Mekseb at info@mekseb.com. Mekseb will only intervene in cases of suspected fraud or illegal activity.',
  },
  {
    label: 'Code of conduct',
    color: '#34d399',
    text: 'All members agree to treat each other with respect and honesty. Members must communicate openly about any financial difficulties. Any form of harassment or intimidation will result in immediate removal from the circle.',
  },
]

export default function PolicyPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [selectedCircle, setSelectedCircle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [policy, setPolicy] = useState(defaultPolicy)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'circle' | 'platform'>('circle')

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await getUserAttributes()
        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles && data.circles.length > 0) {
          setCircles(data.circles)
          setSelectedCircle(data.circles[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const updatePolicyText = (index: number, text: string) => {
    setPolicy(prev => prev.map((s, i) => i === index ? { ...s, text } : s))
  }

  const platformPolicies = [
    { label: 'Terms of Service', desc: 'Rules governing use of the Mekseb platform.' },
    { label: 'Privacy Policy', desc: 'How we collect, use and protect your data.' },
    { label: 'Community Guidelines', desc: 'Standards for respectful community behavior.' },
    { label: 'Withdrawal Policy', desc: '30-day notice and digital signature requirements.' },
    { label: 'AML Policy', desc: 'Anti-money laundering compliance and reporting.' },
    { label: 'Refund Policy', desc: 'When and how refunds are processed.' },
  ]

  const viewLinkStyle = {
    color: '#60a5fa',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
  }

  return (
    <div>
      <PageHeader title="Group policy" sub="Mekseb platform policies and your circle rules." />

      {/* Tab switcher */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem', background:'rgba(255,255,255,.05)', padding:'4px', borderRadius:'10px', width:'fit-content' }}>
        {[
          { key: 'circle', label: '✦ Circle Policy' },
          { key: 'platform', label: '📋 Mekseb Policies' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'circle' | 'platform')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === tab.key ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'transparent',
              color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,.5)',
              transition: 'all .2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color:'rgba(255,255,255,.5)', padding:'2rem' }}>Loading...</div>

      ) : activeTab === 'platform' ? (
        <div>
          <div style={{ background:'rgba(37,99,235,.08)', border:'1px solid rgba(37,99,235,.15)', borderRadius:'12px', padding:'16px 20px', marginBottom:'1.5rem', fontSize:'13px', color:'#93c5fd' }}>
            📋 These are Mekseb official platform policies. They apply to all users and circles and cannot be modified.
          </div>
          <div className={styles.card}>
            {platformPolicies.map((p, i) => (
              <div
                key={p.label}
                className={styles.sec}
                style={{ borderBottom: i < platformPolicies.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                  <div>
                    <div className={styles.sLabel} style={{ color:'#60a5fa' }}>{p.label}</div>
                    <p className={styles.sText} style={{ marginBottom:0 }}>{p.desc}</p>
                  </div>
                  <Link href="https://mekseb.com/legal" target="_blank" style={viewLinkStyle}>
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : circles.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'16px' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
          <div style={{ fontSize:'1.2rem', fontWeight:700, color:'white', marginBottom:'0.5rem' }}>No circles yet</div>
          <div style={{ fontSize:'14px', color:'rgba(255,255,255,.5)', marginBottom:'1.5rem' }}>
            Create a circle first to set up your circle policy.
          </div>
          <Link
            href="/dashboard/create/"
            style={{ display:'inline-block', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'white', padding:'10px 24px', borderRadius:'10px', textDecoration:'none', fontWeight:600, fontSize:'14px' }}
          >
            + Create a circle
          </Link>
        </div>

      ) : (
        <div>
          {circles.length > 1 && (
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ fontSize:'13px', color:'rgba(255,255,255,.5)', marginBottom:'8px', display:'block' }}>
                Select circle:
              </label>
              <select
                value={selectedCircle?.circleId}
                onChange={e => setSelectedCircle(circles.find(c => c.circleId === e.target.value))}
                style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'8px', padding:'8px 12px', color:'white', fontSize:'14px', cursor:'pointer' }}
              >
                {circles.map(c => (
                  <option key={c.circleId} value={c.circleId} style={{ background:'#0a1628' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.meta}>
            <div>
              <div className={styles.metaTitle}>📋 {selectedCircle?.name} — Circle Policy</div>
              <div className={styles.metaSub}>Default Mekseb template · Customize for your circle</div>
            </div>
            <span className={styles.badge}>Active</span>
          </div>

          <div style={{ background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'1.5rem', fontSize:'13px', color:'#fbbf24' }}>
            ⚠️ Mekseb platform rules always apply: minimum $10, maximum $10,000/month, 30-day withdrawal notice, all-member digital signatures required. Your circle policy is in addition to these rules.
          </div>

          <div className={styles.card}>
            {policy.map((s, i) => (
              <div
                key={s.label}
                className={styles.sec}
                style={{ borderBottom: i < policy.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}
              >
                <div className={styles.sLabel} style={{ color:s.color }}>{s.label}</div>
                {editing ? (
                  <textarea
                    value={s.text}
                    onChange={e => updatePolicyText(i, e.target.value)}
                    rows={4}
                    style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'8px', padding:'10px 12px', color:'white', fontSize:'13px', lineHeight:1.6, resize:'vertical', marginTop:'8px' }}
                  />
                ) : (
                  <p className={styles.sText}>{s.text}</p>
                )}
              </div>
            ))}
          </div>

          {saved && (
            <div style={{ background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'1rem', color:'#34d399', fontSize:'13px' }}>
              ✅ Circle policy saved successfully!
            </div>
          )}

          <div className={styles.editCard}>
            <div>
              <div className={styles.editTitle}>
                {editing ? 'Edit your circle policy' : 'Customize your circle policy'}
              </div>
              <div className={styles.editSub}>
                {editing
                  ? 'Make your changes above then save. All members will be notified of updates.'
                  : 'This is Mekseb default template. Click Edit to customize it for your circle.'}
              </div>
            </div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {editing ? (
                <>
                  <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : '✓ Save policy'}
                  </button>
                  <button className={styles.btnGhost} onClick={() => { setEditing(false); setPolicy(defaultPolicy) }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.btnPrimary} onClick={() => setEditing(true)}>
                    ✏️ Edit policy
                  </button>
                  <button className={styles.btnGhost} onClick={() => setPolicy(defaultPolicy)}>
                    Reset to default
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}