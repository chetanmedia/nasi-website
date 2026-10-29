import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Phone, Icon, AppIcon, AppStore, Scene, SourceMark } from '../ui'
import { HomeScreen } from '../screens'
import { img, byId } from '../data'

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40))
  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <a className="brand" href="#top" aria-label="Nasi home"><AppIcon size={34} /><b>Nasi</b></a>
      <nav aria-label="Main">
        <a href="#how">How it works</a><a href="#sources">Import</a><a href="#plan">Meal plan</a><a href="#pricing">Pricing</a><a href="./blog/">Blog</a>
      </nav>
      <AppStore small />
    </header>
  )
}

const START = ['noodles', 'lemak', 'paneer', 'shak', 'burrata', 'tofu']
const INCOMING = [
  { id: 'salmon', src: 'TikTok', who: '@kitchenkenji_eats' },
  { id: 'mango', src: 'Instagram', who: '@thaistreetsweets' },
  { id: 'marry', src: 'Facebook', who: 'Sunday Suppers' }
]

export function Hero() {
  const [ids, setIds] = useState(START)
  const [fresh, setFresh] = useState(null)
  const [fly, setFly] = useState(null)
  const [toast, setToast] = useState(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 120])
  const fade = useTransform(scrollY, [0, 600], [1, 0.2])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let n = 0, timers = []
    const cycle = () => {
      const it = INCOMING[n % INCOMING.length]
      if (n > 0 && n % INCOMING.length === 0) { setIds(START); setFresh(null) }
      setFly({ ...it, k: n })
      timers.push(setTimeout(() => {
        setFly(null)
        setIds((cur) => [it.id, ...cur.filter((x) => x !== it.id)].slice(0, 6))
        setFresh(it.id)
        setToast({ ...it, k: n })
      }, 1500))
      timers.push(setTimeout(() => setToast(null), 3400))
      n++
    }
    timers.push(setTimeout(cycle, 1400))
    const id = setInterval(cycle, 4200)
    return () => { clearInterval(id); timers.forEach(clearTimeout) }
  }, [])

  return (
    <section className="hero" id="top" data-mood="navy">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <AppIcon size={22} /> Nasi: Recipe Saver for iPhone
          </motion.p>
          <h1 className="h1">
            {['Saw it on a reel?', 'Cook it tonight.'].map((l, i) => (
              <span className={`ln ${i ? 'gold' : ''}`} key={l}>
                <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.14 }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
            Share a TikTok, Instagram or Facebook reel to Nasi. Get a clean recipe with exact amounts and step-by-step instructions.
          </motion.p>
          <motion.div className="cta-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}>
            <AppStore />
            <a className="ghost" href="#how">See how it works <Icon n="chevd" size={18} /></a>
          </motion.div>
        </div>

        <motion.div className="hero-art" style={{ y, opacity: fade }}>
          <Scene className="hero-3d" load={() => import('../three/HeroScene')} />
          <motion.div className="hero-phone" initial={{ opacity: 0, y: 80, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
            <Phone className="hp">
              <HomeScreen ids={ids} freshId={fresh} liked={['lemak']} />
              <AnimatePresence>
                {toast && (
                  <motion.div key={toast.k} className="itoast" initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -90, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
                    <AppIcon size={40} /><div><b>Recipe imported</b><small>{byId[toast.id].t} · from {toast.src}</small></div><span className="ok"><Icon n="check" size={16} sw={3} /></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Phone>
          </motion.div>
          <AnimatePresence>
            {fly && (
              <motion.div key={fly.k} className="flyreel"
                initial={{ x: '-150%', y: 40, rotate: -14, scale: 1, opacity: 0 }}
                animate={{ x: ['-150%', '-118%', '-20%'], y: [40, 10, -60], rotate: [-14, -8, 6], scale: [1, 1, 0.25], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, times: [0, 0.35, 1], ease: 'easeInOut' }}>
                <img src={img(fly.id)} alt="" />
                <span className="fr-play"><Icon n="play" size={22} fill="currentColor" sw={0} /></span>
                <span className="fr-src"><SourceMark src={fly.src} size={12} />{fly.src}</span>
                <span className="fr-who">{fly.who}</span>
                <span className="fr-share"><Icon n="share" size={13} />Share to Nasi</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
