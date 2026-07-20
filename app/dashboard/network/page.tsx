'use client'
import { useEffect, useState } from 'react'
import { getUserAttributes } from '@/lib/getUser'
import PageHeader from '@/components/dashboard/PageHeader'
import styles from './page.module.css'

export default function NetworkPage() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const attributes = await getUserAttributes()
        const email = attributes.email || ''
        setUserName(email.split('@')[0])
      } catch (err) {
        console.error(err)
      }
    }
    loadUser()
  }, [])

  return (
    <div>
      <PageHeader title="Community network" sub="Find people who share your savings vision and build a circle together." />

      {/* Coming Soon */}
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '16px',
        marginTop: '2rem',
      }}>
        <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🌐</div>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
          Network coming soon
        </div>
        <div style={{fontSize:'14px',color:'rgba(255,255,255,.5)',maxWidth:'400px',margin:'0 auto 2rem',lineHeight:1.7}}>
          As more members join Mekseb, you'll be able to discover other savers, connect with people who share your vision, and build circles together.
        </div>
        <div style={{
          display:'flex',
          justifyContent:'center',
          gap:'2rem',
          marginBottom:'2rem',
          flexWrap:'wrap',
        }}>
          {[
            {icon:'👥', label:'Find circle members'},
            {icon:'🎯', label:'Match by savings goal'},
            {icon:'🌍', label:'Connect globally'},
            {icon:'✅', label:'Verified profiles'},
          ].map(f => (
            <div key={f.label} style={{
              background:'rgba(37,99,235,.1)',
              border:'1px solid rgba(37,99,235,.2)',
              borderRadius:'12px',
              padding:'1rem 1.5rem',
              color:'#93c5fd',
              fontSize:'13px',
              textAlign:'center',
            }}>
              <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{f.icon}</div>
              {f.label}
            </div>
          ))}
        </div>
        <div style={{
          background:'rgba(16,185,129,.1)',
          border:'1px solid rgba(16,185,129,.2)',
          borderRadius:'10px',
          padding:'12px 20px',
          color:'#34d399',
          fontSize:'13px',
          display:'inline-block',
        }}>
          🎉 You're one of the early members, {userName}! Invite friends to grow the network.
        </div>
      </div>
    </div>
  )
}