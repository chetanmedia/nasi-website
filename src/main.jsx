import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource-variable/inter'
import '@fontsource/caveat/600.css'
import './styles.css'
import { Nav, Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Sources, RecipeDemo, PlanTote, CookMode } from './sections/Features'
import { Pricing, Faq, Journal, Final, Footer } from './sections/End'

/* The page shifts between the app's two moods: navy (browse) and espresso (recipe). */
function Backdrop() {
  const [mood, setMood] = useState('navy')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setMood(e.target.dataset.mood)), { rootMargin: '-50% 0px -50% 0px' })
    document.querySelectorAll('[data-mood]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <div className="backdrop" aria-hidden="true">
      <div className={`bd navy ${mood === 'navy' ? 'on' : ''}`} />
      <div className={`bd espresso ${mood === 'espresso' ? 'on' : ''}`} />
      <div className="grain" />
    </div>
  )
}

function App() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const h = a.getAttribute('href'), el = h.length > 1 && document.querySelector(h)
      if (!el) return
      e.preventDefault(); lenis.scrollTo(el, { offset: h === '#top' ? 0 : -20, duration: 1.4 })
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(id); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [])
  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Sources />
        <RecipeDemo />
        <PlanTote />
        <CookMode />
        <Pricing />
        <Faq />
        <Journal />
        <Final />
      </main>
      <Footer />
    </MotionConfig>
  )
}

createRoot(document.getElementById('root')).render(<App />)
