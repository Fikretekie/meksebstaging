'use client'
import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getCircles } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

export default function RequestsPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const attributes = await fetchUserAttributes()
        const userId = attributes.sub || ''
        const data = await getCircles(userId)
        if (data.circles) setCircles(data.circles)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <PageHeader title="Join requests" sub="Member requests to join your circles." />

      {loading ? (
        <div style={{color:'rgba(255,255,255,.5)',padding:'2rem'}}>Loading...</div>
      ) : circles.length === 0 ? (
        // No circles yet
        <div style={{
          textAlign:'center',
          padding:'4rem 2rem',
          background:'rgba(255,255,255,.03)',
          border:'1px solid rgba(255,255,255,.08)',
          borderRadius:'16px',
          marginTop:'2rem',
        }}>
          <div style={{fontSize:'4rem',marginBottom:'1rem'}}>📬</div>
          <div style={{fontSize:'1.5rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
            No circles yet
          </div>
          <div style={{fontSize:'14px',color:'rgba(255,255,255,.5)',marginBottom:'1.5rem'}}>
            Create a circle first to start receiving join requests from other members.
          </div>
          <a href="/dashboard/create/" style={{
            display:'inline-block',
            background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color:'white',
            padding:'10px 24px',
            borderRadius:'10px',
            textDecoration:'none',
            fontWeight:600,
            fontSize:'14px',
          }}>
            + Create a circle
          </a>
        </div>
      ) : (
        // Has circles but no requests yet
        <div>
          {/* Your circles summary */}
          <div style={{
            background:'rgba(255,255,255,.03)',
            border:'1px solid rgba(255,255,255,.08)',
            borderRadius:'12px',
            padding:'1rem 1.5rem',
            marginBottom:'1.5rem',
          }}>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)',marginBottom:'0.5rem'}}>
              Your circles accepting requests:
            </div>
            {circles.map((c, i) => (
              <div key={i} style={{
                display:'flex',
                alignItems:'center',
                gap:'0.75rem',
                padding:'8px 0',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,.06)' : 'none',
              }}>
                <div style={{
                  width:32,height:32,borderRadius:'50%',
                  background:'linear-gradient(135deg,#2563eb,#06b6d4)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:'12px',fontWeight:700,color:'white',flexShrink:0,
                }}>
                  {c.name?.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:'14px',fontWeight:600,color:'white'}}>{c.name}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,.4)'}}>
                    ${c.amount}/mo · {c.currency} · Active
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No requests yet */}
          <div style={{
            textAlign:'center',
            padding:'3rem 2rem',
            background:'rgba(255,255,255,.03)',
            border:'1px solid rgba(255,255,255,.08)',
            borderRadius:'16px',
          }}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📬</div>
            <div style={{fontSize:'1.2rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
              No pending requests
            </div>
            <div style={{fontSize:'14px',color:'rgba(255,255,255,.5)',maxWidth:'350px',margin:'0 auto 1.5rem',lineHeight:1.7}}>
              When someone requests to join one of your circles, it will appear here for you to review and approve.
            </div>
            <div style={{
              display:'flex',
              justifyContent:'center',
              gap:'1.5rem',
              flexWrap:'wrap',
            }}>
              {[
                {icon:'👀', label:'Review applicants'},
                {icon:'✅', label:'Accept or decline'},
                {icon:'🔔', label:'Get notified instantly'},
              ].map(f => (
                <div key={f.label} style={{
                  background:'rgba(37,99,235,.1)',
                  border:'1px solid rgba(37,99,235,.2)',
                  borderRadius:'10px',
                  padding:'0.75rem 1rem',
                  color:'#93c5fd',
                  fontSize:'12px',
                  textAlign:'center',
                }}>
                  <div style={{fontSize:'1.2rem',marginBottom:'4px'}}>{f.icon}</div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}