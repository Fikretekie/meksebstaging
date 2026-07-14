'use client'
import { useEffect } from 'react'
import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Network from '@/components/landing/Network'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/dashboard')) {
      window.location.replace(path)
    }
  }, [])

  return (
    <main>
      <Nav />
      <Hero />
      <div className="divider" />
      <Features />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <Network />
      <div className="divider" />
      <Testimonials />
      <div className="divider" />
      <CTA />
      <Footer />
    </main>
  )
}