'use client'
import { useState } from 'react'
import styles from './Toggle.module.css'
export default function Toggle({ defaultOn=true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return <div className={`${styles.tog} ${on?styles.on:styles.off}`} onClick={()=>setOn(!on)} />
}